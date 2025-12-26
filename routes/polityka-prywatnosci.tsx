import { Head } from "$fresh/runtime.ts";
import TopNav from "../islands/TopNav.tsx";

export default function PolitykaPrywatnosci() {
  return (
    <>
      <Head>
        <title>Polityka prywatności - ZTHype</title>
      </Head>

      <TopNav />

      <div class="panel">
        <h1 class="my-2">Polityka prywatności</h1>
        <p class="text-gray text-xs mb-6">Obowiązuje od: 26.12.2025</p>

        <h2 class="mt-6 mb-2">1. Informacje ogólne</h2>
        <p class="text-justify text-gray">
          Niniejsza polityka prywatności opisuje zasady przetwarzania danych w
          serwisie ZTHype (dalej: „Serwis”), w tym dane przekazywane podczas
          składania Zamówień oraz dane zapisywane lokalnie w przeglądarce.
        </p>

        <h2 class="mt-6 mb-2">2. Jakie dane przetwarzamy</h2>
        <p class="text-justify text-gray">
          W zależności od sposobu korzystania z Serwisu, możemy przetwarzać:
        </p>
        <ul class="list-disc list-inside text-gray">
          <li>
            <b>Dane kontaktowe</b>{" "}
            – adres e-mail podany w formularzu zamówienia.
          </li>
          <li>
            <b>Dane projektu</b>{" "}
            – nazwa projektu, opis, link do social mediów/strony, link do
            projektu na platformie Zwolnionych z Teorii.
          </li>
          <li>
            <b>Dane zamówienia</b> – wybrane źródła oraz status realizacji.
          </li>
          <li>
            <b>Dane techniczne</b>{" "}
            – adres IP, logi serwera, dane analityczne (jeśli włączone) oraz
            identyfikatory zapisane w pamięci przeglądarki.
          </li>
        </ul>

        <h2 class="mt-6 mb-2">3. Cele i podstawy przetwarzania</h2>
        <ul class="list-disc list-inside text-gray">
          <li>
            <b>Realizacja Zamówień</b>{" "}
            (obsługa zgłoszenia, kontakt, status) – niezbędność do wykonania
            usługi.
          </li>
          <li>
            <b>Bezpieczeństwo i zapobieganie nadużyciom</b>{" "}
            – uzasadniony interes administratora.
          </li>
          <li>
            <b>Analityka</b>{" "}
            – jeśli korzystamy z narzędzi analitycznych, służy to ulepszaniu
            Serwisu.
          </li>
        </ul>

        <h2 class="mt-6 mb-2">4. Odbiorcy danych</h2>
        <p class="text-justify text-gray">
          Dane mogą być udostępniane podmiotom, które pomagają w działaniu
          Serwisu, w szczególności:
        </p>
        <ul class="list-disc list-inside text-gray">
          <li>
            <b>Dostawcom infrastruktury/hostingu</b>{" "}
            (w zakresie niezbędnym do działania Serwisu).
          </li>
          <li>
            <b>Discord</b>{" "}
            – Serwis może przesyłać powiadomienia o złożonych Zamówieniach i
            błędach technicznych przez webhooki.
          </li>
          <li>
            <b>Google Analytics</b>{" "}
            – jeśli włączone, w celu analizy ruchu (mechanizm pomiarowy Google).
          </li>
        </ul>

        <h2 class="mt-6 mb-2">5. Cookies i podobne technologie</h2>
        <p class="text-justify text-gray">
          Serwis może korzystać z plików cookies oraz podobnych technologii (np.
          localStorage) w celu zapewnienia działania funkcji Serwisu oraz
          analityki.
        </p>

        <h2 class="mt-6 mb-2">6. Dane w localStorage</h2>
        <p class="text-justify text-gray">
          Serwis zapisuje w pamięci przeglądarki identyfikatory Twoich Zamówień,
          abyś mógł/mogła łatwo wrócić do ich podglądu na tym urządzeniu. Jeśli
          korzystasz z panelu administratora, hasło/klucz administratora może
          być przechowywane lokalnie w przeglądarce.
        </p>

        <h2 class="mt-6 mb-2">7. Okres przechowywania</h2>
        <p class="text-justify text-gray">
          Dane związane z Zamówieniami przechowujemy tak długo, jak jest to
          potrzebne do ich obsługi oraz do celów bezpieczeństwa i
          rozliczalności. Dane w localStorage pozostają na Twoim urządzeniu do
          czasu ich usunięcia przez Ciebie (np. wyczyszczenie danych
          przeglądarki).
        </p>

        <h2 class="mt-6 mb-2">8. Twoje prawa</h2>
        <p class="text-justify text-gray">
          W zależności od sytuacji przysługują Ci prawa wynikające z przepisów o
          ochronie danych (m.in. dostęp, sprostowanie, usunięcie, ograniczenie,
          sprzeciw). W sprawach prywatności skontaktuj się przez Instagram:{" "}
          <a
            href="https://instagram.com/zt.hype"
            target="_blank"
            rel="noopener noreferrer"
            class="text-pink hover:underline"
          >
            @zt.hype
          </a>.
        </p>

        <h2 class="mt-6 mb-2">9. Zmiany polityki</h2>
        <p class="text-justify text-gray">
          Polityka prywatności może być aktualizowana. Aktualna wersja jest
          publikowana w Serwisie.
        </p>
      </div>
    </>
  );
}
