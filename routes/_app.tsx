// deno-lint-ignore-file react-no-danger
import { type PageProps } from "$fresh/server.ts";
import { installGlobals } from "https://deno.land/x/virtualstorage@0.1.0/mod.ts";
import BottomFooter from "../components/BottomFooter.tsx";
installGlobals(); //for localstorage

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="content-language" content="pl"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>ZTHype - ZwzT made easy.</title>

        <link rel="icon" href="/src/brand/white_logo_pink.png" sizes="any" />
        <link rel="stylesheet" href="/styles.css" />

        <script src="/js/loading_screen_hider.js" />
        <script src="/js/pragma_once.js" />

        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6RFET6H64Z"
        >
        </script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6RFET6H64Z');`,
          }}
        >
        </script>

        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <Component />
        <BottomFooter />
      </body>
    </html>
  );
}
