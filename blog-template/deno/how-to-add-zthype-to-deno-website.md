# How to Add ZTHype Blog to Your Deno Fresh Website

## Overview

This tutorial explains how to integrate the ZTHype Blog API (`zthype.deno.dev/api`) into your existing Deno Fresh website. The API provides access to blog articles with rich content including paragraphs, images, and project links.

## Source IDs

Before using the API, you'll need to know your website's source IDs. The source IDs follow this pattern:
- `{website_name}_projects_review` - For compilation articles that review multiple projects
- `{website_name}_personalized_article` - For personalized articles about individual projects

Replace `{website_name}` with your actual website identifier (e.g., if your website is "example_blog", your source IDs would be `example_blog_projects_review` and `example_blog_personalized_article`).

**Note:** Throughout this tutorial, `{website_name}` is used as a placeholder. Replace it with your actual website identifier when implementing.

## API Endpoints

### 1. Get Single Article
**Endpoint:** `GET https://zthype.deno.dev/api/get_article`

**Parameters:**
- `urlid` (required): The unique URL-friendly identifier for the article
- `source_ids` (required): Comma-separated list of source IDs to filter articles

**Example:**
```
GET https://zthype.deno.dev/api/get_article?urlid=example_article_slug&source_ids={website_name}_projects_review,{website_name}_personalized_article
```

**Response:**
```json
{
  "success": true,
  "article": {
    "type": "personalized" | "compilation",
    "title": "Article Title",
    "urlid": "article-slug",
    "source_id": "source_id",
    "url": "full-url",
    "order_ids": [1, 2, 3],
    "order_ids_count": 3,
    "paragraph": "Main paragraph text",
    "generated_paragraphs": [],
    "created_at": 1234567890000,
    "img_urls": ["https://example.com/image.jpg"],
    "uuid": "unique-id"
  },
  "paragraphs": [
    {
      "header": "Section Header (optional)",
      "content": "Paragraph content text",
      "project_zt_link": "https://zwolnienizteorii.pl/project/... (optional)",
      "project_link": "https://project-website.com (optional)",
      "img_url": "https://example.com/image.jpg (optional)"
    }
  ]
}
```

### 2. Get Articles List
**Endpoint:** `GET https://zthype.deno.dev/api/get_articles_form_source_ids`

**Parameters:**
- `source_ids` (required): Comma-separated list of source IDs

**Example:**
```
GET https://zthype.deno.dev/api/get_articles_form_source_ids?source_ids={website_name}_projects_review,{website_name}_personalized_article
```

**Response:**
```json
{
  "success": true,
  "articles": [
    {
      "type": "personalized",
      "title": "Article Title",
      "urlid": "article-slug",
      "source_id": "source_id",
      "created_at": 1234567890000,
      "img_urls": ["https://example.com/image.jpg"],
      // ... other article fields
    }
  ]
}
```

## AI Prompt for Cursor

Copy and paste this prompt into Cursor to automatically add blog functionality to your Deno Fresh website:

---

**PROMPT START:**

I need to add a blog section to my Deno Fresh website using the ZTHype Blog API. Please implement the following:

**Important Notes:**
- Replace `{website_name}` in all API URLs with the actual website identifier (e.g., if the website is "example_blog", use `example_blog_projects_review` and `example_blog_personalized_article` as source IDs). If you're unsure of the exact source IDs, ask the user or check the website's configuration.
- **DO NOT modify the website's navigation bar or navbar. Do NOT add a "Blog" link to the navigation. Leave all navigation components exactly as they are.**

1. **Create `/routes/blog/index.tsx`** - A blog listing page that:
   - Fetches articles from `https://zthype.deno.dev/api/get_articles_form_source_ids?source_ids={website_name}_projects_review,{website_name}_personalized_article`
   - Displays articles in a grid or list layout
   - Shows article title, featured image (first image from `img_urls` array), publication date (from `created_at` timestamp), and a preview/excerpt
   - Each article card should link to `/blog/[urlid]` where `urlid` is the article's `urlid` field
   - Style the page to match the existing website's design system (colors, typography, spacing, etc.)
   - Handle loading states and empty states gracefully
   - Use server-side rendering (async function in the route handler)

