import { createClient, Client } from "@libsql/client";
import { send_error, send_log } from "../utils/discord_webhook_sender.ts"
import Order, { DatabaseOrder } from "../interfaces/Order.ts";
import { Article } from "../interfaces/Article.ts";

// Query helper to replace Appwrite SDK Query
export const Query = {
    equal: (key: string, value: unknown) => ({ type: 'equal', key, value }),
    greaterThanOrEqual: (key: string, value: unknown) => ({ type: 'greaterThanOrEqual', key, value }),
    orderDesc: (key: string) => ({ type: 'orderDesc', key }),
    orderAsc: (key: string) => ({ type: 'orderAsc', key }),
    limit: (n: number) => ({ type: 'limit', value: n }),
};

export type QueryType = ReturnType<typeof Query.equal> | ReturnType<typeof Query.greaterThanOrEqual> | ReturnType<typeof Query.orderDesc> | ReturnType<typeof Query.orderAsc> | ReturnType<typeof Query.limit>;

// Turso database configuration
const TURSO_URL = Deno.env.get("TURSO_DATABASE_URL") || "libsql://zthype-keewinek.aws-eu-west-1.turso.io";
const TURSO_AUTH_TOKEN = Deno.env.get("TURSO_AUTH_TOKEN") || "";

const add_to_order_id = 1000;

let client: Client | null = null;
let client_connected = false;

async function connect_client() {
    if (client_connected && client) return;

    const authToken = TURSO_AUTH_TOKEN;
    
    if (!authToken) {
        console.error("[DB] TURSO_AUTH_TOKEN environment variable is not set.");
        return;
    }
    
    client = createClient({
        url: TURSO_URL,
        authToken: authToken,
    });

    client_connected = true;
    console.log("[DB] Connected to Turso database.");
    
    // Initialize tables
    await init_tables();
}

async function init_tables() {
    if (!client) return;
    
    // Create orders table
    await client.execute(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            uuid TEXT UNIQUE NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            contact_email TEXT NOT NULL,
            moderated INTEGER DEFAULT 0,
            complete INTEGER DEFAULT 0,
            type TEXT NOT NULL,
            rejected INTEGER DEFAULT 0,
            reject_reason TEXT DEFAULT '',
            data_string TEXT DEFAULT '{}'
        )
    `);
    
    // Create articles table
    await client.execute(`
        CREATE TABLE IF NOT EXISTS articles (
            uuid TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            urlid TEXT NOT NULL,
            source_id TEXT NOT NULL,
            url TEXT NOT NULL,
            order_ids TEXT DEFAULT '[]',
            order_ids_count INTEGER DEFAULT 0,
            paragraph TEXT DEFAULT '',
            generated_paragraphs TEXT DEFAULT '[]',
            created_at INTEGER NOT NULL,
            img_urls TEXT DEFAULT '[]'
        )
    `);
    
    // Create access_codes table
    await client.execute(`
        CREATE TABLE IF NOT EXISTS access_codes (
            code TEXT PRIMARY KEY,
            created_at INTEGER NOT NULL
        )
    `);
    
    // Create index on urlid for faster lookups
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_articles_urlid ON articles(urlid)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id)`);
    await client.execute(`CREATE INDEX IF NOT EXISTS idx_orders_uuid ON orders(uuid)`);
    
    console.log("[DB] Tables initialized.");
}

export function get_only_order_keys(order: Order) {
    return {
        id: order.id,
        uuid: order.uuid,
        created_at: order.created_at,
        contact_email: order.contact_email,
        moderated: order.moderated,
        complete: order.complete,
        type: order.type,
        rejected: order.rejected,
        reject_reason: order.reject_reason,
        updated_at: order.updated_at,
        data: order.data,
    } as Order;
}

