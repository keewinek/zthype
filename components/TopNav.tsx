import Button from "./Button.tsx";

export function TopNavLink({ href, text }: { href: string; text: string })
{
    return (
        <a href={href} class="text-white text-lg font-semibold hover:text-pink duration-200">
            {text}
        </a>
    )
}

export default function TopNav() {
    return (
        <>
            <div class="fixed top-0 left-0 flex justify-between items-center w-full px-4 bg-none border-background-light border-b-[1px] backdrop-blur-sm z-20 py-1">
                <div class="flex items-center max-md:w-full">
                    <a href="/" class="text-xl font-semibold text-white mr-6 my-1 max-md:mx-auto max-md:block">
                        <img src="/src/brand/white_logo_text_color_transparent.png" class="h-11 mr-1 inline-block align-middle object-contain mt-[-5px]" />
                    </a>

                    <span class="max-md:hidden">
                        <TopNavLink text="Wzmianki Medialne" href="/media_mentions"/>
                    </span>
                </div>
            </div>
            <div class="h-16"></div>
        </>
    )
}