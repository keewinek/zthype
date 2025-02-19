import { Head } from "$fresh/runtime.ts";
import Button from "../components/Button.tsx";

export default function Error404() {
	return (
		<>
			<Head>
				<title>404 - Nie znaleziono</title>
			</Head>
			<body>
				<div class="fixed w-max max-w-full h-fit top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]">
					<h1 class="text-9xl">404</h1>
					<p class="text-gray text-center mt-4">Nie znaleziono tej strony.</p>
					<Button text="Wróć do strony głównej" full={true} className="mt-2" href="/"/>
				</div>
			</body>
		</>
	);
}
