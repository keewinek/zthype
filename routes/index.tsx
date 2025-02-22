import HomeServiceButton from "../components/HomeServiceButton.tsx";
import TopNav from "../islands/TopNav.tsx";
import SplashScreen from "../islands/SplashScreen.tsx";

export default function Home() {
	return (
		<>
			<head>
				<title>ZTHype</title>
			</head>
			<body>
				<SplashScreen/>
				<TopNav/>

				<h1 class="my-8">ZTHype</h1>

				<div class="panel">
					<h2>Nasze usługi:</h2>
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
						disabled={true}
					/>
					<HomeServiceButton
						title="Wypromuj waszą stronę internetową."
						description="Jeśli posiadacie stronę internetową, skorzystajcie z tej usługi. Zdobądźcie prawdziwe wejścia na stronę internetową twojego porjektu Zwolnionych z Teorii."
						fa_icon="eye"
						href="/website_views"
						disabled={true}
					/>
				</div>
			</body>
		</>
	);
}
