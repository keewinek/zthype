import { send_error, send_log } from "./discord_webhook_sender.ts";
import { get_messages_body_content } from "./gpt_body.ts";

const INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "meta/llama-4-maverick-17b-128e-instruct";
const STREAM = false;

export async function send_nvidia_request(
    user_input: string,
    system_prompt: string,
    messages_history: string[][],
    api_key: string,
    api_key_env: string
) {
    const messages = get_messages_body_content(messages_history, user_input, system_prompt);

    const payload = {
        "model": MODEL,
        "messages": messages,
        "max_tokens": 8192,
        "temperature": 1.00,
        "top_p": 1.00,
        "frequency_penalty": 0.00,
        "presence_penalty": 0.00,
        "stream": STREAM
    };

    const headers = {
        "Authorization": `Bearer ${api_key}`,
        "Accept": STREAM ? "text/event-stream" : "application/json",
        "Content-Type": "application/json"
    };

    console.log(`Sending request to ${INVOKE_URL}...`);

    try {
        const response = await fetch(INVOKE_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            send_log("log", `NVIDIA API Error: ${response.status} ${response.statusText} for model ${MODEL}. Used key: ${api_key_env}`);
            return {
                "fallback": true,
                "error": `${response.status} ${response.statusText}`,
                "model": MODEL,
                "error_code": 0,
                "response": errorText,
            };
        }

        const data = await response.json();
        
        // Convert NVIDIA response format to match expected format
        if (data.choices && data.choices.length > 0) {
            return {
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": data.choices[0].message.content
                        }]
                    }
                }],
                "fallback": false
            };
        }

        return {
            "fallback": true,
            "error": "No response content",
            "model": MODEL,
            "error_code": 1,
        };
    } catch (error) {
        send_log("log", `NVIDIA API Error: ${error} for model ${MODEL}. Used key: ${api_key_env}`);
        return {
            "fallback": true,
            "error": String(error),
            "model": MODEL,
            "error_code": 0,
        };
    }
}

