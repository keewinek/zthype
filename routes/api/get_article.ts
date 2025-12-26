import { FreshContext } from "$fresh/server.ts";
import Order from "../../interfaces/Order.ts";
import { create_order, get_articles_by_queries, get_next_order_id, get_order_by_value, Query } from "../../utils/database.ts";
import { Article } from "../../interfaces/Article.ts";
import get_paragraphs_from_article from "../../utils/get_paragraphs_from_article.ts";
import { Paragraph } from "../../interfaces/Paragraph.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const url = new URL(_req.url);
    const urlid = url.searchParams.get("urlid");
    const source_ids = url.searchParams.get("source_ids")?.split(",");

    if (!urlid || !source_ids) {
        return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    if (urlid == "test") {
        // load paragraphs from config/test_paragraphs.json
        const json = await Deno.readTextFile("config/test_article_response.json")
        return new Response(json, { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const out_data = await get_articles_by_queries([Query.equal("urlid", urlid), Query.equal("source_id", source_ids)]);

    if (!out_data || 'error' in out_data) {
        return new Response(JSON.stringify({"error" : "Article not found " + out_data?.error}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if ('error' in out_data) {
        return new Response(JSON.stringify({"error" : out_data.error}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const article = out_data[0] as Article;
    const paragraphs = await get_paragraphs_from_article(article);

    return new Response(JSON.stringify({"success" : true, "article" : article, "paragraphs" : paragraphs}), { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
};