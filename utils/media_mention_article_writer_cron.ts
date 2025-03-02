import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { create_article, get_articles_by_queries, get_orders_by_queries, update_article, update_order } from "./database.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import Order from "../interfaces/Order.ts";
import { existsSync } from "$std/fs/exists.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import { Article } from "../interfaces/Article.ts";
import { ctf } from "./formatting_compiler.ts";
import { write_article_for_order } from "./media_mention_article_writer.ts";
import { send_order_completion_message } from "./special_discord_webhook_sender.ts";

export async function trigger_article_writer_cron()
{
    send_log("log", "Running article writer cron...")
    const next_orders = await get_orders_by_queries([
        sdk.Query.orderAsc("updated_at"), 
        sdk.Query.equal("complete", false), 
        sdk.Query.equal("type", "media_mention"), 
        sdk.Query.equal("moderated", true), 
        sdk.Query.equal("rejected", false),
        sdk.Query.limit(1)
    ]);

    if (next_orders == null || !Array.isArray(next_orders)) {
        send_log("log", "No orders found.");
        return;
    }
    
    const next_order = next_orders[0];

    if ((next_order.data as OrderMediaMentionData).completed_sources.length == (next_order.data as OrderMediaMentionData).selected_sources.length) {
        next_order.complete = true;
        await update_order(next_order);
        send_order_completion_message(next_order);
        return;
    }

    send_log("log", `Updating order ${next_order.id} updated_at timestamp ${Date.now()}...`)

    next_order.updated_at = Date.now();
    await update_order(next_order);

    await write_article_for_order(next_order);
}

export function start_article_writer_cron()
{
    send_log("log", "Starting article writer cron...")

    const should_start_crons = Deno.env.get("START_CRONS_ON_DEV") === "true";
    if (should_start_crons) {
        trigger_article_writer_cron();
    }

    Deno.cron("Media Mention Article Writer", "* */1 * * *", async () => {
        trigger_article_writer_cron();
    });
}