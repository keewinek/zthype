import { Signal, useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function LoadingScreen({msg, is_loading}: {msg: string, is_loading: boolean}) {
    console.log("Loading screen loaded...");

    const [show, set_show] = useState<boolean>(true);
    const [animate_out, set_animate_out] = useState<boolean>(false);
    const [animate_in, set_animate_in] = useState<boolean>(false);
    const [has_been_hidden, set_has_been_hidden] = useState<boolean>(false);

    useEffect(() => {
        globalThis.addEventListener("beforeunload", () => {set_animate_in(true); set_animate_out(false); set_show(true);});

        if (!is_loading && !has_been_hidden) {
            console.log("Hiding loading screen...");
            set_animate_out(true);
            set_has_been_hidden(true);
            setTimeout(() => set_show(false), 500);
        }
    }, [set_animate_in, set_animate_out, set_show, is_loading]);

    if (!show) return (<></>);

    return (
        <div id="loading-screen" class={`h-full w-full top-0 left-0 fixed bg-background z-40 ${animate_out ? "animate-fade-out" : ""} ${animate_in ? "animate-fade-in-fast" : ""}`}>
            <div className="fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] items-center w-fit h-fit text-center">
                <img  src={`/src/brand/white_logo_pink.png?cache_buster=${Date.now()}`} alt="Ładowanie..." class="h-32 mx-auto block text-center animate-pulse object-contain"></img>
                <p class="text-xs mt-2 text-center text-gray opacity-10">{msg}</p>
            </div>
        </div>
    )
}