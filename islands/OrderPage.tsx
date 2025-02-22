import {useEffect, useState} from "preact/hooks";
import LoadingScreen from "./LoadingScreen.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.d.ts";
import Order from "../interfaces/Order.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import Button from "../components/Button.tsx";

export function OrderStatusBadge({order, className} : {order: Order, className?: string}) {
    return (
        <>
            {order.complete &&
                <span class={`text-green-200 bg-green-900 rounded-md p-1 px-2 ml-2 text-sm align-middle h-fit ${className}`}>
                    <i class="fa-solid fa-check-circle mr-2"></i> Zrealizowane
                </span>
            }
            {order.moderated && !order.complete &&
                <span class={`text-gray bg-background-light rounded-md p-1 px-2 ml-2 text-sm align-middle h-fit ${className}`}>
                    <i class="fa-solid fa-clock mr-2"></i> W trakcie realizacji
                </span>
            }
            {!order.moderated && 
                <span class={`text-gray bg-background-light rounded-md p-1 px-2 ml-2 text-sm align-middle h-fit ${className}`}>
                    <i class="fa-solid fa-clock mr-2"></i> Czeka na sprawdzenie
                </span>
            }
        </>
    )
}

export default function OrderPage({order_id} : {order_id: number}) {
    const [loading, set_loading] = useState(true);
    const [order, set_order] = useState(null as unknown as Order)
    const [error, set_error] = useState("");

    useEffect(() => {
        const fetch_order = async () => {
            const response = await fetch(`/api/get_order?id=${order_id}`);

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

            set_order(data.order);
            set_loading(false);

            console.log(data);
        };

        fetch_order();
    }, [])

    return (
        <>
            <LoadingScreen msg={`Ładowanie zamówienia #${order_id}...`} is_loading={loading} />
            <div class="panel">
                <h1 class="my-2">Zamówienie <span class="text-gray">#{order_id}</span></h1>
                
                {error && <p class="text-red-200 bg-red-950 w-full rounded-md p-4 my-4"><i class="fa-solid fa-circle-exclamation mr-2"></i> Wystąpił błąd podczas ładowania zamówienia: {error}</p>}
            
                {order && (
                    <div>
                        {order.type == "media_mention" &&
                            <div class="flex flex-col gap-2">
                                <h2 class="my-2 text-center">Wzmianka medialna dla projektu {(order.data as OrderMediaMentionData).project_name}</h2>
                                
                                <p><b class="text-pink"><i class="fa-solid fa-check-circle w-6"></i>Status zamówienia:</b><OrderStatusBadge order={order}/></p>
                                <p><b class="text-pink"><i class="fa-solid fa-at w-6"></i>Email kontaktowy:</b> {order.contact_email}</p>
                                <p><b class="text-pink"><i class="fa-solid fa-heading w-6"></i>Nazwa projektu:</b> {(order.data as OrderMediaMentionData).project_name}</p>
                                <p class="text-justify"><b class="text-pink"><i class="fa-solid fa-file-lines w-6"></i>Opis projektu:</b> {(order.data as OrderMediaMentionData).project_desc}</p>
                                <p><b class="text-pink"><i class="fa-solid fa-link w-6"></i>Link do projektu (sociale):</b> <a href={(order.data as OrderMediaMentionData).project_link} target="_blank" rel="noopener noreferrer">{(order.data as OrderMediaMentionData).project_link}</a></p>
                                <p><b class="text-pink"><i class="fa-solid fa-link w-6"></i>Link do projektu na platformie ZwzT:</b> <a href={(order.data as OrderMediaMentionData).project_zt_link} target="_blank" rel="noopener noreferrer">{(order.data as OrderMediaMentionData).project_zt_link}</a></p>
                                <p><b class="text-pink">
                                    <i class="fa-solid fa-newspaper w-6"></i>Opublikowane artykuły:</b> &nbsp;
                                    {(order.data as OrderMediaMentionData).completed_urls.length || 0}<span class="text-gray">/{(order.data as OrderMediaMentionData).selected_sources.length}</span>
                                    &nbsp;
                                    <ul class="list-decimal list-inside">
                                        {(order.data as OrderMediaMentionData).completed_urls.map((url: string) => (
                                            <li><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                                        ))}
                                    </ul>
                                </p>
                            </div>
                        }
                    </div>
                )}

                <Button href="/orders" text="Pokaż wszystkie zamówienia" border icon_on_right fa_icon="arrow-right" className="my-4" full/>
            </div>
        </>
    )
}