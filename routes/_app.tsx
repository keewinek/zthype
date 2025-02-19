import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv = "content-language" content = "pl"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>ZTHype</title>

        <link rel="icon" href="/src/brand/white_logo_pink.png" sizes="any" />
        <link rel="stylesheet" href="/styles.css" />

        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet"/>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
