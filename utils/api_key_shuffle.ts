import { send_error } from "./discord_webhook_sender.ts";

class APIKey
{
    key: string;
    env_name: string;
    id: number;
    last_used: number = 0;

    constructor(key: string, env_name: string, id: number)
    {
        this.key = key;
        this.env_name = env_name;
        this.id = id;
    }
}

let all_nvidia_keys: APIKey[] = [];
init_keys()

export function get_next_nvidia_key(): APIKey | null
{
    all_nvidia_keys = all_nvidia_keys.sort((a, b) => a.last_used - b.last_used);

    if (all_nvidia_keys.length == 0) {
        send_error("API_KEY_SHUFFLE: No API keys found in env. Please add NVIDIA_API_KEY to .env file.");
        return null;
    }

    const key_to_use = all_nvidia_keys[0];
    key_to_use.last_used = Date.now();

    return key_to_use;
}

function init_keys()
{
    const env_obj = Deno.env.toObject();
    const nvidia_keys = Object.keys(env_obj).filter(key => key.startsWith("NVIDIA_API_KEY"));
    
    for (let i = 0; i < nvidia_keys.length; i++) {
        const env_name = nvidia_keys[i];
        const api_key = env_obj[env_name];
        all_nvidia_keys.push(new APIKey(api_key, env_name, i));
    }
    
    all_nvidia_keys = all_nvidia_keys.sort(() => Math.random() - 0.5);

    console.log("API_KEY_SHUFFLE: Found ", all_nvidia_keys.length , " API keys in env.")
}

