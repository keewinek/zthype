import { get_articles_by_queries, delete_article, Query } from "./database.ts";
import { send_log, send_error } from "./discord_webhook_sender.ts";
import { Article } from "../interfaces/Article.ts";

export async function trigger_duplicate_cleanup_cron() {
    try {
        send_log("log", "Running duplicate article cleanup cron...");

        // Calculate timestamp for 1 day ago (24 hours)
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);

        // Get all articles created within the last 24 hours
        const recentArticles = await get_articles_by_queries([
            Query.greaterThanOrEqual("created_at", oneDayAgo),
            Query.orderAsc("created_at")
        ]);

        // Handle the case where get_articles_by_queries might return an error object or null
        if (!recentArticles) {
            send_log("log", "No articles found from the last 24 hours.");
            return;
        }

        if (typeof recentArticles === 'object' && 'error' in recentArticles) {
            send_error(`Failed to fetch articles: ${recentArticles.error}`);
            return;
        }

        if (!Array.isArray(recentArticles) || recentArticles.length === 0) {
            send_log("log", "No articles found from the last 24 hours.");
            return;
        }

        // Group articles by urlid and source_id to find duplicates
        const articleGroups = new Map<string, Article[]>();
        
        for (const article of recentArticles) {
            const key = `${article.urlid}|${article.source_id}`;
            if (!articleGroups.has(key)) {
                articleGroups.set(key, []);
            }
            articleGroups.get(key)!.push(article);
        }

        let duplicatesFound = 0;
        let duplicatesRemoved = 0;

        // Process each group to find and remove duplicates
        for (const [key, articles] of articleGroups.entries()) {
            if (articles.length > 1) {
                duplicatesFound += articles.length - 1; // Number of duplicates (keeping one)

                // Sort by created_at to keep the newest one
                articles.sort((a, b) => b.created_at - a.created_at);
                
                // Keep the newest article, delete the older ones
                const articlesToDelete = articles.slice(1);
                
                for (const articleToDelete of articlesToDelete) {
                    const deleteResult = await delete_article(articleToDelete.uuid);
                    
                    if (deleteResult.success) {
                        duplicatesRemoved++;
                        send_log(
                            "log",
                            `Removed duplicate article: ${articleToDelete.title} (uuid: ${articleToDelete.uuid}, urlid: ${articleToDelete.urlid}, source_id: ${articleToDelete.source_id}, created_at: ${new Date(articleToDelete.created_at).toISOString()})`
                        );
                    } else {
                        send_error(
                            `Failed to delete duplicate article: ${articleToDelete.uuid}`,
                            {
                                error_type: "Duplicate Cleanup Error",
                                additional_info: {
                                    "Article UUID": articleToDelete.uuid,
                                    "URL ID": articleToDelete.urlid,
                                    "Source ID": articleToDelete.source_id,
                                    "Error": deleteResult.error || "Unknown error"
                                }
                            }
                        );
                    }
                }
            }
        }

        if (duplicatesFound === 0) {
            send_log("log", `Duplicate cleanup completed. No duplicates found in ${recentArticles.length} articles from the last 24 hours.`);
        } else {
            send_log(
                "log",
                `Duplicate cleanup completed. Found ${duplicatesFound} duplicate(s), removed ${duplicatesRemoved} article(s) out of ${recentArticles.length} articles checked.`
            );
        }
    } catch (e) {
        const error_message = e instanceof Error ? e.message : String(e);
        const stack_trace = e instanceof Error ? e.stack : undefined;

        send_error(
            `Error in duplicate cleanup cron: ${error_message}`,
            {
                error_type: "Cron Execution Error",
                stack_trace: stack_trace
            }
        );
    }
}

export function start_duplicate_cleanup_cron() {
    send_log("log", "Starting duplicate article cleanup cron...");

    const should_start_crons = Deno.env.get("START_CRONS_ON_DEV") === "true";
    if (should_start_crons) {
        trigger_duplicate_cleanup_cron();
    }

    // Run every hour: "0 * * * *" means at minute 0 of every hour
    Deno.cron("Article Duplicate Cleanup", "0 * * * *", async () => {
        trigger_duplicate_cleanup_cron();
    });
}
