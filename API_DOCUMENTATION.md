# Blog Article API Documentation

## Overview

The Blog Article API provides access to blog articles stored in the database. It retrieves article data along with processed paragraphs that are ready for display.

## Endpoint

**GET** `/api/get_article`

## Request Parameters

The API accepts the following query parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `urlid` | string | Yes | The unique identifier for the article (URL-friendly slug) |
| `source_ids` | string (comma-separated) | Yes | One or more source IDs to filter articles. Multiple IDs should be comma-separated (e.g., `"source1,source2"`) |

### Example Request

```
GET /api/get_article?urlid=spirr_wirtualne_wsparcie_psychiczne_dla_nastolatkow_w_twojej_kieszeni&source_ids=zt_hype_blog_projects_review,zt_hype_blog_personalized_article
```

## Response Format

### Success Response

**Status Code:** `200 OK`

**Headers:**
- `Access-Control-Allow-Origin: *`

**Response Body:**
```json
{
  "success": true,
  "article": {
    "type": "personalized" | "compilation",
    "title": "string",
    "urlid": "string",
    "source_id": "string",
    "url": "string",
    "order_ids": [number],
    "order_ids_count": number,
    "paragraph": "string",
    "generated_paragraphs": [string],
    "created_at": number,
    "img_urls": [string],
    "uuid": "string"
  },
  "paragraphs": [
    {
      "header": "string (optional)",
      "content": "string",
      "project_zt_link": "string (optional)",
      "project_link": "string (optional)",
      "img_url": "string (optional)"
    }
  ]
}
```

### Error Response

**Status Code:** `400 Bad Request`

**Headers:**
- `Access-Control-Allow-Origin: *`

**Response Body:**
```json
{
  "error": "Error message description"
}
```

## Data Structures

### Article Object

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Article type: `"personalized"` or `"compilation"` |
| `title` | string | Article title |
| `urlid` | string | URL-friendly unique identifier |
| `source_id` | string | Source identifier for the article |
| `url` | string | Full URL to the article |
| `order_ids` | number[] | Array of order IDs associated with the article |
| `order_ids_count` | number | Count of order IDs |
| `paragraph` | string | Main paragraph content (may be empty) |
| `generated_paragraphs` | string[] | Array of JSON-stringified paragraph objects (for personalized articles) |
| `created_at` | number | Unix timestamp (milliseconds) of article creation |
| `img_urls` | string[] | Array of image URLs associated with the article |
| `uuid` | string | Unique identifier for the article |

### Paragraph Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `header` | string | No | Section header/title |
| `content` | string | Yes | Paragraph content text |
| `project_zt_link` | string | No | Link to project on Zwolnieni z Teorii platform |
| `project_link` | string | No | Direct link to the project |
| `img_url` | string | No | Image URL for the paragraph |

## Special Cases

### Test Mode

If `urlid` is set to `"test"`, the API returns a test article from `config/test_article_response.json` without querying the database. This is useful for development and testing purposes.

**Example:**
```
GET /api/get_article?urlid=test&source_ids=any
```

## Error Handling

The API returns the following error messages:

1. **Missing Parameters** (400)
   - Occurs when `urlid` or `source_ids` are not provided
   - Response: `{"error": "Missing parameters"}`

2. **Article Not Found** (400)
   - Occurs when no article matches the provided `urlid` and `source_ids`
   - Response: `{"error": "Article not found"}`

3. **Database Error** (400)
   - Occurs when there's an error querying the database
   - Response: `{"error": "<error message>"}`

## Article Types

### Personalized Articles

Personalized articles are generated for a single order. The paragraphs are constructed from:
- `generated_paragraphs` array (JSON-stringified objects)
- Order data for project links (added to the last paragraph)
- Image URLs from `img_urls` array

The first paragraph typically has an empty header.

### Compilation Articles

Compilation articles combine multiple orders into a single article. The paragraphs are constructed from:
- Each order's project data (name, description, links)
- Sequential numbering (1., 2., 3., etc.) as headers
- Image URLs from `img_urls` array (matched by index)

## Usage Example

### JavaScript/TypeScript

```typescript
async function fetchArticle(urlid: string, sourceIds: string[]) {
  const sourceIdsParam = sourceIds.join(",");
  const response = await fetch(
    `/api/get_article?urlid=${urlid}&source_ids=${sourceIdsParam}`
  );
  
  const data = await response.json();
  
  if ('error' in data) {
    console.error('Error:', data.error);
    return null;
  }
  
  return {
    article: data.article,
    paragraphs: data.paragraphs
  };
}

// Usage
const result = await fetchArticle(
  "spirr_wirtualne_wsparcie_psychiczne_dla_nastolatkow_w_twojej_kieszeni",
  ["zt_hype_blog_projects_review", "zt_hype_blog_personalized_article"]
);
```

### cURL

```bash
curl "https://your-domain.com/api/get_article?urlid=example_article&source_ids=source1,source2"
```

## Response Processing

The API automatically processes articles to generate paragraph structures:

1. **For personalized articles:**
   - Parses JSON strings from `generated_paragraphs`
   - Adds project links to the last paragraph
   - Removes header from the first paragraph
   - Associates images by index

2. **For compilation articles:**
   - Fetches order data for each `order_id`
   - Creates numbered headers (1., 2., 3., etc.)
   - Uses order data for project information
   - Associates images by index

## CORS

The API includes CORS headers allowing cross-origin requests:
- `Access-Control-Allow-Origin: *`

## Notes

- The `source_ids` parameter accepts multiple comma-separated values for filtering
- The API queries the database using both `urlid` and `source_id` filters
- If multiple articles match, only the first result is returned
- Paragraph processing may fail silently for missing orders (errors are logged via Discord webhook)
- Image URLs are optional and may be empty strings in the array

