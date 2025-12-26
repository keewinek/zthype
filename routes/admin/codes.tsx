import TopNav from "../../islands/TopNav.tsx";
import SplashScreen from "../../islands/SplashScreen.tsx";
import BottomFooter from "../../components/BottomFooter.tsx";
import AdminCodesPage from "../../islands/AdminCodesPage.tsx";

export default function AdminCodes() {
    return (
        <>
            <head>
                <title>Panel Administracyjny - Kody Dostępu - ZTHype</title>
            </head>
            <body>
                <SplashScreen/>
                <TopNav/>
                <AdminCodesPage/>
                <BottomFooter/>
            </body>
        </>
    );
}

