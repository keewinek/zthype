import { Head } from "$fresh/runtime.ts";
import TopNav from "../islands/TopNav.tsx";

export default function Regulamin() {
  return (
    <>
      <Head>
        <title>Regulamin - ZTHype</title>
      </Head>

      <TopNav />

      <div class="panel">
        <h1 class="my-2">Regulamin serwisu ZTHype</h1>
        <p class="text-gray text-xs mb-6">Obowiązuje od: 26.12.2025</p>

        <h2 class="mt-6 mb-2">1. Informacje ogólne</h2>
        <p class="text-justify text-gray">
          Niniejszy regulamin określa zasady korzystania z serwisu internetowego
          ZTHype (dalej: „Serwis”). Serwis umożliwia złożenie zlecenia
          dotyczącego publikacji wzmianek medialnych o projektach (dalej:
          „Zamówienie”) oraz podgląd statusu złożonych Zamówień.
        </p>

        <h2 class="mt-6 mb-2">2. Definicje</h2>
        <ul class="list-disc list-inside text-gray">
          <li>
            <b>Użytkownik</b> – osoba korzystająca z Serwisu.
          </li>
          <li>
            <b>Zamówienie</b>{" "}
            – zgłoszenie zlecenia w Serwisie wraz z podanymi danymi i wyborem
            źródeł.
          </li>
          <li>
            <b>Wzmianka medialna</b>{" "}
            – publikacja (np. wpis/artykuł) na stronie partnerskiej lub
            blogowej.
          </li>
        </ul>

        <h2 class="mt-6 mb-2">3. Zasady korzystania z Serwisu</h2>
        <ul class="list-disc list-inside text-gray">
          <li>Użytkownik zobowiązuje się podawać dane prawdziwe i aktualne.</li>
          <li>
            Użytkownik ponosi odpowiedzialność za treści przekazane w opisie
            projektu (w tym za to, że nie naruszają praw osób trzecich).
          </li>
          <li>
            Serwis może wymagać podania kodu dostępu w celu złożenia Zamówienia
            (mechanizm antyspamowy / dostępowy).
          </li>
        </ul>

        <h2 class="mt-6 mb-2">4. Składanie Zamówień</h2>
        <p class="text-justify text-gray">
          Złożenie Zamówienia następuje przez wypełnienie formularza w Serwisie,
          wybór źródeł oraz przesłanie zgłoszenia. Po złożeniu Zamówienia
          Użytkownik otrzymuje możliwość podglądu szczegółów i statusu
          Zamówienia w Serwisie.
        </p>

        <h2 class="mt-6 mb-2">5. Płatności</h2>
        <p class="text-justify text-gray">
          Serwis nie udostępnia wbudowanej bramki płatniczej. Ewentualne
          ustalenia dotyczące rozliczeń (np. BLIK, przelew) odbywają się poza
          Serwisem, w uzgodnieniu z administratorem Serwisu.
        </p>

        <h2 class="mt-6 mb-2">6. Realizacja i terminy</h2>
        <ul class="list-disc list-inside text-gray">
          <li>
            Serwis może oznaczać Zamówienie jako „w trakcie” lub „zrealizowane”.
          </li>
          <li>
            Terminy publikacji mogą zależeć od dostępności i harmonogramu stron
            partnerskich oraz od treści przekazanych przez Użytkownika.
          </li>
        </ul>

        <h2 class="mt-6 mb-2">7. Odmowa realizacji / odrzucenie Zamówienia</h2>
        <p class="text-justify text-gray">
          Zamówienie może zostać odrzucone w szczególności w przypadku podania
          nieprawidłowych danych, naruszenia zasad prawa, naruszenia praw osób
          trzecich lub gdy realizacja nie jest możliwa organizacyjnie. W
          przypadku odrzucenia Serwis może podać powód odrzucenia.
        </p>

        <h2 class="mt-6 mb-2">8. Odpowiedzialność</h2>
        <ul class="list-disc list-inside text-gray">
          <li>
            Serwis dokłada starań, aby działał prawidłowo, jednak nie gwarantuje
            nieprzerwanej dostępności i może być czasowo niedostępny (np.
            przerwy techniczne).
          </li>
          <li>
            Serwis nie odpowiada za działania zewnętrznych stron/partnerów oraz
            za ewentualne skutki publikacji wynikające z treści dostarczonych
            przez Użytkownika.
          </li>
        </ul>

        <h2 class="mt-6 mb-2">9. Reklamacje i kontakt</h2>
        <p class="text-justify text-gray">
          W sprawach związanych z Zamówieniami lub działaniem Serwisu skontaktuj
          się przez Instagram:{" "}
          <a
            href="https://instagram.com/zt.hype"
            target="_blank"
            rel="noopener noreferrer"
            class="text-pink hover:underline"
          >
            @zt.hype
          </a>.
        </p>

        <h2 class="mt-6 mb-2">10. Dane osobowe</h2>
        <p class="text-justify text-gray">
          Zasady przetwarzania danych osobowych opisuje dokument „Polityka
          prywatności”.
        </p>

        <h2 class="mt-6 mb-2">11. Zmiany regulaminu</h2>
        <p class="text-justify text-gray">
          Regulamin może ulec zmianie. Aktualna wersja jest publikowana w
          Serwisie.
        </p>
      </div>
    </>
  );
}
