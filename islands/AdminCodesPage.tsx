import { useEffect, useState } from "preact/hooks";
import Button from "../components/Button.tsx";

interface AccessCode {
    code: string;
    created_at: number;
}

export default function AdminCodesPage() {
    const [admin_password, set_admin_password] = useState<string | null>(null);
    const [password_input, set_password_input] = useState<string>("");
    const [login_loading, set_login_loading] = useState<boolean>(false);
    const [login_error, set_login_error] = useState<string>("");
    const [codes, set_codes] = useState<AccessCode[]>([]);
    const [loading, set_loading] = useState<boolean>(true);
    const [error, set_error] = useState<string>("");
    const [creating, set_creating] = useState<boolean>(false);
    const [copied_code, set_copied_code] = useState<string | null>(null);

    useEffect(() => {
        const stored_password = localStorage.getItem("admin");
        set_admin_password(stored_password);
        
        if (stored_password) {
            fetch_codes(stored_password);
        } else {
            set_loading(false);
        }
    }, []);

    async function fetch_codes(password: string) {
        set_loading(true);
        try {
            const response = await fetch(`/api/admin_list_codes?admin_password=${encodeURIComponent(password)}`);
            const data = await response.json();
            
            if (data.success) {
                set_codes(data.codes || []);
                set_error("");
                return true;
            } else {
                set_error(data.error || "Błąd podczas pobierania kodów");
                return false;
            }
        } catch (e) {
            set_error("Błąd połączenia z serwerem");
            return false;
        } finally {
            set_loading(false);
        }
    }

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
                set_codes(data.codes || []);
                set_error("");
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
        set_codes([]);
        set_error("");
    }

    async function create_code() {
        if (!admin_password) return;
        
        set_creating(true);
        try {
            const response = await fetch(`/api/admin_create_code?admin_password=${encodeURIComponent(admin_password)}`);
            const data = await response.json();
            
            if (data.success) {
                await fetch_codes(admin_password);
            } else {
                set_error(data.error || "Błąd podczas tworzenia kodu");
            }
        } catch (e) {
            set_error("Błąd połączenia z serwerem");
        }
        set_creating(false);
    }

    async function delete_code(code: string) {
        if (!admin_password) return;
        
        try {
            const response = await fetch(`/api/admin_remove_code?admin_password=${encodeURIComponent(admin_password)}&code=${encodeURIComponent(code)}`);
            const data = await response.json();
            
            if (data.success) {
                await fetch_codes(admin_password);
            } else {
                set_error(data.error || "Błąd podczas usuwania kodu");
            }
        } catch (e) {
            set_error("Błąd połączenia z serwerem");
        }
    }

    function copy_to_clipboard(code: string) {
        navigator.clipboard.writeText(code);
        set_copied_code(code);
        setTimeout(() => set_copied_code(null), 2000);
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

    // No admin password set - show login form
    if (!admin_password && !loading) {
        return (
            <div class="panel">
                <h1 class="my-4">
                    <i class="fa-solid fa-lock mr-3 text-pink"></i>
                    Logowanie <span class="text-pink">administratora</span>
                </h1>
                <p class="text-gray text-justify mb-6">
                    Wprowadź hasło administratora, aby uzyskać dostęp do panelu zarządzania kodami dostępu.
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

    return (
        <div class="panel">
            <div class="flex items-center justify-between mb-4">
                <h1 class="my-4">
                    <i class="fa-solid fa-key mr-3 text-pink"></i>
                    Kody <span class="text-pink">dostępu</span>
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
                Zarządzaj kodami dostępu dla zamawiania wzmianek medialnych. Każdy kod może być użyty tylko raz.
            </p>

            {error && (
                <p class="text-sm text-red-300 my-4">
                    <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                    {error}
                </p>
            )}

            <div class="mb-6">
                {creating ? (
                    <Button 
                        text="Generowanie..." 
                        fa_icon="spinner" 
                        iconClassName="animate-spin"
                        border 
                        disabled
                    />
                ) : (
                    <Button 
                        text="Wygeneruj nowy kod" 
                        fa_icon="plus" 
                        onClick={create_code}
                        border
                    />
                )}
            </div>

            {loading ? (
                <div class="text-center py-8">
                    <i class="fa-solid fa-spinner animate-spin text-3xl text-pink"></i>
                    <p class="text-gray mt-2">Ładowanie kodów...</p>
                </div>
            ) : codes.length === 0 ? (
                <div class="text-center py-8 bg-background-light rounded-lg">
                    <i class="fa-solid fa-box-open text-4xl text-gray mb-4"></i>
                    <p class="text-gray">Brak aktywnych kodów dostępu</p>
                </div>
            ) : (
                <div class="space-y-3">
                    {codes.map(code => (
                        <div 
                            key={code.code} 
                            class="flex flex-wrap items-center justify-between bg-background-light p-4 rounded-lg gap-3"
                        >
                            <div class="flex items-center gap-4">
                                <code class="text-xl font-mono font-bold text-white tracking-wider">
                                    {code.code}
                                </code>
                                <button 
                                    onClick={() => copy_to_clipboard(code.code)}
                                    class="text-gray hover:text-pink duration-200 cursor-pointer"
                                    title="Kopiuj do schowka"
                                >
                                    {copied_code === code.code ? (
                                        <i class="fa-solid fa-check text-green-400"></i>
                                    ) : (
                                        <i class="fa-solid fa-copy"></i>
                                    )}
                                </button>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-gray text-sm">
                                    <i class="fa-solid fa-clock mr-1"></i>
                                    {format_date(code.created_at)}
                                </span>
                                <button 
                                    onClick={() => delete_code(code.code)}
                                    class="text-red-400 hover:text-red-300 duration-200 cursor-pointer"
                                    title="Usuń kod"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p class="text-gray text-xs mt-6">
                <i class="fa-solid fa-info-circle mr-1"></i>
                Łącznie aktywnych kodów: {codes.length}
            </p>
        </div>
    );
}