export function get_only_article_keys(article: Article) {
    return {
        type: article.type,
        title: article.title,
        urlid: article.urlid,
        source_id: article.source_id,
        url: article.url,
        order_ids: article.order_ids,
        generated_paragraphs: article.generated_paragraphs,
        order_ids_count: article.order_ids_count,
        paragraph: article.paragraph,
        created_at: article.created_at,
        img_urls: article.img_urls,
        uuid: article.uuid
    } as Article;
}

// Get order without data, because it wont fit in our database.
export function get_database_order(order: Order) {
    return {
        id: order.id,
        uuid: order.uuid,
        created_at: order.created_at,
        contact_email: order.contact_email,
        moderated: order.moderated,
        complete: order.complete,
        type: order.type,
        rejected: order.rejected,
        updated_at: order.updated_at,
        reject_reason: order.reject_reason,
        data_string: JSON.stringify(order.data),
    } as DatabaseOrder;
}

// Add the "Data" to our order object.
export function get_order_from_database_order(database_order: DatabaseOrder) {
    return {
        ...database_order,
        data: JSON.parse(database_order.data_string || '{}')
    } as Order;
}

// Convert database row to Order
function row_to_order(row: Record<string, unknown>): Order {
    const dbOrder: DatabaseOrder = {
        id: row.id as number,
        uuid: row.uuid as string,
        created_at: row.created_at as number,
        updated_at: row.updated_at as number,
        contact_email: row.contact_email as string,
        moderated: Boolean(row.moderated),
        complete: Boolean(row.complete),
        type: row.type as string,
        rejected: Boolean(row.rejected),
        reject_reason: row.reject_reason as string || '',
        data_string: row.data_string as string || '{}'
    };
    return get_order_from_database_order(dbOrder);
}

// Convert database row to Article
function row_to_article(row: Record<string, unknown>): Article {
    return {
        uuid: row.uuid as string,
        type: row.type as string,
        title: row.title as string,
        urlid: row.urlid as string,
        source_id: row.source_id as string,
        url: row.url as string,
        order_ids: JSON.parse(row.order_ids as string || '[]'),
        order_ids_count: row.order_ids_count as number,
        paragraph: row.paragraph as string,
        generated_paragraphs: JSON.parse(row.generated_paragraphs as string || '[]'),
        created_at: row.created_at as number,
        img_urls: JSON.parse(row.img_urls as string || '[]')
    };
}

export async function get_orders_by_queries(queries: QueryType[]) {
    await connect_client();
    if (!client) return { "error": "Database not connected" };

    try {
        let whereClause = "";
        let orderClause = "";
        let limitClause = "";
        const conditions: string[] = [];
        const values: unknown[] = [];
        
        for (const q of queries) {
            if (q.type === 'equal') {
                const equalQuery = q as { type: 'equal'; key: string; value: unknown };
                if (Array.isArray(equalQuery.value)) {
                    // Handle IN clause for arrays
                    const placeholders = equalQuery.value.map(() => '?').join(', ');
                    conditions.push(`${equalQuery.key} IN (${placeholders})`);
                    values.push(...equalQuery.value);
                } else {
                    conditions.push(`${equalQuery.key} = ?`);
                    values.push(equalQuery.value);
                }
            } else if (q.type === 'greaterThanOrEqual') {
                const gteQuery = q as { type: 'greaterThanOrEqual'; key: string; value: unknown };
                conditions.push(`${gteQuery.key} >= ?`);
                values.push(gteQuery.value);
            } else if (q.type === 'orderDesc') {
                const orderDescQuery = q as { type: 'orderDesc'; key: string };
                orderClause = ` ORDER BY ${orderDescQuery.key} DESC`;
            } else if (q.type === 'orderAsc') {
                const orderAscQuery = q as { type: 'orderAsc'; key: string };
                orderClause = ` ORDER BY ${orderAscQuery.key} ASC`;
            } else if (q.type === 'limit') {
                const limitQuery = q as { type: 'limit'; value: number };
                limitClause = ` LIMIT ${limitQuery.value}`;
            }
        }
        
        if (conditions.length > 0) {
            whereClause = ` WHERE ${conditions.join(' AND ')}`;
        }
        
        const result = await client.execute({
            sql: `SELECT * FROM orders${whereClause}${orderClause}${limitClause}`,
            args: values as (string | number | null | boolean)[]
        });

        if (result.rows.length === 0) return null;

        return result.rows.map(row => row_to_order(row as unknown as Record<string, unknown>));
    } catch (e) {
        send_error(`[DB Orders] Failed to get orders: ${e}`);
        return { "error": String(e) };
    }
}

