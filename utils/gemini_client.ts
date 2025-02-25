import { send_error, send_log } from "./discord_webhook_sender.ts";
import { get_body_contents } from "./gpt_body.ts";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/%model%:generateContent?key=`;
const MODELS = [
    {id: "gemini-2.0-pro-exp", last_error: 0},
    {id: "gemini-2.0-flash", last_error: 0},
    {id: "gemini-1.5-pro", last_error: 0},
    {id: "gemini-1.5-flash", last_error: 0},
]

const MODEL_ERROR_TIMEOUT = 15 * 60 * 1000;

export async function send_gemini_request(user_input: string, system_prompt: string, messages_history: string[][], api_key: string, api_key_env: string)
{   
    const body_contents = get_body_contents(messages_history, user_input);

    let model_to_use = "";
    for (let i = 0; i < MODELS.length; i++) {
        const model = MODELS[i];
        if (model.last_error < Date.now() - MODEL_ERROR_TIMEOUT) {
            model_to_use = model.id;
            break;
        }
    }

    if (model_to_use == "") {
        send_log("log", `Gemini API Error: All models are on cooldown. Removing the cool down.`);
        
        for (let i = 0; i < MODELS.length; i++) {
            MODELS[i].last_error = 0;
        }

        return {
            "fallback": true,
            "error": "All models are on cooldown",
            "model": model_to_use,
            "error_code": 1,
        }
    }
    
    let target_api_key = API_URL + api_key;
    target_api_key = target_api_key.replace("%model%", model_to_use);
    
    console.log(`Sending request to ${target_api_key}...`);

    const response = await fetch(target_api_key, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify({
            contents: body_contents,
            systemInstruction: {
                role: "user",
                parts: [
                    {
                        "text": system_prompt,
                    },
                ],
            },
            generationConfig: {
                temperature: 1,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            },
        }),
    });


    if (!response.ok) {
        for (let i = 0; i < MODELS.length; i++) {
            if (MODELS[i].id == model_to_use) {
                MODELS[i].last_error = Date.now();
                break;
            }
        }

        send_log("log", `Gemini API Error: ${response.status} ${response.statusText} for model ${model_to_use}. Used key: ${api_key_env}`);
        return {
            "fallback": true,
            "error": `${response.status} ${response.statusText}`,
            "model": model_to_use,
            "error_code": 0,
            "response": response,
        }
    }

    const data = response.json();
    return data;
}