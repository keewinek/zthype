import { FreshContext } from "$fresh/server.ts";
import { get_articles_by_queries, Query } from "../../utils/database.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const url = new URL(_req.url);
    const source_ids_param = url.searchParams.get("source_ids");
    
    if (!source_ids_param) {
        return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    // Split and filter out empty strings, trim whitespace
    const source_ids = source_ids_param.split(",")
        .map(id => id.trim())
        .filter(id => id.length > 0);

    if (source_ids.length === 0) {
        return new Response(JSON.stringify({"error" : "No valid source_ids provided"}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    const out_data = await get_articles_by_queries([Query.equal("source_id", source_ids), Query.limit(40)]);

    // Handle error case
    if (out_data && 'error' in out_data) {
        return new Response(JSON.stringify({"error" : out_data.error}), { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    // Return empty array if no results, otherwise return the articles
    const articles = out_data || [];
    return new Response(JSON.stringify({"success" : true, "articles" : articles}), { status: 200, headers: { "Access-Control-Allow-Origin": "*" } });
};