import TopNav from "../islands/TopNav.tsx";
import { MediaMentionsMakeOrderPanel } from "../islands/MediaMentionsMakeOrderPanel.tsx";
import SplashScreen from "../islands/SplashScreen.tsx";
import MediaMentionPartnerImg from "../components/MediaMentionPartnerImg.tsx";

export default function Home() {
  return (
    <>
      <head>
        <title>Zdobądź wzmianki medialne do twojego projektu - ZTHype</title>
      </head>
      <body>
        <SplashScreen />
        <TopNav />
        <div class="panel">
          <h1 class="my-4 mb-8">
            Zdobądź <span class="text-pink">wzmianki medialne</span>.
          </h1>
          <p class="text-gray text-justify">
            Napiszemy o waszym projekcie społecznym na naszych blogach i stronach partnerskich. 
            Współpracujemy z wieloma renomowanymi stronami blogowymi, które doceniają wartościowe 
            treści o projektach społecznych. Dzięki naszej sieci partnerów, możesz zamówić 
            profesjonalne wpisy o swoim projekcie, które dotrą do szerokiego grona odbiorców.
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
            <MediaMentionPartnerImg src="/src/mcbump_logo.png" />
          </div>
          <p class="text-gray text-xs mt-2">
            Chcesz współpracować z nami? Napisz do nas na instagramie{" "}
            <a href="https://instagram.com/zt.hype" target="_blank">
              @zt.hype
            </a>. Współpraca z ZTHype to większy ruch na twojej stronie.
          </p>
        </div>

        <MediaMentionsMakeOrderPanel />
      </body>
    </>
  );
}
