import { Article } from "../interfaces/Article.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { MediaMentionSourceConfig } from "../interfaces/MediaMentionSourceConfig.ts";
import Order from "../interfaces/Order.ts";
import { create_article } from "./database.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";
import { ctf } from "./formatting_compiler.ts";
import { get_random_pexels_urls } from "./get_random_pexels_url.ts";
import get_gpt_content from "./gpt_prompter.ts";
import { get_random_int } from "./random.ts";
import { send_article_creation_message } from "./special_discord_webhook_sender.ts";
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
    
    // Start GPT request and prepare for parallel execution
    const ai_response_promise = get_gpt_content(ai_prompt);

    // Wait for GPT response first (this is the main bottleneck)
    const ai_response = await ai_response_promise;

    if (!ai_response) {
        send_log("log", `Failed to get AI response for source ${source.id}!`);
        return { error: "Failed to get AI response!" };
    }

    const ai_content = ai_response.response_content.trim();

    // Try to extract JSON from the response - handle multiple formats
    let json_string = "";
    
    // Case 1: JSON wrapped in ```json ... ```
    if (ai_content.startsWith("```json") && ai_content.endsWith("```")) {
        json_string = ai_content.substring(7, ai_content.length - 3).trim();
        // Remove leading newline if present
        if (json_string.startsWith("\n")) {
            json_string = json_string.substring(1);
        }
    }
    // Case 2: JSON wrapped in ``` ... ```
    else if (ai_content.startsWith("```") && ai_content.endsWith("```")) {
        json_string = ai_content.substring(3, ai_content.length - 3).trim();
        // Remove language identifier if present (e.g., "json\n")
        if (json_string.startsWith("json\n")) {
            json_string = json_string.substring(5);
        } else if (json_string.startsWith("json")) {
            json_string = json_string.substring(4).trim();
        }
    }
    // Case 3: Try to find JSON object in the response (starts with { and ends with })
    else if (ai_content.startsWith("{") && ai_content.endsWith("}")) {
        json_string = ai_content;
    }
    // Case 4: Try to extract JSON from text that might have extra content
    else {
        const json_start = ai_content.indexOf("{");
        const json_end = ai_content.lastIndexOf("}");
        if (json_start !== -1 && json_end !== -1 && json_end > json_start) {
            json_string = ai_content.substring(json_start, json_end + 1);
        } else {
            send_error(`Invalid AI response format for source ${source.id}! Expected JSON but got: ${"```"}${ai_content.substring(0, 500)}${ai_content.length > 500 ? "..." : ""}${"```"}`);
            return { error: "Invalid AI response!" };
        }
    }

    // Parse the JSON
    let ai_content_data;
    try {
        ai_content_data = JSON.parse(json_string);
    } catch (parse_error) {
        send_error(`Failed to parse AI JSON response for source ${source.id}! Parse error: ${parse_error}. Response was: ${"```"}${json_string.substring(0, 500)}${json_string.length > 500 ? "..." : ""}${"```"}`);
        return { error: "Invalid AI response!" };
    }

    // Validate required fields
    if (!ai_content_data || typeof ai_content_data !== "object") {
        send_error(`Invalid AI JSON response for source ${source.id}! Response is not an object: ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
        return { error: "Invalid AI response!" };
    }

    if (!ai_content_data.title || typeof ai_content_data.title !== "string") {
        send_error(`Invalid AI JSON response for source ${source.id}! Missing or invalid 'title' field. Response: ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
        return { error: "Invalid AI response!" };
    }

    if (!ai_content_data.paragraphs || !Array.isArray(ai_content_data.paragraphs)) {
        send_error(`Invalid AI JSON response for source ${source.id}! Missing or invalid 'paragraphs' field (must be an array). Response: ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
        return { error: "Invalid AI response!" };
    }

    if (ai_content_data.paragraphs.length === 0) {
        send_error(`Invalid AI JSON response for source ${source.id}! 'paragraphs' array is empty. Response: ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
        return { error: "Invalid AI response!" };
    }

    // Validate paragraph structure
    for (let i = 0; i < ai_content_data.paragraphs.length; i++) {
        const paragraph = ai_content_data.paragraphs[i];
        if (!paragraph || typeof paragraph !== "object") {
            send_error(`Invalid AI JSON response for source ${source.id}! Paragraph at index ${i} is not an object. Response: ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
            return { error: "Invalid AI response!" };
        }
        if (!paragraph.header || typeof paragraph.header !== "string") {
            send_error(`Invalid AI JSON response for source ${source.id}! Paragraph at index ${i} is missing or has invalid 'header' field. Response: ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
            return { error: "Invalid AI response!" };
        }
        if (!paragraph.content || typeof paragraph.content !== "string") {
            send_error(`Invalid AI JSON response for source ${source.id}! Paragraph at index ${i} is missing or has invalid 'content' field. Response: ${"```"}${JSON.stringify(ai_content_data)}${"```"}`);
            return { error: "Invalid AI response!" };
        }
    }

    const urlid = str_to_urlid(ai_content_data.title);
    const url = ctf(source.url, { urlid: urlid })

    const str_paragraphs = []
    for (let i = 0; i < ai_content_data.paragraphs.length; i++) {
        str_paragraphs.push(JSON.stringify(ai_content_data.paragraphs[i]))
    }

    // Fetch images in parallel while processing other data
    const all_img_urls: string[] = await get_random_pexels_urls(ai_content_data.paragraphs.length) || [];
    const img_urls: string[] = []

    if (all_img_urls.length < ai_content_data.paragraphs.length) {
        send_error(`Not enough images found for source ${source.id}! Got ${all_img_urls.length} images, expected ${ai_content_data.paragraphs.length}!`);
    }
    else {
        for (let i = 0; i < ai_content_data.paragraphs.length; i++) {
            if (get_random_int(0,100) < 50) {
                img_urls.push(all_img_urls[i]);
            } else {
                img_urls.push("");
            }
        }
    }

    const article = {
        type: "personalized",
        created_at: Date.now(),
        updated_at: Date.now(),
        title: ai_content_data.title,
        content: ai_content_data.content,
        order_ids: [order.id],
        order_ids_count: 1,
        source_id: source.id,
        paragraph: "",
        generated_paragraphs: str_paragraphs,
        img_urls: img_urls,
        urlid: urlid,
        url: url,
        uuid: crypto.randomUUID()
    } as Article
    
    await create_article(article);
    send_article_creation_message(article);

    return article;
}