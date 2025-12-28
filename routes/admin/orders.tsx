import TopNav from "../../islands/TopNav.tsx";
import SplashScreen from "../../islands/SplashScreen.tsx";
import AdminOrdersPage from "../../islands/AdminOrdersPage.tsx";

export default function AdminOrders() {
  return (
    <>
      <head>
        <title>Panel Administracyjny - Zamówienia - ZTHype</title>
      </head>
      <body>
        <SplashScreen />
        <TopNav />
        <AdminOrdersPage />
      </body>
    </>
  );
}

