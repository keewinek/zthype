# How to Add ZTHype Blog to Your Static HTML/JS/TailwindCSS Website

## Overview

This tutorial explains how to integrate the ZTHype Blog API (`zthype.deno.dev/api`) into your existing static HTML/JS/TailwindCSS website. The API provides access to blog articles with rich content including paragraphs, images, and project links.

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

Copy and paste this prompt into Cursor to automatically add blog functionality to your static HTML/JS/TailwindCSS website:

---

**PROMPT START:**

I need to add a blog section to my static HTML/JS/TailwindCSS website using the ZTHype Blog API. Please implement the following:

**Important Notes:**
- Replace `{website_name}` in all API URLs with the actual website identifier (e.g., if the website is "example_blog", use `example_blog_projects_review` and `example_blog_personalized_article` as source IDs). If you're unsure of the exact source IDs, ask the user or check the website's configuration.
- **DO NOT modify the website's navigation bar or navbar. Do NOT add a "Blog" link to the navigation. Leave all navigation components exactly as they are.**

1. **Create `/blog/index.html`** - A blog listing page that:
   - Uses client-side JavaScript to fetch articles from `https://zthype.deno.dev/api/get_articles_form_source_ids?source_ids={website_name}_projects_review,{website_name}_personalized_article`
   - Displays articles in a grid or list layout using TailwindCSS
   - Shows article title, featured image (first image from `img_urls` array), publication date (from `created_at` timestamp), and a preview/excerpt
   - Each article card should link to `/blog/[urlid].html` where `urlid` is the article's `urlid` field
   - Style the page to match the existing website's design system (colors, typography, spacing, etc.)
   - Handle loading states (show loading spinner/skeleton) and empty states gracefully
   - Use vanilla JavaScript with async/await for API calls
   - Include proper error handling

2. **Create `/blog/[urlid].html`** - An individual article page that:
   - Uses client-side JavaScript to extract the `urlid` from the URL (using `window.location.pathname` or URL parameters)
   - Fetches the article from `https://zthype.deno.dev/api/get_article?urlid={urlid}&source_ids={website_name}_projects_review,{website_name}_personalized_article`
   - Dynamically displays the article title, publication date, and all paragraphs
   - For each paragraph in the `paragraphs` array:
     - Display the `header` if it exists (as an h2 or h3)
     - Display the `img_url` if it exists (as a responsive image)
     - Display the `content` as paragraph text
     - Display `project_link` and `project_zt_link` if they exist (as styled links/buttons)
   - Style the article page to match the existing website's design system
   - Handle loading states (show skeleton/loading indicator while fetching)
   - Handle error states (if article not found, show 404 message)
   - Dynamically set page title and meta tags using JavaScript
   - Use vanilla JavaScript with async/await for API calls

3. **Routing Considerations:**
   - For static hosting, you may need to use hash-based routing (`#/blog/[urlid]`) or query parameters (`?urlid=...`)
   - Alternatively, if your hosting supports it, use server-side URL rewriting to map `/blog/[urlid]` to a single HTML file
   - If using a static site generator or hosting service, configure URL rewriting rules accordingly
   - Consider using a single-page application approach with JavaScript routing if needed

4. **Design Requirements:**
   - Analyze the existing website's design system (colors, fonts, spacing, component styles)
   - Match the blog pages' styling to the existing website aesthetic using TailwindCSS
   - Ensure responsive design (mobile-friendly)
   - Use the same navigation/header/footer components if they exist
   - Maintain consistent spacing and typography with the rest of the site
   - **IMPORTANT: DO NOT add a "Blog" link to the website's navigation bar or navbar. Leave the navigation exactly as it is.**

5. **Technical Requirements:**
   - Use vanilla JavaScript (no frameworks required, but can use if already in the project)
   - Include TailwindCSS via CDN or build process
   - Handle CORS (the API already includes CORS headers)
   - Format dates appropriately (convert `created_at` Unix timestamp to readable date)
   - Handle missing/optional fields gracefully (some paragraphs may not have headers, images, or links)
   - Use async/await for API calls
   - Add proper error handling with user-friendly messages
   - Ensure the code works in modern browsers (ES6+)

6. **Optional Enhancements:**
   - Add a "Back to Blog" link on article pages
   - Add breadcrumbs if the site uses them
   - Add social sharing buttons if appropriate
   - Add related articles section
   - Add reading time estimate
   - Add smooth loading transitions

7. **Create ZTHype Configuration Files:**
   - After implementing the blog pages, create the ZTHype configuration files needed for article generation
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

### Step 1: Create Blog Index Page

