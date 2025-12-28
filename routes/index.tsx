import TopNav from "../islands/TopNav.tsx";
import SplashScreen from "../islands/SplashScreen.tsx";
import LogoScroller from "../components/LogoScroller.tsx";

export default function Home() {
  return (
    <>
      <head>
        <title>ZTHype - Profesjonalna agencja blogowa</title>
      </head>
      <body>
        <SplashScreen />
        <TopNav />

        {/* Hero Section */}
        <div class="hero-section bg-background-dark px-4 py-16 -mt-16 flex flex-col justify-center min-h-[60vh] relative overflow-hidden">
          {/* Video Background */}
          <video
            autoplay
            loop
            muted
            playsinline
            class="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-50"
          >

            <source src="https://res.cloudinary.com/dof702udg/video/upload/v1766921750/5937356-hd_2048_1024_30fps_blmvsx.mp4" type="video/mp4" />
          </video>
          
          {/* Overlay for better text readability */}
          <div class="absolute top-0 left-0 w-full h-full bg-background-dark/60 z-10"></div>
          
          {/* Content */}
          <div class="max-w-4xl mx-auto text-center relative z-20">
            <div>
              <img
                src="/src/brand/white_logo_text_color_transparent.png"
                class="h-[9rem] max-md:h-[7rem] mx-auto object-contain mb-4"
                alt="ZTHype Logo"
              />
              <h1 class="text-3xl max-md:text-2xl font-thin mb-2">
                Profesjonalna agencja blogowa
              </h1>
              <h2 class="text-xl max-md:text-lg font-thin mb-4">
                Chętnie napiszemy o tobie. <a href="/media_mentions" class="hover:text-pink text-white font-normal">Zgłoś temat.</a>
              </h2>
            </div>
            
            <div class="mt-[7rem]">
              <LogoScroller />
            </div>

          </div>
        </div>
        <div class="px-4">
          <p class="text-xl max-md:text-lg text-gray max-w-2xl mx-auto text-justify mt-[5rem] mb-16">
            Mamy wieloletnie doświadczenie w tworzeniu wysokiej jakości treści o projektach społecznych. 
            Współpracujemy z wieloma renomowanymi blogami i stronami partnerskimi, które doceniają nasze 
            profesjonalne podejście do każdego projektu. Dzięki naszemu doświadczeniu i rozległej sieci 
            partnerów, pomagamy projektom społecznym zdobyć zasłużoną uwagę medialną.
          </p>

          <h2 class="text-2xl max-md:text-xl font-thin text-center mb-8">
            Napiszemy o Tobie.
          </h2>
          
          <div class="max-w-4xl mx-auto mb-16">
            <p class="text-xl max-md:text-lg text-gray max-w-2xl mx-auto text-justify mb-8">
              Aplikacja? Program? Projekt? Napiszemy o Tobie. 
              Może jesteś twórcą, który chce się wypromować? Niezależnie od tego, 
              czym się zajmujesz, jeśli Twój projekt ma wartość społeczną lub pomaga ludziom, 
              chętnie opowiemy o nim szerokiemu gronu odbiorców.
            </p>

          </div>
        </div>

        {/* Services Section */}
        <div class="px-4 py-16 bg-background-light/30">
          <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl max-md:text-2xl font-thin text-center mb-12">
              Co oferujemy?
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-background-dark/50 p-6 rounded-lg border border-background-light/50 hover:border-pink/50 duration-200">
                <div class="text-center mb-4">
                  <i class="fa-solid fa-newspaper text-4xl text-pink mb-4"></i>
                  <h3 class="text-xl font-thin mb-2">Wzmianki medialne</h3>
                </div>
                <p class="text-gray text-center">
                  Profesjonalne artykuły o Twoim projekcie na renomowanych blogach i stronach partnerskich. 
                  Dotrzyj do szerokiego grona odbiorców zainteresowanych projektami społecznymi.
                </p>
              </div>
              
              <div class="bg-background-dark/50 p-6 rounded-lg border border-background-light/50 hover:border-pink/50 duration-200">
                <div class="text-center mb-4">
                  <i class="fa-solid fa-pen-fancy text-4xl text-pink mb-4"></i>
                  <h3 class="text-xl font-thin mb-2">Wysokiej jakości treści</h3>
                </div>
                <p class="text-gray text-center">
                  Każdy artykuł jest starannie przygotowany przez doświadczonych copywriterów. 
                  Zapewniamy unikalne, wartościowe treści dopasowane do charakteru każdego projektu.
                </p>
              </div>
              
              <div class="bg-background-dark/50 p-6 rounded-lg border border-background-light/50 hover:border-pink/50 duration-200">
                <div class="text-center mb-4">
                  <i class="fa-solid fa-network-wired text-4xl text-pink mb-4"></i>
                  <h3 class="text-xl font-thin mb-2">Rozległa sieć partnerów</h3>
                </div>
                <p class="text-gray text-center">
                  Współpracujemy z wieloma renomowanymi blogami i stronami partnerskimi. 
                  Wybierz te, które najlepiej pasują do Twojego projektu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div class="px-4 py-16">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl max-md:text-2xl font-thin text-center mb-12">
              Dlaczego warto wybrać ZTHype?
            </h2>
            <div class="space-y-8">
              <div class="flex flex-col md:flex-row items-start gap-6">
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 rounded-full bg-pink/20 flex items-center justify-center">
                    <i class="fa-solid fa-check-circle text-2xl text-pink"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-thin mb-2">Wieloletnie doświadczenie</h3>
                  <p class="text-gray text-justify">
                    Od lat specjalizujemy się w tworzeniu treści o projektach społecznych. 
                    Znamy specyfikę branży i wiemy, jak skutecznie promować wartościowe inicjatywy.
                  </p>
                </div>
              </div>
              
              <div class="flex flex-col md:flex-row items-start gap-6">
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 rounded-full bg-pink/20 flex items-center justify-center">
                    <i class="fa-solid fa-users text-2xl text-pink"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-thin mb-2">Zrozumienie projektów społecznych</h3>
                  <p class="text-gray text-justify">
                    Nie jesteśmy zwykłą agencją marketingową. Rozumiemy misję i wartości 
                    projektów społecznych, co pozwala nam tworzyć autentyczne i angażujące treści.
                  </p>
                </div>
              </div>
              
              <div class="flex flex-col md:flex-row items-start gap-6">
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 rounded-full bg-pink/20 flex items-center justify-center">
                    <i class="fa-solid fa-rocket text-2xl text-pink"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-thin mb-2">Szybka realizacja</h3>
                  <p class="text-gray text-justify">
                    Dzięki zautomatyzowanym procesom i doświadczonemu zespołowi, 
                    Twoje zamówienie jest realizowane sprawnie i profesjonalnie.
                  </p>
                </div>
              </div>
              
              <div class="flex flex-col md:flex-row items-start gap-6">
                <div class="flex-shrink-0">
                  <div class="w-16 h-16 rounded-full bg-pink/20 flex items-center justify-center">
                    <i class="fa-solid fa-handshake text-2xl text-pink"></i>
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-thin mb-2">Indywidualne podejście</h3>
                  <p class="text-gray text-justify">
                    Każdy projekt traktujemy indywidualnie. Słuchamy Twoich potrzeb i 
                    dostosowujemy nasze usługi tak, aby najlepiej przedstawić Twój projekt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div class="px-4 py-16 bg-background-light/30">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-3xl max-md:text-2xl font-thin text-center mb-12">
              Jak to działa?
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-pink mx-auto mb-4 flex items-center justify-center text-2xl font-thin">
                  1
                </div>
                <h3 class="text-lg font-thin mb-2">Zgłoś temat</h3>
                <p class="text-gray text-sm">
                  Wypełnij formularz i opisz swój projekt. Podaj wszystkie istotne informacje, 
                  które pomogą nam stworzyć wartościowy artykuł.
                </p>
              </div>
              
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-pink mx-auto mb-4 flex items-center justify-center text-2xl font-thin">
                  2
                </div>
                <h3 class="text-lg font-thin mb-2">Wybierz blogi</h3>
                <p class="text-gray text-sm">
                  Wybierz blogi i strony partnerskie, na których chcesz, aby pojawił się 
                  artykuł o Twoim projekcie.
                </p>
              </div>
              
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-pink mx-auto mb-4 flex items-center justify-center text-2xl font-thin">
                  3
                </div>
                <h3 class="text-lg font-thin mb-2">Moderacja</h3>
                <p class="text-gray text-sm">
                  Nasz zespół sprawdza zgłoszenie i akceptuje zamówienie. 
                  W razie pytań skontaktujemy się z Tobą.
                </p>
              </div>
              
              <div class="text-center">
                <div class="w-20 h-20 rounded-full bg-pink mx-auto mb-4 flex items-center justify-center text-2xl font-thin">
                  4
                </div>
                <h3 class="text-lg font-thin mb-2">Publikacja</h3>
                <p class="text-gray text-sm">
                  Tworzymy i publikujemy profesjonalne artykuły na wybranych blogach. 
                  Otrzymujesz linki do wszystkich publikacji.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div class="px-4 py-16">
          <div class="max-w-3xl mx-auto text-center">
            <h2 class="text-3xl max-md:text-2xl font-thin mb-6">
              Gotowy na start?
            </h2>
            <p class="text-xl max-md:text-lg text-gray mb-8 max-w-2xl mx-auto">
              Nie czekaj dłużej. Zgłoś swój projekt już dziś i zdobądź profesjonalne 
              wzmianki medialne, które pomogą Ci dotrzeć do szerszego grona odbiorców.
            </p>
            <a 
              href="/media_mentions" 
              class="inline-block bg-pink/25 hover:bg-pink/80 text-white px-8 py-4 rounded-md text-lg duration-200 no-underline hover:no-underline"
            >
              Zgłoś temat teraz
            </a>
          </div>
        </div>

        {/* Additional Info Section */}
        <div class="px-4 py-16 bg-background-light/30">
          <div class="max-w-4xl mx-auto">
            <h2 class="text-2xl max-md:text-xl font-thin text-center mb-8">
              Dla kogo?
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-background-dark/50 p-6 rounded-lg">
                <h3 class="text-xl font-thin mb-3 flex items-center gap-3">
                  <i class="fa-solid fa-mobile-screen-button text-pink"></i>
                  Twórcy aplikacji
                </h3>
                <p class="text-gray text-justify">
                  Masz aplikację, która pomaga ludziom lub rozwiązuje problemy społeczne? 
                  Opowiemy o niej w sposób, który przyciągnie uwagę potencjalnych użytkowników.
                </p>
              </div>
              
              <div class="bg-background-dark/50 p-6 rounded-lg">
                <h3 class="text-xl font-thin mb-3 flex items-center gap-3">
                  <i class="fa-solid fa-laptop-code text-pink"></i>
                  Programiści i deweloperzy
                </h3>
                <p class="text-gray text-justify">
                  Stworzyłeś program lub narzędzie, które warto promować? 
                  Pomagamy technicznym projektom dotrzeć do odpowiedniej grupy odbiorców.
                </p>
              </div>
              
              <div class="bg-background-dark/50 p-6 rounded-lg">
                <h3 class="text-xl font-thin mb-3 flex items-center gap-3">
                  <i class="fa-solid fa-lightbulb text-pink"></i>
                  Inicjatywy społeczne
                </h3>
                <p class="text-gray text-justify">
                  Prowadzisz projekt społeczny, który zmienia świat na lepsze? 
                  Opowiemy o Twojej inicjatywie i pomożemy zdobyć zasłużoną uwagę.
                </p>
              </div>
              
              <div class="bg-background-dark/50 p-6 rounded-lg">
                <h3 class="text-xl font-thin mb-3 flex items-center gap-3">
                  <i class="fa-solid fa-user-tie text-pink"></i>
                  Twórcy i przedsiębiorcy
                </h3>
                <p class="text-gray text-justify">
                  Jesteś twórcą lub przedsiębiorcą, który chce się wypromować? 
                  Pomagamy wartościowym projektom zdobyć rozgłos w mediach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
