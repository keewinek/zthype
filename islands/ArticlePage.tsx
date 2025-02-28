import { useEffect, useState } from "preact/hooks";
import TopNav from "./TopNav.tsx";
import { Article } from "../interfaces/Article.ts";
import { urlid_to_str } from "../utils/urlid.ts";
import { Paragraph } from "../interfaces/Paragraph.ts";

const SOURCE_IDS = ["zt_hype_blog_projects_review", "zt_hype_blog_personalized_article"]

async function fetch_article(urlid: string)
{
    const response = await fetch(`/api/get_article?urlid=${urlid}&source_ids=${SOURCE_IDS.join(",")}`).then((response) => response.json());

    if ('error' in response)
    {
        console.error(response.error);
        return null;
    }

    return response;
}

export default function ArticlePage({urlid}: {urlid: string}) {
    
    const [article, set_article] = useState({} as Article);
    const [paragraphs, set_paragraphs] = useState([] as Paragraph[])
    const [article_loaded, set_article_loaded] = useState(false);
    
    useEffect(() => {
        fetch_article(urlid).then((data) => {
            set_article(data.article);
            set_paragraphs(data.paragraphs);
            set_article_loaded(true);
            console.log(data);
        });
    }, []);

    useEffect(() => {})

    return (
        <>
            <TopNav/>
            {
                article_loaded &&
                <div pragma-name="article" pragma-force="10" class="panel mb-6 pragma-once">
                    <h1 class="text-left my-2 text-4xl">{article.title}</h1>
                    <p class="text-sm text-gray mb-4">Opublikowano {(new Date(article.created_at)).toLocaleDateString()}</p>
                    <p>{article.paragraph}</p>

                    {paragraphs.map((paragraph: Paragraph) => { return (
                            <>
                                {paragraph.header && <h2 class="my-4">{paragraph.header}</h2>}
                                {paragraph.img_url && <img class="my-4 rounded-md w-full" src={paragraph.img_url} alt=""/>}
                                <p>{paragraph.content}</p>
                                {paragraph.project_link && <a class="mr-2" href={paragraph.project_link} target="_blank">Zobacz projekt </a>}
                                {paragraph.project_zt_link && <a class="" href={paragraph.project_zt_link} target="_blank">Projekt na platformie ZwzT</a>}
                            </>
                    );})}

                    <div class="flex my-4 text-gray text-xs">
                        <p>Zdjęcia mogą pochodzić z <a href="https://www.pexels.com" target="_blank">pexels.com</a></p>.
                    </div>

                </div>
            }
            {
                !article_loaded &&
                <div pragma-name="article" pragma-force="0" class="panel mb-6">
                    <h1 class="text-left my-2 text-4xl">{urlid_to_str(urlid)}</h1>
                    <p class="text-sm text-gray mb-4">Ładowanie artykułu...</p>

                    {[...Array(30)].map(() => (
                        <div class="h-2 bg-gray rounded-full animate-pulse w-full mb-2.5"></div>
                    ))}
                </div>
            }
        </>
    )
}