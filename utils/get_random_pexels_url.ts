import {Pexels} from "https://deno.land/x/pexels_deno@v1.0.1/mod.ts";
import { send_error } from "./discord_webhook_sender.ts";

const pexels_api_key = Deno.env.get("PEXELS_API_KEY") as string
const pexels_client = new Pexels(pexels_api_key)

export async function get_random_pexels_urls(urls_count = 1)
{
    try 
    {
        const random_photos = (await pexels_client.getRandomPhotos(urls_count)).photos;
        const urls = random_photos.map((photo) => photo.url);
        return urls;
    }
    catch(err) {
        send_error(`Pexels api error: ${err}`)
    } 
}