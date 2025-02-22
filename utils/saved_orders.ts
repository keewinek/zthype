import Order from "../interfaces/Order.ts";

export function add_saved_order(order: Order)
{
    let order_ids = localStorage.getItem("order_ids")?.split(",").map((id) => parseInt(id)) || [];
    order_ids = order_ids.filter((id) => !isNaN(id));
    order_ids.push(order.id);
    localStorage.setItem("order_ids", order_ids.join(","));
}

export function get_saved_orders()
{
    let order_ids = localStorage.getItem("order_ids")?.split(",").map((id) => parseInt(id)) || [];
    order_ids = order_ids.filter((id) => !isNaN(id));
    return order_ids;
}