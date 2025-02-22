import Button from "../components/Button.tsx";
import HomeServiceButton from "../components/HomeServiceButton.tsx";
import TopNav from "../islands/TopNav.tsx";
import { MediaMentionsMakeOrderPanel } from "../islands/MediaMentionsMakeOrderPanel.tsx";
import SplashScreen from "../islands/SplashScreen.tsx";

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
                    <div class="flex justify-center">
                        <img src="/src/brand/zthype_blog_white_logo_text_color_transparent.png" class="h-16 mr-4 mb-4" />
                    </div>
                </div>

                <MediaMentionsMakeOrderPanel/>
            </body>
        </>
    );
}
