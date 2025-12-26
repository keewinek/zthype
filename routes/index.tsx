import HomeServiceButton from "../components/HomeServiceButton.tsx";
import TopNav from "../islands/TopNav.tsx";
import SplashScreen from "../islands/SplashScreen.tsx";

export default function Home() {
  return (
    <>
      <head>
        <title>ZTHype - ZwzT made easy.</title>
      </head>
      <body>
        <SplashScreen />
        <TopNav />

        <div class="w-full bg-background-dark p-2 mt-[-5px] mb-8">
          <img
            src="/src/brand/white_logo_text_color_transparent.png"
            class="h-24 max-md:h-16 my-8 mb-2 mx-auto object-contain"
          />
          <h2 class="text-xl font-normal text-center text-gray mb-6">
            ZwzT made easy.
          </h2>
        </div>

        <div class="panel">
          <h2 class="mb-4">Nasze usługi:</h2>
          <HomeServiceButton
            title="Zdobądź wzmianki medialne."
            description="W prosty, szybki sposób ogarniemy ci wiele wzmianek medialnych o twoim projekcie Zwolnionych z Teorii."
            fa_icon="newspaper"
            href="/media_mentions"
          />
          <HomeServiceButton
            title="Znajdź partnerów do projektu."
            description="Przejrzyj listę zaufanych partnerów, którzy udzielili partnerstwa innym projektom, także z zeszłych lat."
            fa_icon="handshake"
            href="/partner_board"
            disabled
          />
          <HomeServiceButton
            title="Wypromuj waszą stronę internetową."
            description="Jeśli posiadacie stronę internetową, skorzystajcie z tej usługi. Zdobądźcie prawdziwe wejścia na stronę internetową twojego porjektu Zwolnionych z Teorii."
            fa_icon="eye"
            href="/website_views"
            disabled
          />
        </div>
      </body>
    </>
  );
}
