import { create_article, get_articles_by_queries, get_orders_by_queries, update_article, update_order, Query } from "./database.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import Order from "../interfaces/Order.ts";
import { existsSync } from "$std/fs/exists.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import { Article } from "../interfaces/Article.ts";
import { ctf } from "./formatting_compiler.ts";
import { write_article_for_order, preload_all_source_configs } from "./media_mention_article_writer.ts";
import { send_order_completion_message } from "./special_discord_webhook_sender.ts";

// Track if source configs have been preloaded
let source_configs_preloaded = false;

export async function trigger_article_writer_cron()
{
    try {
        // Preload source configs on first run
        if (!source_configs_preloaded) {
            await preload_all_source_configs();
            source_configs_preloaded = true;
        }

        send_log("log", "Running article writer cron...")
        
        // Process multiple orders in parallel (up to 5 at a time for better throughput)
        const next_orders = await get_orders_by_queries([
            Query.orderAsc("updated_at"), 
            Query.equal("complete", false), 
            Query.equal("type", "media_mention"), 
            Query.equal("moderated", true), 
            Query.equal("rejected", false),
            Query.limit(5) // Process up to 5 orders in parallel
        ]);
    
        if (next_orders == null || !Array.isArray(next_orders) || next_orders.length === 0) {
            send_log("log", "No orders found.");
            return;
        }
        
        // Process all orders in parallel
        await Promise.all(next_orders.map(async (order) => {
            try {
                const media_mention_data = order.data as OrderMediaMentionData;
                
                // Check if order is already complete
                if (media_mention_data.completed_sources.length == media_mention_data.selected_sources.length) {
                    order.complete = true;
                    order.updated_at = Date.now();
                    await update_order(order);
                    send_order_completion_message(order);
                    return;
                }
        
                // Process the order (this will update updated_at internally)
                await write_article_for_order(order);
            } catch (e) {
                send_error(`Error processing order #${order.id} in cron: ${e}`);
            }
        }));
    }
    catch (e) {
        send_error(`Error in article writer cron: ${e}`);
    }
}

export function start_article_writer_cron()
{
    send_log("log", "Starting article writer cron...")

    const should_start_crons = Deno.env.get("START_CRONS_ON_DEV") === "true";
    if (should_start_crons) {
        trigger_article_writer_cron();
    }

    Deno.cron("Media Mention Article Writer", "* * * * *", async () => {
        trigger_article_writer_cron();
    });
}