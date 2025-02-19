export default function HomeServiceButton(
    {title, description, fa_icon, href, disabled=false} :
    {title: string, description: string, fa_icon: string, href: string, disabled?: boolean}
)
{
    return (
        <a href={disabled ? "" : href} class={`border-[1px] border-background-light flex  p-4 rounded-md my-2 duration-200  ${disabled ? "opacity-50 cursor-not-allowed" : "group hover:bg-background-light"}`}>
            <div class="flex-row p-2 mr-4">
                <i class={`fa-solid fa-${fa_icon} text-5xl w-16 group-hover:text-pink`}></i>
            </div>
            <div class="flex-row">
                <h2 class="mb-1 duration-200 group-hover:text-pink ">{title}</h2>
                <p class="text-gray  duration-200 group-hover:text-white">{description}</p>
            </div>
        </a>
    );
}