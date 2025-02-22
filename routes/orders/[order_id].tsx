import { PageProps } from "$fresh/server.ts";
import TopNav from "../../islands/TopNav.tsx";
import OrderPage from "../../islands/OrderPage.tsx";

export default function OrderPageWrapper(props: PageProps) {
    return (
        <>
            <head>
                <title>Zamówienie #{props.params.order_id}</title>
            </head>
            <body>
                <TopNav/>
                <OrderPage order_id={parseInt(props.params.order_id)}/>
            </body>
        </>
    );
}