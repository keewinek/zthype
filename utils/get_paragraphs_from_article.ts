import { Article } from "../interfaces/Article.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { Paragraph } from "../interfaces/Paragraph.ts";
import { get_order_by_value } from "./database.ts";
import { send_error } from "./discord_webhook_sender.ts";

export default async function get_paragraphs_from_article(article: Article)
{
    if (article.type == "compilation")
    {
        const paragraphs: Paragraph[] = [];

        for (let i = 0; i < article.order_ids.length; i++)
        {
            const order = await get_order_by_value("id", article.order_ids[i])

            if (!order || 'error' in order){
                send_error(`[Get Paragraphs] Error getting order #${article.order_ids[i]} for compilation article ${article.urlid}: ${order?.error}`)
                continue
            }

            const media_mention_data = order.data as OrderMediaMentionData;

            let paragraph = {
                content: media_mention_data.project_desc,
                header: (i + 1).toString() + ". " + media_mention_data.project_name,
                project_link: media_mention_data.project_link,
                project_zt_link: media_mention_data.project_zt_link
            } as Paragraph

            paragraphs.push(paragraph)
        }

        return paragraphs
    }
    else if (article.type == "personalized")
    {
        const order = await get_order_by_value("id", article.order_ids[0])

        if (!order || 'error' in order){
            send_error(`[Get Paragraphs] Error getting order #${article.order_ids[0]} for personalized article ${article.urlid}: ${order?.error}`)
            return;
        }

        const media_mention_data = order.data as OrderMediaMentionData;

        let paragraph = {
            content: article.paragraph,
            project_link: media_mention_data.project_link,
            project_zt_link: media_mention_data.project_zt_link
        } as Paragraph

        return [paragraph]
    }
}