import { send_nvidia_request } from "./nvidia_client.ts";
import { get_next_nvidia_key} from "./api_key_shuffle.ts";
import { send_error, send_log } from "./discord_webhook_sender.ts";

interface gptContent {
    response_content: string;
    api_key_id: number;
    request_response: object;
}

export default async function get_gpt_content(user_content: string) {
    const nvidia_api_key = get_next_nvidia_key();

    if (nvidia_api_key == null) { return null; }

    const nvidia_response = await send_nvidia_request(user_content, "", [], nvidia_api_key.key, nvidia_api_key.env_name);
    
    if (nvidia_response.fallback) {
        send_error(`GPT_PROMPTER: NVIDIA API Error: ${nvidia_response.error} for model ${nvidia_response.model}. Used key: ${nvidia_api_key.env_name}`);
        send_log("log", `GPT_PROMPTER: NVIDIA API Error: ${nvidia_response.error} for model ${nvidia_response.model}. Used key: ${nvidia_api_key.env_name}`);
        return null;
    }

    if (!nvidia_response.candidates || nvidia_response.candidates.length === 0) {
        send_error(`GPT_PROMPTER: NVIDIA API Error: No candidates in response. Used key: ${nvidia_api_key.env_name}`);
        send_log("log", `GPT_PROMPTER: NVIDIA API Error: No candidates in response. Used key: ${nvidia_api_key.env_name}`);
        return null;
    }

    const response_content = nvidia_response.candidates[0].content.parts[0].text;

    const gpt_content: gptContent = {
        response_content: response_content,
        request_response: nvidia_response,
        api_key_id: nvidia_api_key.id
    };
    
    return gpt_content;
}