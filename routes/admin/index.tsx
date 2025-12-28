import TopNav from "../../islands/TopNav.tsx";
import SplashScreen from "../../islands/SplashScreen.tsx";
import AdminIndexPage from "../../islands/AdminIndexPage.tsx";

export default function AdminIndex() {
  return (
    <>
      <head>
        <title>Panel Administracyjny - ZTHype</title>
      </head>
      <body>
        <SplashScreen />
        <TopNav />
        <AdminIndexPage />
      </body>
    </>
  );
}

