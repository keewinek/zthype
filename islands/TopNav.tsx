import Button from "../components/Button.tsx";
import { get_saved_orders } from "../utils/saved_orders.ts";

export function TopNavLink({ href, text, fa_icon, toast }: { href: string; text: string, fa_icon?: string, toast?: string })
{
    return (
        <a href={href} class="text-white text-lg font-semibold hover:text-pink duration-200 hover:no-underline">
            {fa_icon && <i class={`fa-solid fa-${fa_icon} mr-2`}></i>}
            {text}
            {toast && toast != "" && <span class="ml-1  text-gray bg-background-light rounded-full px-2 text-sm">{toast}</span>}
        </a>
    )
}

export default function TopNav() {
    const saved_orders = get_saved_orders();

    return (
        <>
            <div class="fixed top-0 left-0 flex justify-between items-center w-full px-4 py-2 bg-none border-background-light border-b-[1px] backdrop-blur-sm z-50">
                <div class="flex items-center">
                    <a href="/" class="text-xl font-semibold text-white mr-6 my-1k">
                        <img src="/src/brand/white_logo_text_color_transparent.png" class="h-11 mr-1 inline-block align-middle object-contain mt-[-5px]" />
                    </a>

                    <span class="max-md:hidden">
                        <TopNavLink text="Wzmianki Medialne" href="/media_mentions"/>
                    </span>
                </div>
                <div class="flex items-center ">
                    <TopNavLink text="Twoje zamówienia" href="/orders" fa_icon="truck-fast" toast={saved_orders.length > 0 ? saved_orders.length.toString() : ""}/>
                </div>
            </div>
            <div class="h-16"></div>
        </>
    )
}