import { FreshContext } from "$fresh/server.ts";
import OrderMediaMentionData from "../../interfaces/MediaMentionData.ts";
import Order from "../../interfaces/Order.ts";
import { create_order, get_next_order_id } from "../../utils/database.ts";
import { send_order_placed_message } from "../../utils/special_discord_webhook_sender.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
	const url = new URL(_req.url);
	const project_name = url.searchParams.get("project_name");
	const project_desc = url.searchParams.get("project_desc");
	const project_link = url.searchParams.get("project_link");
	const project_zt_link = url.searchParams.get("project_zt_link");
	const contact_email = url.searchParams.get("contact_email");
	const selected_sources = url.searchParams.get("selected_sources");

	if (!project_name || !project_desc || !project_link || !project_zt_link || !contact_email || !selected_sources) {
		console.log(project_name, project_desc, project_link, project_zt_link, contact_email, selected_sources	);
		return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400 });
	}
	if (project_name.length > 255) {
		return new Response(JSON.stringify({"error" : "Project name too long"}), { status: 400 });
	}
	if (project_desc.length > 100000) {
		return new Response(JSON.stringify({"error" : "Project description too long"}), { status: 400 });
	}
	if (project_link.length > 255) {
		return new Response(JSON.stringify({"error" : "Project link too long"}), { status: 400 });
	}
	if (project_zt_link.length > 255) {
		return new Response(JSON.stringify({"error" : "Project ZwzT link too long"}), { status: 400 });
	}
	if (contact_email.length > 255) {
		return new Response(JSON.stringify({"error" : "Contact email too long"}), { status: 400 });
	}

	const order: Order = {
		id: (await get_next_order_id()) as number,
		uuid: crypto.randomUUID(),
		created_at: Date.now(),
		complete: false,
		moderated: false,
		updated_at: Date.now(),
		contact_email: contact_email,
		type: "media_mention",
		rejected: false,
		reject_reason: "",
		data: {
			project_name: project_name,
			project_desc: project_desc,
			project_link: project_link,
			project_zt_link: project_zt_link,
			selected_sources: selected_sources.split(","),
			completed_sources: [],
			completed_urls: [],
		} as OrderMediaMentionData,
	};

	create_order(order);
	send_order_placed_message(order);

	return new Response(JSON.stringify({"success" : true, "order" : order}), { status: 200 });
};
