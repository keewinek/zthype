import { FreshContext } from "$fresh/server.ts";
import Order from "../../interfaces/Order.ts";
import { create_order, get_next_order_id, get_order_by_value } from "../../utils/database.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
	const url = new URL(_req.url);
	const ids_str = url.searchParams.get("ids");
	const admin_password = url.searchParams.get("admin_password");

	if (!ids_str) {
		return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400 });
	}
	
    const ids = ids_str.split(",").map((id) => parseInt(id));

    const out_datas = await Promise.all(ids.map((id) => get_order_by_value("id", id)));
    const orders: Order[] = [];

    let error = "";

	// Check if user is admin
	const correct_password = Deno.env.get("ADMIN_PASSWORD");
	const is_admin = admin_password && admin_password === correct_password;

    for (let i = 0; i < out_datas.length; i++) {
        const out_data = out_datas[i];
        if (out_data == null || 'error' in out_data) {
            error += `Order with id ${ids[i]} not found. ${out_data?.error}\n`;
            continue;
        }

        const order = out_data as Order;
		// Remove contact_email for non-admin users (RODO compliance)
		const order_response = is_admin ? order : { ...order, contact_email: undefined };
        orders.push(order_response as Order);
    }

    if (error.length > 0) {
        return new Response(JSON.stringify({"success" : false, "orders" : orders, "error" : error}), { status: 400 });
    }


	return new Response(JSON.stringify({"success" : true, "orders" : orders}), { status: 200 });
};
