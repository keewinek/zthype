import { FreshContext } from "$fresh/server.ts";
import Order from "../../interfaces/Order.ts";
import { create_order, get_next_order_id, get_order_by_value, update_order } from "../../utils/database.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const url = new URL(_req.url);
    const order_id = url.searchParams.get("order_id");
    const admin_password = url.searchParams.get("admin_password");

    const correct_password = Deno.env.get("ADMIN_PASSWORD");

    if (!order_id || !admin_password) {
        return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400 });
    }

    if (admin_password != correct_password) {
        return new Response(JSON.stringify({"error" : "Invalid admin password"}), { status: 400 });
    }
    
    const out_data = await get_order_by_value("id", parseInt(order_id));

    if (!out_data || 'error' in out_data) {
        return new Response(JSON.stringify({"error" : "Order not found"}), { status: 400 });
    }
    if ('error' in out_data) {
        return new Response(JSON.stringify({"error" : out_data.error}), { status: 400 });
    }

    const order: Order = out_data as Order;

    if (order.moderated) {
        return new Response(JSON.stringify({"error" : "Order already moderated"}), { status: 400 });
    }

    order.moderated = true;
    order.rejected = false;

    const out = await update_order(order);

    if ('error' in out)
    {
        return new Response(JSON.stringify({"error" : out.error}), { status: 400 });
    }

    return new Response(JSON.stringify({"success" : true, "order" : order}), { status: 200 });
};