export async function get_articles_by_queries(queries: QueryType[]) {
    await connect_client();
    if (!client) return { "error": "Database not connected" };

    try {
        let whereClause = "";
        let orderClause = "";
        let limitClause = "";
        const conditions: string[] = [];
        const values: unknown[] = [];
        
        for (const q of queries) {
            if (q.type === 'equal') {
                const equalQuery = q as { type: 'equal'; key: string; value: unknown };
                if (Array.isArray(equalQuery.value)) {
                    // Handle IN clause for arrays
                    const placeholders = equalQuery.value.map(() => '?').join(', ');
                    conditions.push(`${equalQuery.key} IN (${placeholders})`);
                    values.push(...equalQuery.value);
                } else {
                    conditions.push(`${equalQuery.key} = ?`);
                    values.push(equalQuery.value);
                }
            } else if (q.type === 'greaterThanOrEqual') {
                const gteQuery = q as { type: 'greaterThanOrEqual'; key: string; value: unknown };
                conditions.push(`${gteQuery.key} >= ?`);
                values.push(gteQuery.value);
            } else if (q.type === 'orderDesc') {
                const orderDescQuery = q as { type: 'orderDesc'; key: string };
                orderClause = ` ORDER BY ${orderDescQuery.key} DESC`;
            } else if (q.type === 'orderAsc') {
                const orderAscQuery = q as { type: 'orderAsc'; key: string };
                orderClause = ` ORDER BY ${orderAscQuery.key} ASC`;
            } else if (q.type === 'limit') {
                const limitQuery = q as { type: 'limit'; value: number };
                limitClause = ` LIMIT ${limitQuery.value}`;
            }
        }
        
        if (conditions.length > 0) {
            whereClause = ` WHERE ${conditions.join(' AND ')}`;
        }
        
        const result = await client.execute({
            sql: `SELECT * FROM articles${whereClause}${orderClause}${limitClause}`,
            args: values as (string | number | null | boolean)[]
        });

        if (result.rows.length === 0) return null;

        return result.rows.map(row => row_to_article(row as unknown as Record<string, unknown>));
    } catch (e) {
        send_error(`[DB Articles] Failed to get articles: ${e}`);
        return { "error": String(e) };
    }
}

export async function get_order_by_value(key: string, value: unknown) {
    await connect_client();
    if (!client) return { "error": "Database not connected" };

    try {
        const result = await client.execute({
            sql: `SELECT * FROM orders WHERE ${key} = ? LIMIT 1`,
            args: [value] as (string | number | null | boolean)[]
        });

        if (result.rows.length === 0) return null;

        return row_to_order(result.rows[0] as unknown as Record<string, unknown>);
    } catch (e) {
        send_error(`[DB Orders] Failed to get order by value: ${e}`);
        return null;
    }
}

export async function get_next_order_id() {
    await connect_client();
    if (!client) return { "error": "Database not connected" };

    try {
        const result = await client.execute(`SELECT MAX(id) as max_id FROM orders`);
        
        if (result.rows.length === 0 || result.rows[0].max_id === null) {
            return 1 + add_to_order_id;
        }

        return (result.rows[0].max_id as number) + 1;
    } catch (e) {
        send_error(`[DB Orders] Failed to get next order id: ${e}`);
        return { "error": String(e) };
    }
}

