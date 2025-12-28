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
import { robustJsonParse } from "./robust_json_parser.ts";
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
        send_error(
            `No prompt found for source ${source.id}!`,
            {
                order_id: order.id,
                source_id: source.id,
                contact_email: order.contact_email,
                order_type: order.type,
                project_name: order_media_mention_data.project_name,
                project_link: order_media_mention_data.project_link,
                error_type: "Configuration Error"
            }
        );
        return { error: "No prompt found!" };
    }

    // Enhance prompt with SEO guidelines
    const seo_guidelines = `
WAŻNE WYTYCZNE SEO I JAKOŚCI TREŚCI:
- Naturalnie wpleć nazwę projektu (%project_title%) i powiązane słowa kluczowe w treść (unikaj keyword stuffing)
- Upewnij się, że tytuł jest atrakcyjny, zawiera słowa kluczowe i ma 50-60 znaków
- Każdy nagłówek sekcji (header) powinien być konkretny, opisowy i zawierać istotne słowa kluczowe
- Pisz w sposób naturalny - unikaj powtarzania tych samych fraz
- Każdy akapit powinien być wartościowy i unikalny
- Napisz to jak człowiek, który pisze artykuły internetowe od siebie, nie jak sztuczna inteligencja.`;

    const base_prompt = ctf(source.prompt, formatting_variables);
    const ai_prompt = base_prompt + seo_guidelines;
    
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
            send_error(
                `Invalid AI response format for source ${source.id}! Expected JSON but got: ${ai_content.substring(0, 500)}${ai_content.length > 500 ? "..." : ""}`,
                {
                    order_id: order.id,
                    source_id: source.id,
                    contact_email: order.contact_email,
                    order_type: order.type,
                    project_name: order_media_mention_data.project_name,
                    project_link: order_media_mention_data.project_link,
                    error_type: "AI Response Format Error",
                    additional_info: {
                        "AI Response Preview": ai_content.substring(0, 500) + (ai_content.length > 500 ? "..." : ""),
                        "Response Length": `${ai_content.length} characters`
                    }
                }
            );
            return { error: "Invalid AI response!" };
        }
    }

    // Parse the JSON using robust parser
    let ai_content_data;
    try {
        ai_content_data = robustJsonParse(json_string);
    } catch (parse_error) {
        const error_message = parse_error instanceof Error ? parse_error.message : String(parse_error);
        send_error(
            `Failed to parse AI JSON response for source ${source.id}! Parse error: ${error_message}. Response was: ${json_string.substring(0, 1000)}${json_string.length > 1000 ? "..." : ""}`,
            {
                order_id: order.id,
                source_id: source.id,
                contact_email: order.contact_email,
                order_type: order.type,
                project_name: order_media_mention_data.project_name,
                project_link: order_media_mention_data.project_link,
                error_type: "JSON Parse Error",
                additional_info: {
                    "JSON String Preview": json_string.substring(0, 500) + (json_string.length > 500 ? "..." : ""),
                    "JSON String Length": `${json_string.length} characters`,
                    "Parse Error": error_message
                }
            }
        );
        return { error: "Invalid AI response!" };
    }

    // Validate required fields
    const base_context = {
        order_id: order.id,
        source_id: source.id,
        contact_email: order.contact_email,
        order_type: order.type,
        project_name: order_media_mention_data.project_name,
        project_link: order_media_mention_data.project_link,
        error_type: "AI Response Validation Error"
    };

    if (!ai_content_data || typeof ai_content_data !== "object") {
        send_error(
            `Invalid AI JSON response for source ${source.id}! Response is not an object.`,
            {
                ...base_context,
                additional_info: {
                    "Response Type": typeof ai_content_data,
                    "Response Preview": JSON.stringify(ai_content_data).substring(0, 500)
                }
            }
        );
        return { error: "Invalid AI response!" };
    }

    if (!ai_content_data.title || typeof ai_content_data.title !== "string") {
        send_error(
            `Invalid AI JSON response for source ${source.id}! Missing or invalid 'title' field.`,
            {
                ...base_context,
                additional_info: {
                    "Title Value": ai_content_data.title ? String(ai_content_data.title) : "Missing",
                    "Title Type": typeof ai_content_data.title,
                    "Response Preview": JSON.stringify(ai_content_data).substring(0, 500)
                }
            }
        );
        return { error: "Invalid AI response!" };
    }

    if (!ai_content_data.paragraphs || !Array.isArray(ai_content_data.paragraphs)) {
        send_error(
            `Invalid AI JSON response for source ${source.id}! Missing or invalid 'paragraphs' field (must be an array).`,
            {
                ...base_context,
                additional_info: {
                    "Paragraphs Value": ai_content_data.paragraphs ? String(ai_content_data.paragraphs) : "Missing",
                    "Paragraphs Type": typeof ai_content_data.paragraphs,
                    "Response Preview": JSON.stringify(ai_content_data).substring(0, 500)
                }
            }
        );
        return { error: "Invalid AI response!" };
    }

    if (ai_content_data.paragraphs.length === 0) {
        send_error(
            `Invalid AI JSON response for source ${source.id}! 'paragraphs' array is empty.`,
            {
                ...base_context,
                additional_info: {
                    "Paragraphs Count": "0",
                    "Response Preview": JSON.stringify(ai_content_data).substring(0, 500)
                }
            }
        );
        return { error: "Invalid AI response!" };
    }

    // Validate paragraph structure
    for (let i = 0; i < ai_content_data.paragraphs.length; i++) {
        const paragraph = ai_content_data.paragraphs[i];
        if (!paragraph || typeof paragraph !== "object") {
            send_error(
                `Invalid AI JSON response for source ${source.id}! Paragraph at index ${i} is not an object.`,
                {
                    ...base_context,
                    additional_info: {
                        "Paragraph Index": String(i),
                        "Paragraph Type": typeof paragraph,
                        "Response Preview": JSON.stringify(ai_content_data).substring(0, 500)
                    }
                }
            );
            return { error: "Invalid AI response!" };
        }
        if (!paragraph.header || typeof paragraph.header !== "string") {
            send_error(
                `Invalid AI JSON response for source ${source.id}! Paragraph at index ${i} is missing or has invalid 'header' field.`,
                {
                    ...base_context,
                    additional_info: {
                        "Paragraph Index": String(i),
                        "Header Value": paragraph.header ? String(paragraph.header) : "Missing",
                        "Header Type": typeof paragraph.header,
                        "Response Preview": JSON.stringify(ai_content_data).substring(0, 500)
                    }
                }
            );
            return { error: "Invalid AI response!" };
        }
        if (!paragraph.content || typeof paragraph.content !== "string") {
            send_error(
                `Invalid AI JSON response for source ${source.id}! Paragraph at index ${i} is missing or has invalid 'content' field.`,
                {
                    ...base_context,
                    additional_info: {
                        "Paragraph Index": String(i),
                        "Content Value": paragraph.content ? String(paragraph.content).substring(0, 200) : "Missing",
                        "Content Type": typeof paragraph.content,
                        "Response Preview": JSON.stringify(ai_content_data).substring(0, 500)
                    }
                }
            );
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
        send_error(
            `Not enough images found for source ${source.id}! Got ${all_img_urls.length} images, expected ${ai_content_data.paragraphs.length}!`,
            {
                order_id: order.id,
                source_id: source.id,
                contact_email: order.contact_email,
                order_type: order.type,
                project_name: order_media_mention_data.project_name,
                project_link: order_media_mention_data.project_link,
                error_type: "Image Fetch Error",
                additional_info: {
                    "Images Found": String(all_img_urls.length),
                    "Images Expected": String(ai_content_data.paragraphs.length),
                    "Paragraphs Count": String(ai_content_data.paragraphs.length)
                }
            }
        );
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