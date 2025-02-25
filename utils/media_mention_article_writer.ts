import { existsSync } from "$std/fs/exists.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import Order from "../interfaces/Order.ts";
import { create_article, get_articles_by_queries, update_article, update_order } from "./database.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { ctf } from "./formatting_compiler.ts";
import { Article } from "../interfaces/Article.ts";
import { add_order_to_compilation_article } from "./media_mention_article_compilation_writer.ts";
import { create_new_personalized_article } from "./media_mention_article_personalized_writer.ts";

export async function load_source_data(source: string)
{
    const source_path = `./config/media_mention_sources/${source}.json`;

    if (!existsSync(source_path))
    {
        send_error(`Source config file for ${source} does not exist.`);
        return null;
    }

    const file_content = await Deno.readTextFile(source_path);
    const source_data = JSON.parse(file_content);

    return source_data as object;
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
    else if (source_data.type == "compilation")
    {
        const article = await add_order_to_compilation_article(order, source_data);

        if ('error' in article) {
            send_error(`Error adding order #${order.id} to compilation article for source ${source_id}: ${article.error}`);
            return;
        }

        media_mention_data.completed_sources.push(source_id);
        media_mention_data.completed_urls.push((article as Article).url);

        await update_order(order);
    }
    else if (source_data.type == "personalized")
    {
        const article = await create_new_personalized_article(order, source_data);

        if ('error' in article) {
            send_error(`Error creating personalized article for order #${order.id} for source ${source_id}: ${article.error}`);
            return;
        }

        media_mention_data.completed_sources.push(source_id);
        media_mention_data.completed_urls.push((article as Article).url);

        await update_order(order);
    }
    else 
    {
        send_error(`Source type ${source_data.type} not supported.`);
    }
}