export async function update_order(order: Order) {
    try {
        await connect_client();
        if (!client) return { "error": "Database not connected" };
    
        const dbOrder = get_database_order(order);
        
        await client.execute({
            sql: `UPDATE orders SET 
                created_at = ?,
                updated_at = ?,
                contact_email = ?,
                moderated = ?,
                complete = ?,
                type = ?,
                rejected = ?,
                reject_reason = ?,
                data_string = ?
            WHERE uuid = ?`,
            args: [
                dbOrder.created_at,
                dbOrder.updated_at,
                dbOrder.contact_email,
                dbOrder.moderated ? 1 : 0,
                dbOrder.complete ? 1 : 0,
                dbOrder.type,
                dbOrder.rejected ? 1 : 0,
                dbOrder.reject_reason,
                dbOrder.data_string,
                dbOrder.uuid
            ]
        });

        return { "success": true };
    } catch (e) {
        send_error(`[DB Orders] Failed to update order: ${e}`);
        return { "error": String(e) };
    }
}

export async function update_article(article: Article) {
    try {
        await connect_client();
        if (!client) return { "error": "Database not connected" };
    
        const articleData = get_only_article_keys(article);
        
        await client.execute({
            sql: `UPDATE articles SET 
                type = ?,
                title = ?,
                urlid = ?,
                source_id = ?,
                url = ?,
                order_ids = ?,
                order_ids_count = ?,
                paragraph = ?,
                generated_paragraphs = ?,
                created_at = ?,
                img_urls = ?
            WHERE uuid = ?`,
            args: [
                articleData.type,
                articleData.title,
                articleData.urlid,
                articleData.source_id,
                articleData.url,
                JSON.stringify(articleData.order_ids),
                articleData.order_ids_count,
                articleData.paragraph,
                JSON.stringify(articleData.generated_paragraphs),
                articleData.created_at,
                JSON.stringify(articleData.img_urls),
                articleData.uuid
            ]
        });

        return { "success": true };
    } catch (e) {
        send_error(`[DB Articles] Failed to update article: ${e}`);
        return { "error": String(e) };
    }
}

export async function create_order(order: Order) {
    await connect_client();
    if (!client) return { "error": "Database not connected" };

    console.log(`[DB orders] 1 Creating order: ${JSON.stringify(order)}`);

    const existingOrder = await get_order_by_value("uuid", order.uuid);
    if (existingOrder != null && !('error' in existingOrder)) {
        return { "error": "Order already exists in database." };
    }

    try {
        const dbOrder = get_database_order(order);
        
        await client.execute({
            sql: `INSERT INTO orders (id, uuid, created_at, updated_at, contact_email, moderated, complete, type, rejected, reject_reason, data_string)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                dbOrder.id,
                dbOrder.uuid,
                dbOrder.created_at,
                dbOrder.updated_at,
                dbOrder.contact_email,
                dbOrder.moderated ? 1 : 0,
                dbOrder.complete ? 1 : 0,
                dbOrder.type,
                dbOrder.rejected ? 1 : 0,
                dbOrder.reject_reason,
                dbOrder.data_string
            ]
        });

        return { "success": true, "response": { $id: dbOrder.uuid } };
    } catch (e) {
        send_error(`[DB Orders] Failed to create order: ${e}`);
        return { "error": String(e) };
    }
}

export async function create_article(article: Article) {
    await connect_client();
    if (!client) return { "error": "Database not connected" };

    try {
        const articleData = get_only_article_keys(article);
        
        await client.execute({
            sql: `INSERT INTO articles (uuid, type, title, urlid, source_id, url, order_ids, order_ids_count, paragraph, generated_paragraphs, created_at, img_urls)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                articleData.uuid,
                articleData.type,
                articleData.title,
                articleData.urlid,
                articleData.source_id,
                articleData.url,
                JSON.stringify(articleData.order_ids),
                articleData.order_ids_count,
                articleData.paragraph,
                JSON.stringify(articleData.generated_paragraphs),
                articleData.created_at,
                JSON.stringify(articleData.img_urls)
            ]
        });

        return { "success": true, "response": { $id: articleData.uuid } };
    } catch (e) {
        send_error(`[DB Articles] Failed to create article: ${e}`);
        return { "error": String(e) };
    }
}

