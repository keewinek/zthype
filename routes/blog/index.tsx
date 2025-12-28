import { PageProps } from "$fresh/server.ts";
import TopNav from "../../islands/TopNav.tsx";
import { Article } from "../../interfaces/Article.ts";
import { MediaMentionSourceConfig } from "../../interfaces/MediaMentionSourceConfig.ts";
import { get_articles_by_queries, Query } from "../../utils/database.ts";

async function getZTHypeSourceIds(): Promise<string[]> {
  try {
    const configDir = "config/media_mention_sources";
    const files = [];
    
    for await (const dirEntry of Deno.readDir(configDir)) {
      if (dirEntry.isFile && dirEntry.name.endsWith(".json")) {
        files.push(dirEntry.name);
      }
    }
    
    const sourceIds: string[] = [];
    
    for (const file of files) {
      if (file.startsWith("zt_hype_blog_")) {
        const configPath = `${configDir}/${file}`;
        const configText = await Deno.readTextFile(configPath);
        const config: MediaMentionSourceConfig = JSON.parse(configText);
        if (config.id) {
          sourceIds.push(config.id);
        }
      }
    }
    
    return sourceIds;
  } catch (error) {
    console.error("Error reading source configs:", error);
    // Fallback to hardcoded IDs if config reading fails
    return ["zt_hype_blog_projects_review", "zt_hype_blog_personalized_article"];
  }
}

async function fetchArticles(): Promise<Article[]> {
  try {
    const sourceIds = await getZTHypeSourceIds();
    
    if (sourceIds.length === 0) {
      return [];
    }
    
    // Directly call the database function instead of making an HTTP request
    const out_data = await get_articles_by_queries([
      Query.equal("source_id", sourceIds),
      Query.orderDesc("created_at")
    ]);
    
    // Handle error case
    if (out_data && 'error' in out_data) {
      console.error("Error fetching articles:", out_data.error);
      return [];
    }
    
    // Return articles array (or empty array if null)
    const articles = out_data || [];
    return articles;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function BlogHome(props: PageProps) {
  const articles = await fetchArticles();

  return (
    <>
      <head>
        <title>Blog - ZTHype</title>
        <meta name="description" content="Przeglądaj nasze artykuły o projektach społecznych, aplikacjach i inicjatywach." />
      </head>
      <body>
        <TopNav />
        
        <div class="px-4 py-16">
          <div class="max-w-6xl mx-auto">
            {/* Header */}
            <div class="text-center mb-12">
              <h1 class="text-4xl max-md:text-3xl font-thin mb-4">Blog ZTHype</h1>
              <p class="text-xl max-md:text-lg text-gray max-w-2xl mx-auto">
                Odkryj nasze artykuły o projektach społecznych, aplikacjach i inicjatywach, które zmieniają świat na lepsze.
              </p>
            </div>

            {/* Articles Grid */}
            {articles.length > 0 ? (
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article: Article) => (
                  <a
                    href={`/blog/${article.urlid}`}
                    class="bg-background-dark/50 rounded-lg border border-background-light/50 hover:border-pink/50 duration-200 overflow-hidden group no-underline hover:no-underline"
                  >
                    {/* Article Image */}
                    <div class="w-full h-48 overflow-hidden bg-background-light flex items-center justify-center">
                      {article.img_urls && article.img_urls.length > 0 ? (
                        <img
                          src={article.img_urls[0]}
                          alt={article.title}
                          class="w-full h-full object-cover group-hover:scale-110 duration-300"
                        />
                      ) : (
                        <i class="fa-solid fa-newspaper text-6xl text-gray"></i>
                      )}
                    </div>
                    
                    {/* Article Content */}
                    <div class="p-6">
                      <h2 class="text-xl font-thin mb-2 text-white group-hover:text-pink duration-200 line-clamp-2">
                        {article.title}
                      </h2>
                      
                      <p class="text-sm text-gray mb-4">
                        {new Date(article.created_at).toLocaleDateString("pl-PL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </p>
                      
                      {article.paragraph && (
                        <p class="text-gray text-sm line-clamp-3">
                          {article.paragraph.length > 150 
                            ? article.paragraph.substring(0, 150) + "..." 
                            : article.paragraph}
                        </p>
                      )}
                      
                      <div class="mt-4 flex items-center text-pink text-sm group-hover:underline">
                        Czytaj więcej
                        <i class="fa-solid fa-arrow-right ml-2"></i>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div class="text-center py-16">
                <i class="fa-solid fa-newspaper text-6xl text-gray mb-4"></i>
                <p class="text-xl text-gray">Brak artykułów do wyświetlenia</p>
                <p class="text-gray mt-2">Wkrótce pojawią się tutaj nowe artykuły.</p>
              </div>
            )}
          </div>
        </div>
      </body>
    </>
  );
}
