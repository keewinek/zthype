import * as sdk from "https://deno.land/x/appwrite/mod.ts";
import { send_error, send_log } from "../utils/discord_webhook_sender.ts"
import Order, { DatabaseOrder } from "../interfaces/Order.ts";
import { Article } from "../interfaces/Article.ts";

const project_id = "67b7809d0024db75ac21";

const database_id = "67b780b2001dde402201";

const orders_id = "67b780d20037648a5b17";
const articles_id = "67bcb076000438b62272";

const add_to_order_id = 1000;

const client = new sdk.Client();
const databases = new sdk.Databases(client);

const max_requests_per_minute = 120;

let client_connected = false;

let request_count_in_minute = 0;
let current_minute = new Date().getMinutes();

function connect_client()
{
    if (client_connected) return;

    const appwrite_key = Deno.env.get("APPWRITE_API_KEY")
    
    if (appwrite_key == null) {
        console.error("[DB] APPWRITE_API_KEY environment variable is not set.");
        return
    }
    
    client
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject(project_id) // Your project ID
        .setKey(appwrite_key) // Your secret API key
    ;

    client_connected = true;

    console.log("[DB] Connected to Appwrite client.");
}


function good_rate_limit() {
    const now = new Date();
    const minute = now.getMinutes();

    if (minute !== current_minute) {
        current_minute = minute;
        request_count_in_minute = 0;
    }

    if (request_count_in_minute >= max_requests_per_minute) {
        console.error(`[DB] Self Rate limit exceeded. ${request_count_in_minute} requests made in the current minute.`);
        send_log("error", `⛔ Database Self Rate limit exceeded. ${request_count_in_minute} requests made in the current minute.`);
        return false;
    }

    request_count_in_minute++;

    return true;
}

export function get_only_order_keys(order: Order)
{
    //! THIS MAY CAUSE PROBLEMS!
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
    } as Order
}

export function get_only_article_keys(article: Article)
{
    return {
        type: article.type,
        title: article.title,
        urlid: article.urlid,
        source_id: article.source_id,
        url: article.url,
        order_ids: article.order_ids,
        order_ids_count: article.order_ids_count,
        paragraph: article.paragraph,
        created_at: article.created_at,
        uuid: article.uuid
    } as Article
}

// Get order without data, because it wont fit in our database.
export function get_database_order(order: Order) 
{
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
    } as DatabaseOrder
}

// Add the "Data" to our order object.
export function get_order_from_database_order(database_order: DatabaseOrder)
{
    return {
        ...database_order,
        data: JSON.parse(database_order.data_string)
    } as Order
}

export async function get_orders_by_queries(query: string[])
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    const result = await databases.listDocuments(
        database_id, // databaseId
        orders_id, // collectionId
        query
    );

    if (result.documents.length == 0) return null;

    return result.documents.map(doc => get_order_from_database_order(doc as unknown as DatabaseOrder));
}

export async function get_articles_by_queries(query: string[])
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    const result = await databases.listDocuments(
        database_id, // databaseId
        articles_id, // collectionId
        query
    );

    if (result.documents.length == 0) return null;

    return result.documents.map(doc => doc as unknown as Article);
}

export async function get_order_by_value(key: string, value: any)
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};
    const orders = await get_orders_by_queries([sdk.Query.equal(key, value)]);
    return Array.isArray(orders) ? orders[0] : null;
}


export async function get_next_order_id()
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    const result = await databases.listDocuments(
        database_id, // databaseId
        orders_id, // collectionId
        [
            sdk.Query.orderDesc("id")
        ]
    );

    if (result.documents.length == 0) return 1 + add_to_order_id;

    const order = result.documents[0] as unknown as Order;
    return order.id + 1;
}

export async function update_order(order: Order) {
    try {
        connect_client()
        if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};
    
        const result = await databases.updateDocument(
            database_id, // databaseId
            orders_id, // collectionId
            order.uuid, // documentId
            get_database_order(order), // data (optional)
        );
    
        return result;
    }
    catch (e) {
        send_error(`[DB Orders] Failed to update order: ${e}`)
        return {"error" : e};
    }
}

export async function update_article(article: Article) {
    try {
        connect_client()
        if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};
    
        const result = await databases.updateDocument(
            database_id, // databaseId
            articles_id, // collectionId
            article.uuid, // documentId
            get_only_article_keys(article), // data (optional)
        );
    
        return result;
    }
    catch (e) {
        send_error(`[DB Articles] Failed to update article: ${e}`)
        return {"error" : e};
    } 
}

export async function create_order(order: Order)
{
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    console.log(`[DB orders] 1 Creating order: ${order}`)

    if (await get_order_by_value("uuid", order.uuid) != null) {
        return {"error" : "Order already exists in database."};
    }

    const result = await databases.createDocument(
        database_id, // Database ID
        orders_id, // Collection ID
        order.uuid, // Document ID
        get_database_order(order), // Data
    )
    
    if (result.$id != null){
        return {"success" : true, "response" : result};
    }

    return {"error" : result};
}

export async function create_article(article: Article) {
    connect_client()
    if (!good_rate_limit()) return {"error" : "Self Rate limit exceeded."};

    const result = await databases.createDocument(
        database_id, // Database ID
        articles_id, // Collection ID
        article.uuid, // Document ID
        get_only_article_keys(article), // Data
    )

    if (result.$id != null){
        return {"success" : true, "response" : result};
    }

    return {"error" : result};
}