export async function delete_article(uuid: string): Promise<{ success: boolean; error?: string }> {
    await connect_client();
    if (!client) return { success: false, error: "Database not connected" };

    try {
        const result = await client.execute({
            sql: `DELETE FROM articles WHERE uuid = ?`,
            args: [uuid]
        });

        if (result.rowsAffected === 0) {
            return { success: false, error: "Article not found" };
        }

        return { success: true };
    } catch (e) {
        send_error(`[DB Articles] Failed to delete article: ${e}`);
        return { success: false, error: String(e) };
    }
}

// ==================== ACCESS CODES ====================

export interface AccessCode {
    code: string;
    created_at: number;
}

// Generate a random 8-character access code (uppercase letters and digits)
function generate_access_code(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

export async function create_access_code(): Promise<{ success: boolean; code?: string; error?: string }> {
    await connect_client();
    if (!client) return { success: false, error: "Database not connected" };

    try {
        // Generate a unique code (retry if collision)
        let code = generate_access_code();
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            const existing = await client.execute({
                sql: `SELECT code FROM access_codes WHERE code = ?`,
                args: [code]
            });

            if (existing.rows.length === 0) {
                break;
            }

            code = generate_access_code();
            attempts++;
        }

        if (attempts >= maxAttempts) {
            return { success: false, error: "Failed to generate unique code" };
        }

        await client.execute({
            sql: `INSERT INTO access_codes (code, created_at) VALUES (?, ?)`,
            args: [code, Date.now()]
        });

        return { success: true, code };
    } catch (e) {
        send_error(`[DB Access Codes] Failed to create access code: ${e}`);
        return { success: false, error: String(e) };
    }
}

export async function list_access_codes(): Promise<{ success: boolean; codes?: AccessCode[]; error?: string }> {
    await connect_client();
    if (!client) return { success: false, error: "Database not connected" };

    try {
        const result = await client.execute(`SELECT * FROM access_codes ORDER BY created_at DESC`);

        const codes: AccessCode[] = result.rows.map(row => ({
            code: row.code as string,
            created_at: row.created_at as number
        }));

        return { success: true, codes };
    } catch (e) {
        send_error(`[DB Access Codes] Failed to list access codes: ${e}`);
        return { success: false, error: String(e) };
    }
}

export async function delete_access_code(code: string): Promise<{ success: boolean; error?: string }> {
    await connect_client();
    if (!client) return { success: false, error: "Database not connected" };

    try {
        const result = await client.execute({
            sql: `DELETE FROM access_codes WHERE code = ?`,
            args: [code]
        });

        if (result.rowsAffected === 0) {
            return { success: false, error: "Code not found" };
        }

        return { success: true };
    } catch (e) {
        send_error(`[DB Access Codes] Failed to delete access code: ${e}`);
        return { success: false, error: String(e) };
    }
}

export async function validate_and_consume_access_code(code: string): Promise<{ success: boolean; error?: string }> {
    await connect_client();
    if (!client) return { success: false, error: "Database not connected" };

    try {
        // Check if code exists
        const existing = await client.execute({
            sql: `SELECT code FROM access_codes WHERE code = ?`,
            args: [code]
        });

        if (existing.rows.length === 0) {
            return { success: false, error: "Invalid access code" };
        }

        // Delete the code (consume it)
        await client.execute({
            sql: `DELETE FROM access_codes WHERE code = ?`,
            args: [code]
        });

        return { success: true };
    } catch (e) {
        send_error(`[DB Access Codes] Failed to validate access code: ${e}`);
        return { success: false, error: String(e) };
    }
}
