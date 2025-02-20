interface ButtonProps {
    onClick?: () => void;
    className?: string;
    iconClassName?: string;
    href?: string;
    target?: string;
    disabled?: boolean;
    border?: boolean;
    gray?: boolean;
    fa_icon?: string;
    text?:string;
    full?:boolean;
    icon_on_right?:boolean;
}

export default function Button(
    { onClick, className="", href, target="", disabled=false, border=false, gray=false, fa_icon, text="", full=false, icon_on_right=false, iconClassName=""}: ButtonProps
) {
    let button_final_class = "";

    if (border) {
        button_final_class += "border-pink border-[1px] ";
    } else if (gray) {
        button_final_class += "bg-pink ";
    } else {
        button_final_class += "bg-pink ";
    }

    button_final_class += "text-pink-50 p-2 inline-flex items-center rounded-md text-center hover:no-underline duration-200 "

    if (disabled) {
        button_final_class += "opacity-50 cursor-not-allowed ";
    } else {
        button_final_class += "cursor-pointer ";
        if (border) {
            button_final_class += "hover:bg-pink ";
        } else if (gray) {
            button_final_class += "hover:bg-pink ";
        } else {
            button_final_class += "hover:bg-pink-dark ";
        }
    }

    if (full) {
        button_final_class += "w-full justify-center ";
    }

    return (
        <a
            href={href}
            target={target}
            onClick={onClick}
            disabled={disabled}
            class={`${button_final_class} ${className}`}
        >
            {fa_icon && !icon_on_right && <i class={`fa-solid fa-${fa_icon} mr-2 ${iconClassName}`}></i>}
            <span class={`flex-grow`}>{text}</span>
            {fa_icon && icon_on_right && <i class={`fa-solid fa-${fa_icon} mr-2`}></i>}
        </a>
    
    )
}