2. **Create `/routes/blog/[urlid].tsx`** - An individual article page that:
   - Takes the `urlid` parameter from the URL
   - Fetches the article from `https://zthype.deno.dev/api/get_article?urlid={urlid}&source_ids={website_name}_projects_review,{website_name}_personalized_article`
   - Displays the article title, publication date, and all paragraphs
   - For each paragraph in the `paragraphs` array:
     - Display the `header` if it exists (as an h2 or h3)
     - Display the `img_url` if it exists (as a responsive image)
     - Display the `content` as paragraph text
     - Display `project_link` and `project_zt_link` if they exist (as styled links/buttons)
   - Style the article page to match the existing website's design system
   - Handle loading states (show skeleton/loading indicator while fetching)
   - Handle error states (if article not found)
   - Set appropriate page title and meta tags
   - Use server-side rendering (async function in the route handler)

3. **Design Requirements:**
   - Analyze the existing website's design system (colors, fonts, spacing, component styles)
   - Match the blog pages' styling to the existing website aesthetic
   - Ensure responsive design (mobile-friendly)
   - Use the same navigation/header/footer components if they exist
   - Maintain consistent spacing and typography with the rest of the site
   - **IMPORTANT: DO NOT add a "Blog" link to the website's navigation bar or navbar. Leave the navigation exactly as it is.**

4. **Technical Requirements:**
   - Use TypeScript
   - Use Deno Fresh's built-in features (PageProps, etc.)
   - Handle CORS (the API already includes CORS headers)
   - Format dates appropriately (convert `created_at` Unix timestamp to readable date)
   - Handle missing/optional fields gracefully (some paragraphs may not have headers, images, or links)
   - Use async/await for API calls
   - Add proper error handling

5. **Optional Enhancements:**
   - Add a "Back to Blog" link on article pages
   - Add breadcrumbs if the site uses them
   - Add social sharing buttons if appropriate
   - Add related articles section
   - Add reading time estimate

6. **Create ZTHype Configuration Files:**
   - After implementing the blog routes, create the ZTHype configuration files needed for article generation
   - Analyze the website's topic, theme, and target audience
   - Create `{website_name}_personalized_article.json` with a customized prompt that:
     - Follows the JSON structure: `{"type": "personalized", "id": "{website_name}_personalized_article", "url": "https://yourdomain.com/blog/%urlid%", "max_orders": 1, "prompt": "..."}`
     - Includes a specific focus area/topic that matches the website's theme (e.g., technology, environment, education, health, business, arts)
     - Mentions the website/blog name in the prompt
     - Guides AI to write articles aligned with the website's content style
   - Create `{website_name}_projects_review.json` with:
     - `{"type": "compilation", "title": "...", "id": "{website_name}_projects_review", "urlid": "...", "url": "https://yourdomain.com/blog/...", "max_orders": 10}`
     - Customized title and urlid matching your website's language and naming conventions
   - Replace `{website_name}` with the actual website identifier in both files
   - Store these files in a `config/` directory or appropriate location for ZTHype system integration

Please implement this functionality now, ensuring the blog pages integrate seamlessly with the existing website design, and create the necessary configuration files with website-specific prompts.

**PROMPT END**

---

## Manual Implementation Guide

If you prefer to implement manually, follow these steps:

### Step 1: Create Blog Index Route

Create `routes/blog/index.tsx`:

```typescript
import { PageProps } from "$fresh/server.ts";

interface Article {
  title: string;
  urlid: string;
  created_at: number;
  img_urls: string[];
  paragraph?: string;
}

export default async function BlogIndex(props: PageProps) {
  // Replace {website_name} with your actual website identifier
  // Example: "example_blog_projects_review,example_blog_personalized_article"
  const sourceIds = "{website_name}_projects_review,{website_name}_personalized_article";
  const response = await fetch(
    `https://zthype.deno.dev/api/get_articles_form_source_ids?source_ids=${sourceIds}`
  );
  const data = await response.json();
  const articles: Article[] = data.articles || [];

  return (
    <>
      <head>
        <title>Blog - Your Site Name</title>
      </head>
      <body>
        {/* Your existing header/nav */}
        
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-4xl font-bold mb-8">Blog</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <a
                href={`/blog/${article.urlid}`}
                class="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                {article.img_urls?.[0] && (
                  <img
                    src={article.img_urls[0]}
                    alt={article.title}
                    class="w-full h-48 object-cover"
                  />
                )}
                <div class="p-6">
                  <h2 class="text-xl font-semibold mb-2">{article.title}</h2>
                  <p class="text-sm text-gray-600 mb-2">
                    {new Date(article.created_at).toLocaleDateString()}
                  </p>
                  {article.paragraph && (
                    <p class="text-gray-700 line-clamp-3">
                      {article.paragraph.substring(0, 150)}...
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* Your existing footer */}
      </body>
    </>
  );
}
```

### Step 2: Create Article Detail Route

Create `routes/blog/[urlid].tsx`:

```typescript
import { PageProps } from "$fresh/server.ts";

