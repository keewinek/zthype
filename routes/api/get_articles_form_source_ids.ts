import { FreshContext } from "$fresh/server.ts";
import Order from "../../interfaces/Order.ts";
import { create_order, get_articles_by_queries, get_next_order_id, get_order_by_value, Query } from "../../utils/database.ts";
import { Article } from "../../interfaces/Article.ts";
import get_paragraphs_from_article from "../../utils/get_paragraphs_from_article.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const url = new URL(_req.url);
    const source_ids = url.searchParams.get("source_ids")?.split(",");

    if (!source_ids) {
        return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const out_data = await get_articles_by_queries([Query.equal("source_id", source_ids)]);

    if (!out_data || 'error' in out_data) {
        return new Response(JSON.stringify({"error" : "Article not found " + out_data?.error}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }
    if ('error' in out_data) {
        return new Response(JSON.stringify({"error" : out_data.error}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    return new Response(JSON.stringify({"success" : true, "articles" : out_data}), { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
};