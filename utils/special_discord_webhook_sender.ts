import { Article } from "../interfaces/Article.ts";
import Order from "../interfaces/Order.ts";
import { send_log } from "./discord_webhook_sender.ts";

export function send_order_completion_message(order: Order)
{
    let message = `## ✅ Zamówienie #${order.id} zostało zrealizowane \n`
    message += `### [Zamówienie na platformie ZT Hype](https://zthype.deno.dev/orders/${order.id}) \n`
    message += `### Email kontaktowy: ${order.contact_email} \n`
    message += `### Typ zamówienia: ${order.type} \n`

    send_log("orders", message)
}

export function send_article_creation_message(article: Article)
{
    let message = `## ✅ Artykuł "${article.type}" został utworzony/zakualizowany \n`
    message += `### [Link do artykułu](${article.url}) \n`
    message += `### Źródło: ${article.source_id} \n`
    message += `### Zamówienia: #${article.order_ids.join(", #")}`

    send_log("articles", message)
}

export function send_order_placed_message(order: Order)
{
    let message = `## ⚠️ Zamówienie #${order.id} zostało złożone i czeka na potwierdzenie \n`
    message += `### [Zamówienie na platformie ZT Hype](https://zthype.deno.dev/orders/${order.id}) \n`
    message += `### Email kontaktowy: ${order.contact_email} \n`
    message += `### Typ zamówienia: ${order.type} \n`

    send_log("orders", message)
}