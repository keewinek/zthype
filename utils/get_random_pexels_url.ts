import {Pexels} from "https://deno.land/x/pexels_deno@v1.0.1/mod.ts";
import { send_error } from "./discord_webhook_sender.ts";

let pexels_client = null as unknown as Pexels;
let pexels_client_connected = false;

function connect_client()
{
    if (pexels_client_connected) return;

    const pexels_api_key = Deno.env.get("PEXELS_API_KEY")

    if (pexels_api_key == null) {
        console.error("[PEXELS] PEXELS_API_KEY environment variable is not set.");
        return
    }

    pexels_client = new Pexels(pexels_api_key)
    pexels_client_connected = true;

    console.log("[PEXELS] Connected to Pexels client.");
}

export async function get_random_pexels_urls(urls_count = 1)
{
    try
    {
        connect_client()
        const random_photos = (await pexels_client.getRandomPhotos(urls_count)).photos;
        const urls = random_photos.map((photo) => photo.src.landscape);
        return urls;
    }
    catch(err) {
        send_error(`Pexels api error: ${err}`)
    } 
}