import { useEffect, useState } from "preact/hooks";
import Button from "../components/Button.tsx";

export default function AdminIndexPage() {
    const [admin_password, set_admin_password] = useState<string | null>(null);
    const [password_input, set_password_input] = useState<string>("");
    const [login_loading, set_login_loading] = useState<boolean>(false);
    const [login_error, set_login_error] = useState<string>("");

    useEffect(() => {
        const stored_password = localStorage.getItem("admin");
        set_admin_password(stored_password);
    }, []);

    async function handle_login() {
        if (!password_input.trim()) {
            set_login_error("Proszę wprowadzić hasło");
            return;
        }

        set_login_loading(true);
        set_login_error("");

        try {
            const response = await fetch(`/api/admin_list_codes?admin_password=${encodeURIComponent(password_input)}`);
            const data = await response.json();
            
            if (data.success) {
                // Password is valid, store it in localStorage
                localStorage.setItem("admin", password_input);
                set_admin_password(password_input);
            } else {
                set_login_error(data.error || "Nieprawidłowe hasło administratora");
            }
        } catch (e) {
            set_login_error("Błąd połączenia z serwerem");
        } finally {
            set_login_loading(false);
        }
    }

    function handle_logout() {
        localStorage.removeItem("admin");
        set_admin_password(null);
        set_password_input("");
    }

    // No admin password set - show login form
    if (!admin_password) {
        return (
            <div class="panel">
                <h1 class="my-4">
                    <i class="fa-solid fa-lock mr-3 text-pink"></i>
                    Logowanie <span class="text-pink">administratora</span>
                </h1>
                <p class="text-gray text-justify mb-6">
                    Wprowadź hasło administratora, aby uzyskać dostęp do panelu administracyjnego.
                </p>

                {login_error && (
                    <div class="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                        <p class="text-sm text-red-300">
                            <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                            {login_error}
                        </p>
                    </div>
                )}

                <div class="space-y-4">
                    <div>
                        <label for="admin-password" class="block text-gray mb-2">
                            <i class="fa-solid fa-key mr-2"></i>
                            Hasło administratora
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password_input}
                            onInput={(e) => set_password_input((e.target as HTMLInputElement).value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !login_loading) {
                                    handle_login();
                                }
                            }}
                            placeholder="Wprowadź hasło..."
                            class="w-full bg-background-light border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:border-pink focus:ring-1 focus:ring-pink"
                            disabled={login_loading}
                        />
                    </div>

                    <Button
                        text={login_loading ? "Logowanie..." : "Zaloguj się"}
                        fa_icon={login_loading ? "spinner" : "sign-in-alt"}
                        iconClassName={login_loading ? "animate-spin" : ""}
                        onClick={handle_login}
                        disabled={login_loading}
                        full
                    />
                </div>
            </div>
        );
    }

    // Admin is logged in - show admin panel with links
    return (
        <div class="panel">
            <div class="flex items-center justify-between mb-4">
                <h1 class="my-4">
                    <i class="fa-solid fa-shield-halved mr-3 text-pink"></i>
                    Panel <span class="text-pink">administracyjny</span>
                </h1>
                <button
                    onClick={handle_logout}
                    class="text-gray hover:text-red-400 duration-200 cursor-pointer text-sm"
                    title="Wyloguj się"
                >
                    <i class="fa-solid fa-sign-out-alt mr-2"></i>
                    Wyloguj
                </button>
            </div>
            <p class="text-gray text-justify mb-6">
                Zarządzaj zamówieniami i kodami dostępu do systemu.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <a
                    href="/admin/orders"
                    class="bg-background-light p-6 rounded-lg hover:bg-background-light/80 duration-200 border border-transparent hover:border-pink/50 group"
                >
                    <div class="flex items-center gap-4 mb-3">
                        <div class="bg-pink/20 p-3 rounded-lg group-hover:bg-pink/30 duration-200">
                            <i class="fa-solid fa-list text-2xl text-pink"></i>
                        </div>
                        <h2 class="text-xl font-bold text-white group-hover:text-pink duration-200">
                            Zamówienia
                        </h2>
                    </div>
                    <p class="text-gray text-sm">
                        Przeglądaj i zarządzaj wszystkimi zamówieniami w systemie.
                    </p>
                </a>

                <a
                    href="/admin/codes"
                    class="bg-background-light p-6 rounded-lg hover:bg-background-light/80 duration-200 border border-transparent hover:border-pink/50 group"
                >
                    <div class="flex items-center gap-4 mb-3">
                        <div class="bg-pink/20 p-3 rounded-lg group-hover:bg-pink/30 duration-200">
                            <i class="fa-solid fa-key text-2xl text-pink"></i>
                        </div>
                        <h2 class="text-xl font-bold text-white group-hover:text-pink duration-200">
                            Kody dostępu
                        </h2>
                    </div>
                    <p class="text-gray text-sm">
                        Generuj i zarządzaj kodami dostępu do zamawiania wzmianek medialnych.
                    </p>
                </a>
            </div>
        </div>
    );
}

