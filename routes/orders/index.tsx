import TopNav from "../../islands/TopNav.tsx";
import MyOrdersPage from "../../islands/MyOrdersPage.tsx";
import BottomFooter from "../../components/BottomFooter.tsx";

export default function MyOrdersPageWrapper() {
    return (
        <>
            <head>
                <title>Twoje Zamówienia</title>
            </head>
            <body>
                <TopNav/>
                <MyOrdersPage/>
                <BottomFooter/>
            </body>
        </>
    );
}