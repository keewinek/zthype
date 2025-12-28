import { useEffect, useState } from "preact/hooks";
import Button from "../components/Button.tsx";
import Order from "../interfaces/Order.ts";
import { OrderStatusBadge } from "./OrderPage.tsx";

interface PaginationInfo {
    page: number;
    limit: number;
    total_orders: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
}

export default function AdminOrdersPage() {
    const [admin_password, set_admin_password] = useState<string | null>(null);
    const [orders, set_orders] = useState<Order[]>([]);
    const [loading, set_loading] = useState<boolean>(true);
    const [error, set_error] = useState<string>("");
    const [current_page, set_current_page] = useState<number>(1);
    const [pagination, set_pagination] = useState<PaginationInfo | null>(null);

    useEffect(() => {
        const stored_password = localStorage.getItem("admin");
        set_admin_password(stored_password);
        
        if (stored_password) {
            fetch_orders(stored_password, current_page);
        } else {
            set_loading(false);
        }
    }, []);

    useEffect(() => {
        if (admin_password) {
            fetch_orders(admin_password, current_page);
        }
    }, [current_page]);

    async function fetch_orders(password: string, page: number) {
        set_loading(true);
        try {
            const response = await fetch(`/api/admin_list_orders?admin_password=${encodeURIComponent(password)}&page=${page}&limit=100`);
            const data = await response.json();
            
            if (data.success) {
                set_orders(data.orders || []);
                set_pagination(data.pagination || null);
                set_error("");
            } else {
                set_error(data.error || "Błąd podczas pobierania zamówień");
            }
        } catch (e) {
            set_error("Błąd połączenia z serwerem");
        }
        set_loading(false);
    }

    function format_date(timestamp: number) {
        return new Date(timestamp).toLocaleString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function get_order_type_label(type: string): string {
        switch (type) {
            case "media_mention":
                return "Wzmianka medialna";
            default:
                return type;
        }
    }

    // No admin password set
    if (!admin_password && !loading) {
        return (
            <div class="panel">
                <h1 class="my-4 text-red-400">
                    <i class="fa-solid fa-lock mr-3"></i>
                    Brak dostępu
                </h1>
                <p class="text-gray text-justify">
                    Nie masz ustawionego hasła administratora w localStorage. 
                    Aby uzyskać dostęp do tej strony, ustaw wartość <code class="bg-background-light px-2 py-1 rounded">admin</code> w localStorage przeglądarki.
                </p>
                <p class="text-gray text-sm mt-4">
                    Otwórz konsolę deweloperską (F12) i wpisz:
                </p>
                <pre class="bg-background-light p-4 rounded mt-2 text-sm overflow-x-auto">
                    <code>localStorage.setItem("admin", "TWOJE_HASLO")</code>
                </pre>
            </div>
        );
    }

    return (
        <div class="panel">
            <h1 class="my-4">
                <i class="fa-solid fa-list mr-3 text-pink"></i>
                Zamówienia <span class="text-pink">administracyjne</span>
            </h1>
            <p class="text-gray text-justify mb-6">
                Przeglądaj wszystkie zamówienia. Zamówienia są sortowane według statusu: najpierw czekające na zatwierdzenie, potem w trakcie realizacji, a następnie zrealizowane.
            </p>

            {error && (
                <p class="text-sm text-red-300 my-4">
                    <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                    {error}
                </p>
            )}

            {loading ? (
                <div class="text-center py-8">
                    <i class="fa-solid fa-spinner animate-spin text-3xl text-pink"></i>
                    <p class="text-gray mt-2">Ładowanie zamówień...</p>
                </div>
            ) : orders.length === 0 ? (
                <div class="text-center py-8 bg-background-light rounded-lg">
                    <i class="fa-solid fa-box-open text-4xl text-gray mb-4"></i>
                    <p class="text-gray">Brak zamówień</p>
                </div>
            ) : (
                <>
                    <div class="space-y-3 mb-6">
                        {orders.map(order => (
                            <div 
                                key={order.id} 
                                class="bg-background-light p-4 rounded-lg hover:bg-background-light/80 duration-200"
                            >
                                <div class="flex flex-wrap items-start justify-between gap-4">
                                    <div class="flex-1 min-w-0">
                                        <div class="flex items-center gap-3 mb-2">
                                            <a 
                                                href={`/orders/${order.id}`}
                                                class="text-xl font-bold text-white hover:text-pink duration-200"
                                            >
                                                Zamówienie #{order.id}
                                            </a>
                                            <OrderStatusBadge order={order} />
                                        </div>
                                        <div class="space-y-1 text-sm">
                                            <p class="text-gray">
                                                <i class="fa-solid fa-envelope mr-2"></i>
                                                {order.contact_email}
                                            </p>
                                            <p class="text-gray">
                                                <i class="fa-solid fa-tag mr-2"></i>
                                                {get_order_type_label(order.type)}
                                            </p>
                                            <p class="text-gray">
                                                <i class="fa-solid fa-clock mr-2"></i>
                                                Utworzono: {format_date(order.created_at)}
                                            </p>
                                            {order.updated_at !== order.created_at && (
                                                <p class="text-gray">
                                                    <i class="fa-solid fa-pencil mr-2"></i>
                                                    Zaktualizowano: {format_date(order.updated_at)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <a 
                                            href={`/orders/${order.id}`}
                                            class="text-pink hover:text-pink/80 duration-200"
                                            title="Zobacz szczegóły"
                                        >
                                            <i class="fa-solid fa-arrow-right text-xl"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination && pagination.total_pages > 1 && (
                        <div class="flex flex-wrap items-center justify-center gap-3 mt-6 pt-6 border-t border-background-light">
                            <button
                                onClick={() => set_current_page(prev => Math.max(1, prev - 1))}
                                disabled={!pagination.has_prev}
                                class={`px-4 py-2 rounded-md duration-200 ${
                                    pagination.has_prev
                                        ? "bg-background-light hover:bg-background-light/80 text-white cursor-pointer"
                                        : "bg-background-light/50 text-gray cursor-not-allowed"
                                }`}
                            >
                                <i class="fa-solid fa-chevron-left mr-2"></i>
                                Poprzednia
                            </button>
                            
                            <div class="flex items-center gap-2">
                                <span class="text-gray text-sm">
                                    Strona <span class="text-white font-bold">{pagination.page}</span> z <span class="text-white font-bold">{pagination.total_pages}</span>
                                </span>
                            </div>

                            <button
                                onClick={() => set_current_page(prev => Math.min(pagination.total_pages, prev + 1))}
                                disabled={!pagination.has_next}
                                class={`px-4 py-2 rounded-md duration-200 ${
                                    pagination.has_next
                                        ? "bg-background-light hover:bg-background-light/80 text-white cursor-pointer"
                                        : "bg-background-light/50 text-gray cursor-not-allowed"
                                }`}
                            >
                                Następna
                                <i class="fa-solid fa-chevron-right ml-2"></i>
                            </button>
                        </div>
                    )}

                    {pagination && (
                        <p class="text-gray text-xs mt-6 text-center">
                            <i class="fa-solid fa-info-circle mr-1"></i>
                            Wyświetlono {orders.length} z {pagination.total_orders} zamówień
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

