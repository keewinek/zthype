import { FreshContext } from "$fresh/server.ts";
import { delete_access_code } from "../../utils/database.ts";

export const handler = async (_req: Request, _ctx: FreshContext): Promise<Response> => {
    const url = new URL(_req.url);
    const admin_password = url.searchParams.get("admin_password");
    const code = url.searchParams.get("code");

    const correct_password = Deno.env.get("ADMIN_PASSWORD");

    if (!admin_password || !code) {
        return new Response(JSON.stringify({"error" : "Missing parameters"}), { status: 400 });
    }

    if (admin_password != correct_password) {
        return new Response(JSON.stringify({"error" : "Invalid admin password"}), { status: 401 });
    }

    const result = await delete_access_code(code);

    if (!result.success) {
        return new Response(JSON.stringify({"error" : result.error}), { status: 400 });
    }

    return new Response(JSON.stringify({"success" : true}), { status: 200 });
};

