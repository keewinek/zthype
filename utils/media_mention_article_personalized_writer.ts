import { Article } from "../interfaces/Article.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import Order from "../interfaces/Order.ts";
import { create_article } from "./database.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import { ctf } from "./formatting_compiler.ts";
import get_gpt_content from "./gpt_prompter.ts";
import { str_to_urlid } from "./urlid.ts";

export async function create_new_personalized_article(order: Order, source: MediaMentionSourceConfig)
{
    send_log("log", `Creating new personalized article for media mention order #${order.id}...`);

    const order_media_mention_data = order.data as OrderMediaMentionData;

    const formatting_variables = {
        project_title: order_media_mention_data.project_name,
        project_description: order_media_mention_data.project_desc,
    }

    if (!source.prompt) {
        send_error(`No prompt found for source ${source.id}!`)
        return { error: "No prompt found!" };
    }

    const ai_prompt = ctf(source.prompt, formatting_variables);
    const ai_response = await get_gpt_content(ai_prompt);

    if (!ai_response) {
        send_log("log", `Failed to get AI response for source ${source.id}!`);
        return { error: "Failed to get AI response!" };
    }

    const ai_content = ai_response.response_content.trim();

    if (!ai_content.startsWith("```json") || !ai_content.endsWith("```")) {
        send_error(`Invalid AI response (no JSON embed) for source ${source.id}! Got response ${"```"}${ai_content}${"```"}`);
        return { error: "Invalid AI response!" }
    }

    const ai_content_data = JSON.parse(ai_content.substring(8, ai_content.length - 3));

    if (!ai_content_data.title || !ai_content_data.content) {
        send_error(`Invalid AI JSON response for source ${source.id}! Got response ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
        return { error: "Invalid AI response!" };
    }

    const urlid = str_to_urlid(ai_content_data.title);
    const url = ctf(source.url, { urlid: urlid })

    const article = {
        type: "personalized",
        created_at: Date.now(),
        updated_at: Date.now(),
        title: ai_content_data.title,
        content: ai_content_data.content,
        order_ids: [order.id],
        order_ids_count: 1,
        source_id: source.id,
        paragraph: ai_content_data.content,
        urlid: urlid,
        url: url,
        uuid: crypto.randomUUID()
    } as Article
    
    create_article(article);
    send_log("articles", `Created new personalized article for media mention order #${order.id}!`);

    return article;
}