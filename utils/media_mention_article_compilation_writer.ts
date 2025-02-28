import { existsSync } from "$std/fs/exists.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import Order from "../interfaces/Order.ts";
import { create_article, get_articles_by_queries, update_article, update_order } from "./database.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { ctf } from "./formatting_compiler.ts";
import { Article } from "../interfaces/Article.ts";

export async function add_order_to_compilation_article(order: Order, source: MediaMentionSourceConfig)
{
    send_log("log", `Adding order #${order.id} to compilation article for source ${source.id}...`)

    const all_articles_result_for_source = await get_articles_by_queries([
        sdk.Query.equal("source_id", source.id),
    ]);

    const all_articles_for_source_count = Array.isArray(all_articles_result_for_source) ? all_articles_result_for_source.length : 0;

    const database_out_articles = await get_articles_by_queries([
        sdk.Query.equal("source_id", source.id),
        sdk.Query.orderAsc("order_ids_count"),
        sdk.Query.limit(1)
    ]);

    if (database_out_articles == null || !Array.isArray(database_out_articles) || database_out_articles.length == 0 || database_out_articles[0].order_ids_count >= source.max_orders) {
        // Article was not found. Create a new one.
        send_log("log",`No articles found for source ${source.id}. Creating a new one...`);
        const target_article = await create_new_compilation_article(order, source, all_articles_for_source_count + 1);
        if ('error' in target_article) {
            send_error(`Error creating article for source ${source.id}: ${target_article.error}`);
            return {"error": target_article.error};
        }
        return target_article
    }

    // Article was found, add the order to it

    send_log("log",`Article found for source ${source.id}. Updating by adding the order...`)

    const target_article = database_out_articles[0];
    target_article.order_ids.push(order.id);
    target_article.order_ids_count += 1;

    console.log(JSON.stringify(target_article));
    
    const out = await update_article(target_article as Article);

    if ('error' in out) {
        send_error(`Error updating article for source ${source.id}: ${out.error}`);
        return {"error": out.error}
    }

    send_log("articles", `Article ${target_article.url} updated with new added order #${order.id}.`)

    return target_article;
}

export async function create_new_compilation_article(order: Order, source: MediaMentionSourceConfig, article_index: number = 0)
{
    let formatting_variables = {
        "index": article_index.toString(),
        "project_title": (order.data as OrderMediaMentionData).project_name,
        "project_description": (order.data as OrderMediaMentionData).project_desc,
    }

    let target_article = {
        type: "compilation",
        title: ctf(source.title || "", formatting_variables),
        urlid: ctf(source.urlid || "", formatting_variables),
        source_id: ctf(source.id || "", formatting_variables),
        url: ctf(source.url || "", formatting_variables),
        order_ids: [order.id],
        order_ids_count: 1,
        paragraph: "",
        generated_paragraphs: [],
        img_urls: [],
        created_at: Date.now(),
        updated_at: Date.now(),
        uuid: crypto.randomUUID(),
    } as Article;

    const out = await create_article(target_article);
    if ('error' in out) {
        send_error(`Error creating article for source ${source.id}: ${out.error}`);
        return out;
    }

    send_log("articles", `Article ${target_article.url} created with order #${order.id}.`)

    return target_article;
}