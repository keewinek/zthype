import {useEffect, useState} from "preact/hooks";
import LoadingScreen from "./LoadingScreen.tsx";
import Order from "../interfaces/Order.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import { OrderStatusBadge } from "./OrderPage.tsx";

export default function MyOrdersPage() {
    const [loading, set_loading] = useState(true);
    const [orders, set_orders] = useState([] as Order[])
    const [error, set_error] = useState("");

    let order_ids = localStorage.getItem("order_ids")?.split(",").map((id) => parseInt(id)) || [];
    order_ids = order_ids.filter((id) => !isNaN(id));

    localStorage.setItem("order_ids", order_ids?.join(",")); // fix localStorage for further use
    console.log(order_ids);

    useEffect(() => {
        const fetch_order = async () => {
            const response = await fetch(`/api/get_orders?ids=${order_ids.join(",")}`);

            if (!response.ok) {
                console.error(response);
                set_error(response.statusText);
                set_loading(false);
                return;
            }

            const data = await response.json();

            if (data.error) {
                console.error(data.error);
                set_error(data.error);
                set_loading(false);
                return;
            }

            set_orders(data.orders);
            set_loading(false);

            console.log(data);
        };

        if (order_ids.length == 0) {
            set_loading(false);
        } else {
            fetch_order();
        }

    }, [])

    return (
        <>
            <LoadingScreen msg={`Ładowanie twoich zamówień...`} is_loading={loading} />
            <div class="mx-auto w-full max-w-[80rem] max-md:px-8 px-2">
                <h1 class="mt-2 mb-8">Twoje zamówienia</h1>
                
                {error && <p class="text-red-200 bg-red-950 w-full rounded-md p-4 my-4"><i class="fa-solid fa-circle-exclamation mr-2"></i> Wystąpił błąd podczas ładowania zamówień: {error}</p>}
            
                {orders.length == 0 && 
                    <p class="text-gray text-center my-2">Nie złożyłeś/aś jeszcze żadnych zamówień.</p>
                }

                {orders && orders.map((order) => (
                    <div class="my-4 border-[1px] border-background-light px-4 py-2 rounded-md md:flex">
                        <p class="my-2 max-md:my text-gray mr-2 text-xl">#{order.id}</p>
                        {
                            order.type == "media_mention" &&
                            <>
                                <a href={`/orders/${order.id}`} class="my-2 text-xl max-md:block">Wzmianka medialna {(order.data as OrderMediaMentionData).project_name}</a>
                            </>
                        }
                        <OrderStatusBadge order={order} className="m-2 ml-auto max-md:block max-md:mt-4"/>
                    </div>
                ))}
            </div>
        </>
    )
}