interface Paragraph {
  header?: string;
  content: string;
  project_zt_link?: string;
  project_link?: string;
  img_url?: string;
}

interface Article {
  title: string;
  created_at: number;
  paragraph?: string;
}

interface ArticleResponse {
  success: boolean;
  article: Article;
  paragraphs: Paragraph[];
}

export default async function ArticlePage(props: PageProps) {
  const { urlid } = props.params;
  // Replace {website_name} with your actual website identifier
  // Example: "example_blog_projects_review,example_blog_personalized_article"
  const sourceIds = "{website_name}_projects_review,{website_name}_personalized_article";
  
  const response = await fetch(
    `https://zthype.deno.dev/api/get_article?urlid=${urlid}&source_ids=${sourceIds}`
  );
  
  if (!response.ok) {
    return (
      <>
        <head><title>Article Not Found</title></head>
        <body>
          <div class="container mx-auto px-4 py-8">
            <h1 class="text-2xl font-bold mb-4">Article Not Found</h1>
            <a href="/blog" class="text-blue-600 hover:underline">← Back to Blog</a>
          </div>
        </body>
      </>
    );
  }
  
  const data: ArticleResponse = await response.json();
  const { article, paragraphs } = data;

  return (
    <>
      <head>
        <title>{article.title} - Your Site Name</title>
        <meta name="description" content={article.paragraph || article.title} />
      </head>
      <body>
        {/* Your existing header/nav */}
        
        <div class="container mx-auto px-4 py-8 max-w-4xl">
          <a href="/blog" class="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Blog
          </a>
          
          <article>
            <h1 class="text-4xl font-bold mb-4">{article.title}</h1>
            <p class="text-sm text-gray-600 mb-8">
              Published {new Date(article.created_at).toLocaleDateString()}
            </p>
            
            {article.paragraph && (
              <p class="text-lg mb-6">{article.paragraph}</p>
            )}
            
            {paragraphs.map((para, index) => (
              <div key={index} class="mb-6">
                {para.header && (
                  <h2 class="text-2xl font-semibold mb-3">{para.header}</h2>
                )}
                {para.img_url && (
                  <img
                    src={para.img_url}
                    alt={para.header || "Article image"}
                    class="w-full rounded-lg mb-4"
                  />
                )}
                <p class="mb-4 whitespace-pre-line">{para.content}</p>
                <div class="flex gap-4">
                  {para.project_link && (
                    <a
                      href={para.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline"
                    >
                      View Project →
                    </a>
                  )}
                  {para.project_zt_link && (
                    <a
                      href={para.project_zt_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:underline"
                    >
                      Project on Zwolnieni z Teorii →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </article>
        </div>
        
        {/* Your existing footer */}
      </body>
    </>
  );
}
```

### Step 3: Create ZTHype Configuration Files

To enable article generation through ZTHype, you'll need to create configuration files. See the "Creating Configuration Files" section below for detailed instructions.

**Note:** These config files are typically created in the ZTHype system (not in your website codebase), but you can prepare them locally and submit them to the ZTHype team for integration.

## Testing

1. **Test the API directly:**
   ```bash
   curl "https://zthype.deno.dev/api/get_articles_form_source_ids?source_ids={website_name}_projects_review,{website_name}_personalized_article"
   ```

2. **Test with a specific article:**
   ```bash
   curl "https://zthype.deno.dev/api/get_article?urlid=test&source_ids={website_name}_projects_review,{website_name}_personalized_article"
   ```
   (Note: `urlid=test` returns a test article for development)

3. **Run your Fresh server:**
   ```bash
   deno task start
   ```

4. **Visit:**
   - `http://localhost:8000/blog` - Blog listing
   - `http://localhost:8000/blog/[any-urlid]` - Individual article

## Notes

- The API includes CORS headers, so it can be called from any domain
- All timestamps are Unix timestamps in milliseconds
- Images may be empty strings in arrays - handle gracefully
- Some paragraphs may not have headers, images, or links - all fields are optional
- The API returns up to 40 articles in the list endpoint
- Source IDs are case-sensitive

## Creating Configuration Files

To fully integrate with ZTHype and enable article generation, you need to create configuration files. These files tell ZTHype how to generate articles for your website.

### Required Config Files

You need to create two configuration files in the ZTHype system (not in your website):

1. **`{website_name}_personalized_article.json`** - For single-project articles
2. **`{website_name}_projects_review.json`** - For compilation articles reviewing multiple projects

### Configuration File Structure

#### Personalized Article Config

Create `config/media_mention_sources/{website_name}_personalized_article.json`:

```json
{
    "type": "personalized",
    "id": "{website_name}_personalized_article",
    "url": "https://your-website.com/blog/%urlid%",
    "max_orders": 1,
    "prompt": "Write an article about a social project completed as part of Zwolnieni z Teorii, named %project_title%. Project description: %project_description%. Create a title for the article, and send the entire article to me in JSON format that looks like this: {\"title\": \"ENTER TITLE HERE\", \"paragraphs\": [{\"header\" : \"ENTER FIRST PARAGRAPH TITLE\", \"content\": \"ENTER CONTENT\"}, {\"header\" : \"ENTER SECOND PARAGRAPH TITLE\", \"content\": \"ENTER CONTENT\"}]}. The content should be approximately 500 words (4-5 paragraphs) and have no formatting like bold text, links, or anything of that sort. When writing the article and creating the title, focus on [WEBSITE-SPECIFIC TOPIC/ANGLE - e.g., 'technological innovation and digital solutions', 'environmental sustainability and green initiatives', 'educational impact and learning outcomes', etc.]. The blog you're writing for is called [YOUR BLOG NAME]."
}
```

**Important:** Replace `[WEBSITE-SPECIFIC TOPIC/ANGLE]` with a specific focus area that matches your website's theme. For example:
- Technology blog: "technological innovation, software development, and digital transformation"
- Environmental blog: "environmental sustainability, climate action, and ecological impact"
- Education blog: "educational methodologies, learning outcomes, and student engagement"
- Health blog: "health and wellness, medical innovation, and public health initiatives"

#### Compilation Article Config

Create `config/media_mention_sources/{website_name}_projects_review.json`:

```json
{
    "type": "compilation",
    "title": "Review of 10 Zwolnieni z Teorii Social Projects Part %index%",
    "id": "{website_name}_projects_review",
    "urlid": "review_10_zwolnieni_z_teorii_social_projects_part_%index%",
    "url": "https://your-website.com/blog/review_10_zwolnieni_z_teorii_social_projects_part_%index%",
    "max_orders": 10
}
```

**Note:** Customize the `title` and `urlid` fields to match your website's naming conventions and language.

### AI Prompt for Creating Config Files

Add this to your AI prompt when asking to create the configuration files:

---

**ADDITIONAL PROMPT FOR CONFIG FILES:**

After implementing the blog routes, please also create the ZTHype configuration files needed for article generation. These files should be created in a `zthype_config/` directory (or wherever appropriate for the ZTHype system setup).

1. **Analyze the website's topic and theme:**
   - Review the existing website content, navigation, and design
   - Identify the main topic, theme, or angle the website focuses on
   - Determine the website's target audience and writing style

2. **Create `{website_name}_personalized_article.json`:**
   - Set `id` to `{website_name}_personalized_article` (replace {website_name} with actual identifier)
   - Set `url` to the full URL pattern for your blog articles (e.g., `https://yourdomain.com/blog/%urlid%`)
   - Create a customized `prompt` field that:
     - Follows the structure shown in the tutorial
     - Includes a specific focus area/topic that matches the website's theme
     - Mentions the website/blog name
     - Guides the AI to write articles that align with the website's content style and audience
   - Example focus areas could be: technology, environment, education, health, business, arts, etc.

3. **Create `{website_name}_projects_review.json`:**
   - Set `id` to `{website_name}_projects_review`
   - Customize `title` and `urlid` to match your website's language and naming conventions
   - Set `url` to match your blog URL structure
   - Set `max_orders` to the desired number of projects per compilation (typically 7-10)

4. **Ensure consistency:**
   - Both config files should use the same `{website_name}` identifier
   - URLs should match your actual blog route structure
   - The prompt should reflect the website's unique angle and audience

Please create these configuration files now, ensuring the personalized article prompt is tailored to the website's specific topic and theme.

---

{website_name} is the current project short name.

