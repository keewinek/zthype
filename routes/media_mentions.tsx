import Button from "../components/Button.tsx";
import HomeServiceButton from "../components/HomeServiceButton.tsx";
import TopNav from "../islands/TopNav.tsx";
import { MediaMentionsMakeOrderPanel } from "../islands/MediaMentionsMakeOrderPanel.tsx";
import SplashScreen from "../islands/SplashScreen.tsx";
import BottomFooter from "../components/BottomFooter.tsx";
import MediaMentionPartnerImg from "../components/MediaMentionPartnerImg.tsx";

export default function Home() {
    return (
        <>
            <head>
                <title>Zdobądź wzmianki medialne do twojego projektu - ZTHype</title>
            </head>
            <body>
                <SplashScreen/>
                <TopNav/>
                <div class="panel">
                    <h1 class="my-4">Zdobądź <span class="text-pink">wzmianki medialne</span>.</h1>
                    <p class="text-gray text-justify">
                        Wzmianka medialna na platformie Zwolnionych z Teorii, to wpis na stronie mediów, na stronie blogu lub na stronie popularno naukowej i innych.
                        Współpracujemy z wieloma stronami blogowymi, opierających swoje treści na projektach Zwolnionych z Teorii, a na tej stronie możesz zamówić wpisy dla
                        twojego projektu.
                    </p>

                    <h2 class="my-4 mt-12">Współpracujemy z tymi stronami:</h2>
                    <div class="flex flex-wrap justify-center max-w-full">
                        <MediaMentionPartnerImg src="/src/brand/zthype_blog_white_logo_text_color_transparent.png" />
                        <MediaMentionPartnerImg src="/src/bobrlog_logo.png" />
                        <MediaMentionPartnerImg src="/src/literno_logo.png" />
                        <MediaMentionPartnerImg src="/src/pder_logo.png" />
                        <MediaMentionPartnerImg src="/src/keblogz_logo.png" />
                        <MediaMentionPartnerImg src="/src/actropira_logo.png" />
                        <MediaMentionPartnerImg src="/src/evenciarze_logo.png" />
                        <MediaMentionPartnerImg src="/src/ligcis_logo.png" />
                        <MediaMentionPartnerImg src="/src/qulia_logo.png" />
                        <MediaMentionPartnerImg src="/src/socjovibe_logo.png" />
                    </div>
                    <p class="text-gray text-xs mt-2">Chcesz współpracować z nami? Napisz na <a href="mailto:keewinek@gmail.com">keewinek@gmail.com</a>. Współpraca z ZTHype to więcej ruchu na twojej stronie.</p>
                </div>

                <MediaMentionsMakeOrderPanel/>
                <BottomFooter/>
            </body>
        </>
    );
}
