import { existsSync } from "$std/fs/exists.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import Order from "../interfaces/Order.ts";
import { create_article, get_articles_by_queries, update_article, update_order } from "./database.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import { ctf } from "./formatting_compiler.ts";
import { Article } from "../interfaces/Article.ts";
import { add_order_to_compilation_article } from "./media_mention_article_compilation_writer.ts";
import { create_new_personalized_article } from "./media_mention_article_personalized_writer.ts";

// Cache for source configs to avoid repeated file I/O
const source_config_cache = new Map<string, MediaMentionSourceConfig>();

export async function load_source_data(source: string)
{
    // Check cache first
    if (source_config_cache.has(source)) {
        return source_config_cache.get(source)!;
    }

    const source_path = `./config/media_mention_sources/${source}.json`;

    if (!existsSync(source_path))
    {
        send_error(`Source config file for ${source} does not exist.`);
        return null;
    }

    const file_content = await Deno.readTextFile(source_path);
    const source_data = JSON.parse(file_content) as MediaMentionSourceConfig;

    // Cache the result
    source_config_cache.set(source, source_data);

    return source_data;
}

// Preload all source configs for faster access
export async function preload_all_source_configs() {
    const source_dir = "./config/media_mention_sources/";
    const files = [];
    
    for await (const dirEntry of Deno.readDir(source_dir)) {
        if (dirEntry.isFile && dirEntry.name.endsWith(".json")) {
            const source_id = dirEntry.name.replace(".json", "");
            files.push(load_source_data(source_id));
        }
    }
    
    await Promise.all(files);
    send_log("log", `Preloaded ${source_config_cache.size} source configs into cache`);
}


export async function write_article_for_order(order: Order)
{
    send_log("log",`Writing article for order #${order.id}...`)

    const media_mention_data = order.data as OrderMediaMentionData;
    let source_id = "";

    for (const selected_source of media_mention_data.selected_sources) {
        if (media_mention_data.completed_sources.includes(selected_source)) continue;
        source_id = selected_source;
        break;
    }

    if (source_id == "") { 
        send_error(`No source found for order #${order.id}.`);
        return; 
    }
    
    const source_data = await load_source_data(source_id) as MediaMentionSourceConfig;
    
    if (source_data == null) { 
        send_error(`Source config file for ${source_id} does not exist.`);
        return; 
    }
    
    let article: Article | { error: string };
    
    if (source_data.type == "compilation")
    {
        article = await add_order_to_compilation_article(order, source_data);
    }
    else if (source_data.type == "personalized")
    {
        article = await create_new_personalized_article(order, source_data);
    }
    else 
    {
        send_error(`Source type ${source_data.type} not supported.`);
        return;
    }

    if ('error' in article) {
        send_error(`Error processing order #${order.id} for source ${source_id}: ${article.error}`);
        return;
    }

    // Update order with completion status and timestamp in one operation
    media_mention_data.completed_sources.push(source_id);
    media_mention_data.completed_urls.push((article as Article).url);
    order.updated_at = Date.now();
    await update_order(order);
}