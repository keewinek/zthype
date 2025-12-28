import { FreshContext } from "$fresh/server.ts";
import Order from "../../interfaces/Order.ts";
import { create_order, get_next_order_id, get_order_by_value } from "../../utils/database.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
	const url = new URL(_req.url);
	const id = url.searchParams.get("id");
	const admin_password = url.searchParams.get("admin_password");

	if (!id) {
		return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400 });
	}
	
    const out_data = await get_order_by_value("id", parseInt(id));

	if (!out_data || 'error' in out_data) {
        return new Response(JSON.stringify({"error" : "Order not found"}), { status: 400 });
    }
    if ('error' in out_data) {
        return new Response(JSON.stringify({"error" : out_data.error}), { status: 400 });
    }

    const order: Order = out_data as Order;

	// Check if user is admin
	const correct_password = Deno.env.get("ADMIN_PASSWORD");
	const is_admin = admin_password && admin_password === correct_password;

	// Remove contact_email for non-admin users (RODO compliance)
	const order_response = is_admin ? order : { ...order, contact_email: undefined };

	return new Response(JSON.stringify({"success" : true, "order" : order_response}), { status: 200 });
};