Create `blog/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Your Site Name</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Or use your existing TailwindCSS setup -->
</head>
<body>
    <!-- Your existing header/nav -->
    
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-8">Blog</h1>
        
        <!-- Loading state -->
        <div id="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p class="mt-4 text-gray-600">Loading articles...</p>
        </div>
        
        <!-- Error state -->
        <div id="error" class="hidden text-center py-12">
            <p class="text-red-600">Failed to load articles. Please try again later.</p>
        </div>
        
        <!-- Empty state -->
        <div id="empty" class="hidden text-center py-12">
            <p class="text-gray-600">No articles found.</p>
        </div>
        
        <!-- Articles grid -->
        <div id="articles-grid" class="hidden">
            <!-- Articles will be inserted here by JavaScript -->
        </div>
    </div>
    
    <!-- Your existing footer -->
    
    <script>
        // Replace {website_name} with your actual website identifier
        // Example: "example_blog_projects_review,example_blog_personalized_article"
        const sourceIds = "{website_name}_projects_review,{website_name}_personalized_article";
        
        async function loadArticles() {
            const loadingEl = document.getElementById('loading');
            const errorEl = document.getElementById('error');
            const emptyEl = document.getElementById('empty');
            const gridEl = document.getElementById('articles-grid');
            
            try {
                const response = await fetch(
                    `https://zthype.deno.dev/api/get_articles_form_source_ids?source_ids=${encodeURIComponent(sourceIds)}`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                
                const data = await response.json();
                const articles = data.articles || [];
                
                loadingEl.classList.add('hidden');
                
                if (articles.length === 0) {
                    emptyEl.classList.remove('hidden');
                    return;
                }
                
                gridEl.classList.remove('hidden');
                gridEl.classList.add('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
                
                // Render articles
                gridEl.innerHTML = articles.map(article => `
                    <a
                        href="/blog/${article.urlid}.html"
                        class="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                    >
                        ${article.img_urls?.[0] ? `
                            <img
                                src="${article.img_urls[0]}"
                                alt="${article.title}"
                                class="w-full h-48 object-cover"
                            />
                        ` : ''}
                        <div class="p-6">
                            <h2 class="text-xl font-semibold mb-2">${article.title}</h2>
                            <p class="text-sm text-gray-600 mb-2">
                                ${new Date(article.created_at).toLocaleDateString()}
                            </p>
                            ${article.paragraph ? `
                                <p class="text-gray-700 line-clamp-3">
                                    ${article.paragraph.substring(0, 150)}...
                                </p>
                            ` : ''}
                        </div>
                    </a>
                `).join('');
                
            } catch (error) {
                console.error('Error loading articles:', error);
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
            }
        }
        
        // Load articles when page loads
        loadArticles();
    </script>
