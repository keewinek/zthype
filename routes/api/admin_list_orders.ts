import { FreshContext } from "$fresh/server.ts";
import Order from "../../interfaces/Order.ts";
import { get_orders_by_queries, Query } from "../../utils/database.ts";

// Helper function to get order state priority for sorting
// 0 = waiting for approval (!moderated && !rejected)
// 1 = in progress (moderated && !complete && !rejected)
// 2 = finished (complete && !rejected)
// 3 = rejected
function get_order_state_priority(order: Order): number {
    if (order.rejected) return 3;
    if (order.complete && !order.rejected) return 2;
    if (order.moderated && !order.complete && !order.rejected) return 1;
    if (!order.moderated && !order.rejected) return 0;
    return 3; // fallback
}

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const url = new URL(_req.url);
    const admin_password = url.searchParams.get("admin_password");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "100");

    const correct_password = Deno.env.get("ADMIN_PASSWORD");

    if (!admin_password) {
        return new Response(JSON.stringify({"error" : "Missing admin_password parameter"}), { status: 400 });
    }

    if (admin_password != correct_password) {
        return new Response(JSON.stringify({"error" : "Invalid admin password"}), { status: 401 });
    }

    if (page < 1) {
        return new Response(JSON.stringify({"error" : "Page must be >= 1"}), { status: 400 });
    }

    if (limit < 1 || limit > 100) {
        return new Response(JSON.stringify({"error" : "Limit must be between 1 and 100"}), { status: 400 });
    }

    try {
        // Get all orders (we need to sort by state, so we fetch all and sort in memory)
        const all_orders_result = await get_orders_by_queries([
            Query.orderDesc("created_at")
        ]);

        if (!all_orders_result || 'error' in all_orders_result) {
            return new Response(JSON.stringify({
                "error" : all_orders_result?.error || "Failed to fetch orders"
            }), { status: 500 });
        }

        const all_orders = all_orders_result as Order[];

        // Sort by state priority, then by created_at descending
        const sorted_orders = all_orders.sort((a, b) => {
            const state_a = get_order_state_priority(a);
            const state_b = get_order_state_priority(b);
            
            if (state_a !== state_b) {
                return state_a - state_b; // Lower priority first (waiting -> in progress -> finished)
            }
            
            // If same state, sort by created_at descending (newest first)
            return b.created_at - a.created_at;
        });

        // Calculate pagination
        const total_orders = sorted_orders.length;
        const total_pages = Math.ceil(total_orders / limit);
        const offset = (page - 1) * limit;
        const paginated_orders = sorted_orders.slice(offset, offset + limit);

        return new Response(JSON.stringify({
            "success" : true,
            "orders" : paginated_orders,
            "pagination" : {
                "page" : page,
                "limit" : limit,
                "total_orders" : total_orders,
                "total_pages" : total_pages,
                "has_next" : page < total_pages,
                "has_prev" : page > 1
            }
        }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({
            "error" : `Failed to fetch orders: ${e}`
        }), { status: 500 });
    }
};

