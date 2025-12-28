import { FreshContext } from "$fresh/server.ts";
import { get_orders_by_queries, Query } from "../utils/database.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    // Get all finished orders (complete = true)
    const finishedOrders = await get_orders_by_queries([
        Query.equal("complete", 1)
    ]);

    // Check if we got an error or no orders
    if (!finishedOrders || 'error' in finishedOrders || !Array.isArray(finishedOrders) || finishedOrders.length === 0) {
        // If no finished orders, redirect to orders index
        return new Response(null, {
            status: 302,
            headers: { "Location": "/orders" }
        });
    }

    // Pick a random order
    const randomIndex = Math.floor(Math.random() * finishedOrders.length);
    const randomOrder = finishedOrders[randomIndex];

    // Redirect to the random order page
    return new Response(null, {
        status: 302,
        headers: { "Location": `/orders/${randomOrder.id}` }
    });
};

