import { useEffect, useState } from "preact/hooks";
import LoadingScreen from "./LoadingScreen.tsx";

// create a loading screen for just 200ms
export default function SplashScreen() {
    const [loading, setLoading] = useState<boolean>(true);
    setTimeout(() => { setLoading(false); console.log("Loading screen finished") }, 200);
    useEffect(() => { 
        setTimeout(() => { setLoading(false); console.log("Loading screen finished from effect") }, 200);
     }, []);

    return (
        <LoadingScreen msg="" is_loading={loading}/>
    )
}