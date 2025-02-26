import { PageProps } from "$fresh/server.ts";
import ArticlePage from "../../islands/ArticlePage.tsx";

export default function ArticlePageWrapper(props: PageProps) {
    return (
        <>
            <head>
                <title>Article Page</title>
            </head>
            <body>
            <ArticlePage urlid={props.params.urlid}/>

            </body>
        </>
    )
}