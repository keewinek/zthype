import { useEffect, useState } from "preact/hooks";
import LoadingScreen from "./LoadingScreen.tsx";

// create a loading screen for just 200ms
export default function SplashScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    setTimeout(() => { setLoading(false); }, 200);
    useEffect(() => { 
        setInterval(() => { setLoading(false); }, 200);
     }, []);

    return (
        <LoadingScreen msg="" is_loading={loading}/>
    )
}