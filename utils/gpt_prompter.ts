import { send_gemini_request } from "./gemini_client.ts";
import { get_next_gemini_key} from "./api_key_shuffle.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";

interface gptContent {
    response_content: string;
    api_key_id: number;
    request_response: object;
}

export default async function get_gpt_content(user_content: string) {
    const gemini_api_key = get_next_gemini_key();

    if (gemini_api_key == null) { return null; }

    const gemini_response = await send_gemini_request(user_content, "", [], gemini_api_key.key, gemini_api_key.env_name);

    const response_content = gemini_response.candidates[0].content.parts[0].text;
    
    if (gemini_response.fallback) {
        send_error(`GPT_PROMPTER: Gemini API Error: ${gemini_response.error} for model ${gemini_response.model}. Used key: ${gemini_api_key.env_name}`);
        send_log("log", `GPT_PROMPTER: Gemini API Error: ${gemini_response.error} for model ${gemini_response.model}. Used key: ${gemini_api_key.env_name}`);
        return null;
    }

    const gpt_content: gptContent = {
        response_content: response_content,
        request_response: gemini_response,
        api_key_id: gemini_api_key.id
    };
    
    return gpt_content;
}