import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { create_article, get_articles_by_queries, get_orders_by_queries, update_article, update_order } from "./database.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import Order from "../interfaces/Order.ts";
import { existsSync } from "$std/fs/exists.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import { Article } from "../interfaces/Article.ts";
import { ctf } from "./formatting_compiler.ts";

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

export async function add_order_to_compilation_article(order: Order, source: MediaMentionSourceConfig)
{
    console.log(`Adding order #${order.id} to compilation article for source ${source.id}...`)

    const all_articles_result_for_source = await get_articles_by_queries([
        sdk.Query.equal("source_id", source.id),
    ]);

    const all_articles_for_source_count = Array.isArray(all_articles_result_for_source) ? all_articles_result_for_source.length : 0;

    const database_out_articles = await get_articles_by_queries([
        sdk.Query.equal("source_id", source.id),
        sdk.Query.orderAsc("order_ids_count"),
        sdk.Query.limit(1)
    ]);

    let target_article = null;

    if (database_out_articles == null || !Array.isArray(database_out_articles) || database_out_articles.length == 0 || database_out_articles[0].order_ids_count >= source.max_orders) {
        console.log(`No articles found for source ${source.id}. Creating a new one...`);

        let formatting_variables = {
            "index": (all_articles_for_source_count + 1).toString(),
            "project_title": (order.data as OrderMediaMentionData).project_name,
            "project_description": (order.data as OrderMediaMentionData).project_desc,
        }

        target_article = {
            type: "media_mention",
            title: ctf(source.title || "", formatting_variables),
            urlid: ctf(source.urlid || "", formatting_variables),
            source_id: ctf(source.id || "", formatting_variables),
            url: ctf(source.url || "", formatting_variables),
            order_ids: [order.id],
            order_ids_count: 1,
            paragraph: "",
            created_at: Date.now(),
            uuid: crypto.randomUUID(),
        } as Article;

        await create_article(target_article);

        send_log("articles", `Article ${target_article.url} created with order #${order.id}.`)

        return target_article;
    }

    target_article = database_out_articles[0] as Article;
    target_article.order_ids.push(order.id);
    target_article.order_ids_count += 1;
    
    await update_article(target_article);

    send_log("articles", `Article #${target_article.url} updated with order #${order.id}.`)

    return target_article;
}

export async function write_article_for_order(order: Order)
{
    console.log(`Writing article for order #${order.id}...`)

    const data = order.data as OrderMediaMentionData;
    let source = "";

    for (const selected_source of data.selected_sources) {
        if (data.completed_sources.includes(selected_source)) continue;
        source = selected_source;
        break;
    }

    if (source == "") { 
        send_error(`No source found for order #${order.id}.`);
        return; 
    }

    
    const source_data = await load_source_data(source) as MediaMentionSourceConfig;
    
    console.log(source_data.id);
    if (source_data == null) { 
        send_error(`Source config file for ${source} does not exist.`);
        return; 
    }
    if (source_data.type == "compilation")
        {

        const article = await add_order_to_compilation_article(order, source_data);

        data.completed_sources.push(source);
        data.completed_urls.push(article.url);

        await update_order(order);
    }
}

export async function trigger_article_writer_cron()
{
    console.log("Running article writer cron...")
    const next_orders = await get_orders_by_queries([
        sdk.Query.orderAsc("created_at"), 
        sdk.Query.equal("complete", false), 
        sdk.Query.equal("type", "media_mention"), 
        sdk.Query.equal("moderated", true), 
        sdk.Query.equal("rejected", false),
        sdk.Query.limit(1)
    ]);

    if (next_orders == null || !Array.isArray(next_orders)) {
        return;
    }
    
    const next_order = next_orders[0];

    if ((next_order.data as OrderMediaMentionData).completed_sources.length == (next_order.data as OrderMediaMentionData).selected_sources.length) {
        next_order.complete = true;
        await update_order(next_order);
        send_log("orders",`Order #${next_order.uuid} Media Mention completed.`)
        return;
    }

    await write_article_for_order(next_order);
}

export function start_article_writer_cron()
{
    console.log("Starting article writer cron...")

    trigger_article_writer_cron();

    Deno.cron("Media Mention Article Writer", "* */1 * * *", async () => {
        trigger_article_writer_cron();
    });
}