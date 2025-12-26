import {useEffect, useState} from "preact/hooks";
import LoadingScreen from "./LoadingScreen.tsx";
import { useSignal } from "https://esm.sh/v135/@preact/signals@1.2.2/X-ZS8q/dist/signals.d.ts";
import Order from "../interfaces/Order.ts";
import OrderMediaMentionData from "../interfaces/MediaMentionData.ts";
import Button from "../components/Button.tsx";

export function OrderStatusBadge({order, className} : {order: Order, className?: string}) {
    return (
        <>
            {order.complete && !order.rejected &&
                <span class={`text-green-200 bg-green-900 rounded-md p-1 px-2 ml-2 text-sm align-middle h-fit ${className}`}>
                    <i class="fa-solid fa-check-circle mr-2"></i> Zrealizowane
                </span>
            }
            {order.moderated && !order.complete && !order.rejected &&
                <span class={`text-gray bg-background-light rounded-md p-1 px-2 ml-2 text-sm align-middle h-fit ${className}`}>
                    <i class="fa-solid fa-clock mr-2"></i> W trakcie realizacji - Wróć jutro
                </span>
            }
            {!order.moderated  && !order.rejected && 
                <span class={`text-gray bg-background-light rounded-md p-1 px-2 ml-2 text-sm align-middle h-fit ${className}`}>
                    <i class="fa-solid fa-clock mr-2"></i> Czeka na sprawdzenie - Wróć jutro
                </span>
            }
            {order.rejected &&
                <span class={`text-red-200 bg-red-900 rounded-md p-1 px-2 ml-2 text-sm align-middle h-fit ${className}`}>
                    <i class="fa-solid fa-xmark-circle mr-2"></i> Odrzucone
                </span>
            }
        </>
    )
}

export default function OrderPage({order_id} : {order_id: number}) {
    const [loading, set_loading] = useState(true);
    const [order, set_order] = useState(null as unknown as Order)
    const [error, set_error] = useState("");

    const [admin_accept_error, set_admin_accept_error] = useState("");
    const [admin_reject_error, set_admin_reject_error] = useState("");

    const admin_password = localStorage.getItem("admin") || "";

    function admin_accept_order() {
        set_admin_accept_error("");

        if (admin_password.length == 0) {
            set_admin_accept_error("Podaj hasło administratora.");
            return;
        }

        if (order.moderated) {
            set_admin_accept_error("Zamówienie zostało już zaakceptowane przez administratora.");
            return;
        }

        fetch(`/api/admin_accept_order?order_id=${order_id}&admin_password=${admin_password}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data);
                set_order(data.order);
            }
            else {
                set_admin_accept_error(data.error);
            }
        }).catch((error) => {
            set_admin_accept_error(error);
        });
    }

    function admin_reject_order() {
        set_admin_reject_error("");

        const reject_reason = (document.getElementById("reject_reason") as HTMLTextAreaElement).value;

        if (admin_password.length == 0) {
            set_admin_reject_error("Podaj hasło administratora.");
            return;
        }

        if (order.rejected) {
            set_admin_reject_error("Zamówienie zostało już odrzucone przez administratora.");
            return;
        }

        if (reject_reason.length <= 0) {
            set_admin_reject_error("Podaj powód odrzucenia zamówienia.");
            return;
        }

        fetch(`/api/admin_reject_order?order_id=${order_id}&admin_password=${admin_password}&reject_reason=${reject_reason}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data);
                set_order(data.order);
            }
            else {
                set_admin_reject_error(data.error);
            }
        }).catch((error) => {
            set_admin_reject_error(error);
        });
    }

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
                    <>
                        {order.rejected &&
                            <div class="bg-red-950 text-red-200 p-4 my-4 rounded-md">
                                <h2>To zamówienie zostało odrzucone przez administratora ZTHype</h2>
                                <p class="text-justify">Powód odrzucenia: <b>{order.reject_reason}</b></p>
                                <p class="text-justify">Jeśli uważasz, że odrzucenie jest błędne, skontaktuj się z administratorem ZTHype, lub spróbuj złożyć zamówienie jeszce raz.</p>
                            </div>
                        }
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
                                            <li class="break-all"><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                                        ))}
                                    </ul>
                                </p>
                            </div>
                        }

                        {admin_password != "" && (
                            <div class="p-4 bg-background-light my-4 rounded-md">
                                <h2 class="text-center">Panel administratora</h2>

                                {admin_accept_error && <p class="text-red-200 bg-red-950 w-full rounded-md p-4 my-4"><i class="fa-solid fa-circle-exclamation mr-2"></i> {admin_accept_error}</p>}

                                <Button text="Zaakceptuj zamówienie" onClick={admin_accept_order} fa_icon="check" className="my-4" full/>

                                <h2 class="text-center">Odrzuć zlecenie</h2>
                                <div class="form-group">
                                    <label for="reject_reason">Powód odrzucenia</label>
                                    <textarea type="text" id="reject_reason" name="reject_reason" class="input w-full bg-background-light" placeholder="Wpisz tu powód odrzucenia przez ciebie zamówienia..."/>
                                </div>

                                {admin_reject_error && <p class="text-red-200 bg-red-950 w-full rounded-md p-4 my-4"><i class="fa-solid fa-circle-exclamation mr-2"></i> {admin_reject_error}</p>}

                                <Button text="Odrzuć zamówienie" onClick={admin_reject_order} fa_icon="ban" className="my-4" border full/>
                            </div>
                        )}

                        <h2 class="my-2">Masz jakiś problem?</h2>
                        <p class="text-justify mb-2">Jeśli masz jakiś problem z zamówieniem, napisz do nas na instagramie <a href="https://instagram.com/zt.hype" target="_blank">@zt.hype</a>.</p>
                    </>
                )}

                <Button href="/orders" text="Pokaż wszystkie zamówienia" border icon_on_right fa_icon="arrow-right" className="my-4" full/>
            </div>
        </>
    )
}