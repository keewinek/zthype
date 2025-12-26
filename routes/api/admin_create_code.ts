import { FreshContext } from "$fresh/server.ts";
import { create_access_code } from "../../utils/database.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const url = new URL(_req.url);
    const admin_password = url.searchParams.get("admin_password");

    const correct_password = Deno.env.get("ADMIN_PASSWORD");

    if (!admin_password) {
        return new Response(JSON.stringify({"error" : "Missing admin_password parameter"}), { status: 400 });
    }

    if (admin_password != correct_password) {
        return new Response(JSON.stringify({"error" : "Invalid admin password"}), { status: 401 });
    }

    const result = await create_access_code();

    if (!result.success) {
        return new Response(JSON.stringify({"error" : result.error}), { status: 500 });
    }

    return new Response(JSON.stringify({"success" : true, "code" : result.code}), { status: 200 });
};