</body>
</html>
```

### Step 2: Create Article Detail Page

For static hosting, you have a few options:

#### Option A: Single HTML file with URL parameter

Create `blog/article.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article - Your Site Name</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Or use your existing TailwindCSS setup -->
</head>
<body>
    <!-- Your existing header/nav -->
    
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- Loading state -->
        <div id="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p class="mt-4 text-gray-600">Loading article...</p>
        </div>
        
        <!-- Error state -->
        <div id="error" class="hidden text-center py-12">
            <h1 class="text-2xl font-bold mb-4">Article Not Found</h1>
            <a href="/blog/index.html" class="text-blue-600 hover:underline">← Back to Blog</a>
        </div>
        
        <!-- Article content -->
        <div id="article-content" class="hidden">
            <a href="/blog/index.html" class="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Blog
            </a>
            
            <article id="article-body">
                <!-- Article will be inserted here by JavaScript -->
            </article>
        </div>
    </div>
    
    <!-- Your existing footer -->
    
    <script>
        // Replace {website_name} with your actual website identifier
        const sourceIds = "{website_name}_projects_review,{website_name}_personalized_article";
        
        async function loadArticle() {
            const loadingEl = document.getElementById('loading');
            const errorEl = document.getElementById('error');
            const contentEl = document.getElementById('article-content');
            const articleBodyEl = document.getElementById('article-body');
            
            // Get urlid from URL parameter or pathname
            const urlParams = new URLSearchParams(window.location.search);
            let urlid = urlParams.get('urlid');
            
            // If no query param, try to extract from pathname
            if (!urlid) {
                const pathMatch = window.location.pathname.match(/\/blog\/([^\/]+)/);
                urlid = pathMatch ? pathMatch[1] : null;
            }
            
            if (!urlid) {
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
                return;
            }
            
            try {
                const response = await fetch(
                    `https://zthype.deno.dev/api/get_article?urlid=${encodeURIComponent(urlid)}&source_ids=${encodeURIComponent(sourceIds)}`
                );
                
                if (!response.ok) {
                    throw new Error('Article not found');
                }
                
                const data = await response.json();
                
                if (!data.success || !data.article) {
                    throw new Error('Article not found');
                }
                
                const { article, paragraphs } = data;
                
                // Update page title
                document.title = `${article.title} - Your Site Name`;
                
                // Update meta description if needed
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc) {
                    metaDesc.setAttribute('content', article.paragraph || article.title);
                }
                
                // Render article
                let articleHTML = `
                    <h1 class="text-4xl font-bold mb-4">${article.title}</h1>
                    <p class="text-sm text-gray-600 mb-8">
                        Published ${new Date(article.created_at).toLocaleDateString()}
                    </p>
                `;
                
                if (article.paragraph) {
                    articleHTML += `<p class="text-lg mb-6">${article.paragraph}</p>`;
                }
                
                paragraphs.forEach(para => {
                    articleHTML += '<div class="mb-6">';
                    
                    if (para.header) {
                        articleHTML += `<h2 class="text-2xl font-semibold mb-3">${para.header}</h2>`;
                    }
                    
                    if (para.img_url) {
                        articleHTML += `
                            <img
                                src="${para.img_url}"
                                alt="${para.header || 'Article image'}"
                                class="w-full rounded-lg mb-4"
                            />
                        `;
                    }
                    
                    articleHTML += `<p class="mb-4 whitespace-pre-line">${para.content}</p>`;
                    
                    if (para.project_link || para.project_zt_link) {
                        articleHTML += '<div class="flex gap-4">';
                        
                        if (para.project_link) {
                            articleHTML += `
                                <a
                                    href="${para.project_link}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-blue-600 hover:underline"
                                >
                                    View Project →
                                </a>
                            `;
                        }
                        
                        if (para.project_zt_link) {
                            articleHTML += `
                                <a
                                    href="${para.project_zt_link}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-blue-600 hover:underline"
                                >
                                    Project on Zwolnieni z Teorii →
                                </a>
                            `;
                        }
                        
                        articleHTML += '</div>';
                    }
                    
                    articleHTML += '</div>';
                });
                
                articleBodyEl.innerHTML = articleHTML;
                
                loadingEl.classList.add('hidden');
                contentEl.classList.remove('hidden');
                
            } catch (error) {
                console.error('Error loading article:', error);
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
            }
        }
        
        // Load article when page loads
        loadArticle();
    </script>
</body>
</html>
```

#### Option B: Hash-based routing (Single Page Application style)

If you prefer a single-page approach, you can use hash-based routing:

```html
<!-- In blog/index.html, update links to use hash: -->
<a href="#/blog/${article.urlid}">...</a>

<!-- Then add JavaScript to handle hash changes -->
<script>
    function handleRoute() {
        const hash = window.location.hash;
        if (hash.startsWith('#/blog/')) {
            const urlid = hash.replace('#/blog/', '');
            // Load article content dynamically
            loadArticle(urlid);
        } else {
            // Show blog listing
            showBlogListing();
        }
    }
    
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
</script>
```

#### Option C: Server-side URL rewriting

If your hosting supports it (e.g., Netlify, Vercel, GitHub Pages with Jekyll), configure URL rewriting:

**For Netlify** (`netlify.toml`):
```toml
[[redirects]]
  from = "/blog/*"
  to = "/blog/article.html?urlid=:splat"
  status = 200
```

**For Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/blog/:urlid",
      "destination": "/blog/article.html?urlid=:urlid"
    }
  ]
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

3. **Test locally:**
   - Open `blog/index.html` in a browser (you may need a local server due to CORS)
   - Use a simple HTTP server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server -p 8000
     
     # PHP
     php -S localhost:8000
     ```
   - Visit:
     - `http://localhost:8000/blog/index.html` - Blog listing
     - `http://localhost:8000/blog/article.html?urlid=test` - Individual article (if using query params)

## Notes

- The API includes CORS headers, so it can be called from any domain
- All timestamps are Unix timestamps in milliseconds
- Images may be empty strings in arrays - handle gracefully
- Some paragraphs may not have headers, images, or links - all fields are optional
- The API returns up to 40 articles in the list endpoint
- Source IDs are case-sensitive
- For local development, you may need a local server to avoid CORS issues (though the API has CORS enabled)
- Consider using a build tool or bundler if you want to organize your JavaScript into modules

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

After implementing the blog pages, please also create the ZTHype configuration files needed for article generation. These files should be created in a `zthype_config/` directory (or wherever appropriate for the ZTHype system setup).

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

