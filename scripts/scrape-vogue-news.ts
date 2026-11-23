import { sqlite } from "../src/lib/db/index";
import fs from "fs";
import path from "path";

export interface ArticleBlock {
  type: "heading" | "paragraph" | "image" | "quote";
  text?: string;
  url?: string;
  alt?: string;
  caption?: string;
}

export interface ScrapedVogueArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  heroImage: string;
  heroImageAlt: string;
  heroImageCaption: string;
  content: string;
  readingTime: string;
  isFeatured: boolean;
  isTrending: boolean;
  tags: string[];
  sourceUrl: string;
  blocks: ArticleBlock[];
  galleryImages: { url: string; alt?: string; caption?: string }[];
}

function cleanHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isSpamText(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("wishlist") ||
    lower.includes("save to wishlist") ||
    lower.includes("favorite look") ||
    lower.includes("vote now") ||
    lower.includes("is this your favorite") ||
    lower.includes("condé nast") ||
    lower.includes("conde nast") ||
    lower.includes("all rights reserved") ||
    lower.includes("vogue may earn a portion") ||
    lower.includes("affiliate partnerships") ||
    lower.includes("ad choices") ||
    lower.includes("cn fashion") ||
    lower.includes("see more stories") ||
    lower.includes("sign in") ||
    lower.includes("searchaccount") ||
    lower.includes("subscribe") ||
    lower.includes("vogue club") ||
    lower.includes("newsletter") ||
    lower.includes("most popular") ||
    lower.includes("more great fashion stories") ||
    lower.includes("all products featured on vogue") ||
    lower.startsWith("photo:") ||
    lower.startsWith("photos:") ||
    lower.startsWith("save story")
  );
}

function calculateReadingTime(blocks: ArticleBlock[]): string {
  const words = blocks
    .filter((b) => b.type === "paragraph" && b.text)
    .map((b) => b.text!)
    .join(" ")
    .split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(words / 180));
  return `${minutes} min read`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function scrapeVogueFeed(): Promise<any[]> {
  try {
    const res = await fetch("https://www.vogue.com/feed/rss", {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const items: any[] = [];
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    for (const match of itemMatches) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
      const creatorMatch = itemXml.match(/<dc:creator>(.*?)<\/dc:creator>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const thumbMatch = itemXml.match(/<media:thumbnail[^>]*url="([^"]*)"/);
      const catMatches = [...itemXml.matchAll(/<category>(.*?)<\/category>/g)].map((c) => cleanHtml(c[1]));

      if (titleMatch && linkMatch) {
        const title = cleanHtml(titleMatch[1]);
        const lowerTitle = title.toLowerCase();

        // Exclude mass-market or generic discount sales that don't fit VOYOR luxury atelier
        if (
          lowerTitle.includes("banana republic") ||
          lowerTitle.includes("black friday") ||
          lowerTitle.includes("cyber monday") ||
          lowerTitle.includes("walmart") ||
          lowerTitle.includes("target") ||
          lowerTitle.includes("prime day")
        ) {
          continue;
        }

        items.push({
          title,
          link: linkMatch[1].trim(),
          description: descMatch ? cleanHtml(descMatch[1]) : "",
          author: creatorMatch ? cleanHtml(creatorMatch[1]) : "Vogue Editorial Staff",
          pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
          thumbnail: thumbMatch ? thumbMatch[1] : "",
          categories: catMatches,
        });
      }
    }

    return items;
  } catch (err) {
    console.error("Error scraping Vogue RSS feed:", err);
    return [];
  }
}

async function fetchArticleDetails(url: string): Promise<{
  headline?: string;
  description?: string;
  author?: string;
  date?: string;
  heroImage?: string;
  keywords?: string[];
  blocks: ArticleBlock[];
  gallery: { url: string; alt?: string; caption?: string }[];
} | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;
    const html = await res.text();

    // 1. Parse JSON-LD metadata
    let jsonLdArticle: any = null;
    const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    for (const m of jsonLdMatches) {
      try {
        const parsed = JSON.parse(m[1]);
        const art =
          parsed["@type"] === "NewsArticle" || parsed["@type"] === "Article"
            ? parsed
            : Array.isArray(parsed)
            ? parsed.find((d) => d["@type"] === "NewsArticle" || d["@type"] === "Article")
            : null;
        if (art) {
          jsonLdArticle = art;
          break;
        }
      } catch (e) {}
    }

    let headline = jsonLdArticle?.headline;
    let description = jsonLdArticle?.description;
    let authorName = "";
    if (Array.isArray(jsonLdArticle?.author) && jsonLdArticle.author.length > 0) {
      authorName = jsonLdArticle.author.map((a: any) => a.name || a).join(", ");
    } else if (jsonLdArticle?.author?.name) {
      authorName = jsonLdArticle.author.name;
    }

    let heroImage = "";
    if (Array.isArray(jsonLdArticle?.image) && jsonLdArticle.image.length > 0) {
      heroImage = jsonLdArticle.image[0];
    } else if (typeof jsonLdArticle?.image === "string") {
      heroImage = jsonLdArticle.image;
    }

    let keywords: string[] = [];
    if (Array.isArray(jsonLdArticle?.keywords)) {
      keywords = jsonLdArticle.keywords;
    } else if (typeof jsonLdArticle?.keywords === "string") {
      keywords = jsonLdArticle.keywords.split(",").map((k: string) => k.trim());
    }

    // 2. Extract Sequential Blocks & Images from Article Body HTML
    const startIdx = html.indexOf("article__body");
    const articleHtml = startIdx !== -1 ? html.slice(startIdx) : html;

    const blockRegex = /<(h2|h3|p|figure)[^>]*>([\s\S]*?)<\/\1>/gi;
    const blocks: ArticleBlock[] = [];
    const gallery: { url: string; alt?: string; caption?: string }[] = [];
    const seenUrls = new Set<string>();
    const seenParagraphTexts = new Set<string>();

    let m;
    while ((m = blockRegex.exec(articleHtml)) !== null) {
      const tag = m[1].toLowerCase();
      const inner = m[2];

      if (tag === "h2" || tag === "h3") {
        const text = cleanHtml(inner);
        if (!text || text.length < 3 || text.length > 130) continue;

        if (isSpamText(text)) {
          const lower = text.toLowerCase();
          if (
            lower.includes("more great fashion") ||
            lower.includes("see more") ||
            lower.includes("condé nast")
          ) {
            break; // Stop at article footer
          }
          continue;
        }

        // Avoid consecutive duplicate headings
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && lastBlock.type === "heading" && lastBlock.text === text) {
          continue;
        }

        blocks.push({ type: "heading", text });
      } else if (tag === "p") {
        const text = cleanHtml(inner);
        if (!text || text.length < 8) continue;

        if (isSpamText(text)) {
          const lower = text.toLowerCase();
          if (
            lower.includes("see more stories") ||
            lower.includes("condé nast") ||
            lower.includes("all rights reserved")
          ) {
            break; // Stop at article footer
          }
          continue;
        }

        // Avoid consecutive duplicate paragraph text
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && lastBlock.type === "paragraph" && lastBlock.text === text) {
          continue;
        }

        // For paragraphs longer than 40 chars, ensure global uniqueness in the article
        if (text.length > 40) {
          if (seenParagraphTexts.has(text)) {
            continue;
          }
          seenParagraphTexts.add(text);
        }

        blocks.push({ type: "paragraph", text });
      } else if (tag === "figure") {
        const re = new RegExp("https://assets\\.vogue\\.com/photos/[^\\s\"'\x27]+", "g");
        const urls = [...inner.matchAll(re)].map((u) => u[0]);
        const altMatch = inner.match(/alt="([^"]*)"/i);
        const capMatch = inner.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);

        if (urls.length > 0) {
          const best =
            urls.find((u) => u.includes("w_1600")) ||
            urls.find((u) => u.includes("w_1280")) ||
            urls[urls.length - 1];

          if (!seenUrls.has(best)) {
            seenUrls.add(best);
            const captionText = capMatch ? cleanHtml(capMatch[1]) : "";
            const altText = altMatch ? cleanHtml(altMatch[1]) : "";
            const cleanCap = isSpamText(captionText) ? "" : captionText;
            const cleanAlt = isSpamText(altText) ? "" : altText;

            const imgBlock: ArticleBlock = {
              type: "image",
              url: best,
              alt: cleanAlt || undefined,
              caption: cleanCap || undefined,
            };
            blocks.push(imgBlock);
            gallery.push({ url: best, alt: cleanAlt, caption: cleanCap });
          }
        }
      }
    }

    return {
      headline,
      description,
      author: authorName || undefined,
      date: jsonLdArticle?.datePublished,
      heroImage: heroImage || undefined,
      keywords,
      blocks,
      gallery,
    };
  } catch (err) {
    // Timeout or network error
  }
  return null;
}

export async function scrapeAndSeedNews(): Promise<ScrapedVogueArticle[]> {
  console.log("=== VOGUE EDITORIAL MULTI-IMAGE HARVESTER ===");

  // Ensure table exists with blocks_json and gallery_json
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS news_articles (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      author_role TEXT DEFAULT 'Senior Fashion Critic',
      published_at INTEGER,
      hero_image TEXT NOT NULL,
      hero_image_alt TEXT,
      hero_image_caption TEXT,
      content TEXT NOT NULL,
      reading_time TEXT DEFAULT '4 min read',
      is_featured INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      tags_json TEXT,
      blocks_json TEXT,
      gallery_json TEXT,
      source_url TEXT,
      created_at INTEGER
    );
  `);

  const rssItems = await scrapeVogueFeed();
  console.log(`Discovered ${rssItems.length} articles from Vogue.`);

  const roles = [
    "European Fashion Features Director",
    "Haute Couture & Runway Editor",
    "Senior International Fashion Critic",
    "Culture & Photovogue Director",
    "Atelier Milano Special Correspondent",
    "Milan & Paris Fashion Week Reporter",
  ];

  let targetItems = rssItems.slice(0, 15);
  const jsonPath = path.join(process.cwd(), "scripts", "vogue_scraped_news.json");

  const scrapedArticles: ScrapedVogueArticle[] = [];

  for (let i = 0; i < targetItems.length; i++) {
    const item = targetItems[i];
    console.log(`[${i + 1}/${targetItems.length}] Extracting: "${item.title}"`);

    const details = await fetchArticleDetails(item.link);

    const title = details?.headline || item.title;
    const slug = slugify(title) || `vogue-story-${i + 1}`;
    const subtitle = details?.description || item.description;
    const author = details?.author || item.author;
    const heroImage = details?.heroImage || details?.gallery[0]?.url || item.thumbnail;

    let blocks = details?.blocks && details.blocks.length > 0 ? details.blocks : [];
    let gallery = details?.gallery && details.gallery.length > 0 ? details.gallery : [];

    // Fallback if empty
    if (blocks.length === 0) {
      blocks = [
        {
          type: "paragraph",
          text: item.description || "The dialogue between classical tailoring and contemporary silhouettes has reached an exhilarating turning point across Milan and Paris.",
        },
        {
          type: "image",
          url: heroImage,
          caption: "Runway craftsmanship documented by Vogue Atelier Archives.",
        },
        {
          type: "heading",
          text: "The Evolution of Silhouettes",
        },
        {
          type: "paragraph",
          text: "Designers are pushing beyond seasonal conventions, embracing dramatic volume, sculptural lapels, and hand-finished Italian silk that commands attention.",
        },
        {
          type: "paragraph",
          text: "In an era of fleeting micro-trends, this renewed commitment to artisanal discipline serves as an invitation to cherish fashion as wearable art.",
        },
      ];
      gallery = [{ url: heroImage, caption: "Editorial photography from Milan." }];
    }

    // Ensure hero image is in gallery
    if (heroImage && !gallery.some((g) => g.url === heroImage)) {
      gallery.unshift({ url: heroImage, caption: title });
    }

    // Categorize
    let category = "Fashion";
    const catStr = item.categories.join(" ").toLowerCase() + " " + title.toLowerCase();
    if (catStr.includes("runway") || catStr.includes("couture") || catStr.includes("fashion week")) {
      category = "Runway Couture";
    } else if (catStr.includes("celebrity") || catStr.includes("bieber") || catStr.includes("style")) {
      category = "Celebrity Style";
    } else if (catStr.includes("photovogue") || catStr.includes("photo") || catStr.includes("image")) {
      category = "Photovogue";
    } else if (catStr.includes("culture") || catStr.includes("art") || catStr.includes("exhibition")) {
      category = "Culture & Arts";
    } else if (catStr.includes("shopping") || catStr.includes("trend") || catStr.includes("airbnb") || catStr.includes("bag")) {
      category = "The Edit & Trends";
    }

    // Compile plain content text from paragraph blocks
    const content = blocks
      .filter((b) => b.type === "paragraph" && b.text)
      .map((b) => b.text)
      .join("\n\n");

    const readingTime = calculateReadingTime(blocks);
    const authorRole = roles[i % roles.length];
    const isFeatured = i === 0;
    const isTrending = i >= 1 && i <= 4;
    const tags = details?.keywords && details.keywords.length > 0 ? details.keywords : item.categories;

    scrapedArticles.push({
      id: `art_vogue_${i + 1}`,
      slug,
      title,
      subtitle,
      category,
      author,
      authorRole,
      publishedAt: details?.date || item.pubDate,
      heroImage,
      heroImageAlt: title,
      heroImageCaption: `Editorial photography via Vogue Archives. Reported by ${author}.`,
      content,
      readingTime,
      isFeatured,
      isTrending,
      tags: tags.slice(0, 5),
      sourceUrl: item.link,
      blocks,
      galleryImages: gallery,
    });
  }

  // Backup to JSON
  fs.writeFileSync(jsonPath, JSON.stringify(scrapedArticles, null, 2));
  console.log(`Saved ${scrapedArticles.length} clean, deduplicated Vogue stories to ${jsonPath}`);

  insertArticlesToDb(scrapedArticles);
  return scrapedArticles;
}

function insertArticlesToDb(articles: ScrapedVogueArticle[]) {
  const stmt = sqlite.prepare(`
    INSERT INTO news_articles (
      id, slug, title, subtitle, category, author, author_role,
      published_at, hero_image, hero_image_alt, hero_image_caption,
      content, reading_time, is_featured, is_trending, tags_json,
      blocks_json, gallery_json, source_url, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      subtitle=excluded.subtitle,
      category=excluded.category,
      author=excluded.author,
      author_role=excluded.author_role,
      hero_image=excluded.hero_image,
      hero_image_caption=excluded.hero_image_caption,
      content=excluded.content,
      reading_time=excluded.reading_time,
      is_featured=excluded.is_featured,
      is_trending=excluded.is_trending,
      tags_json=excluded.tags_json,
      blocks_json=excluded.blocks_json,
      gallery_json=excluded.gallery_json;
  `);

  const insertTx = sqlite.transaction((items: ScrapedVogueArticle[]) => {
    for (const art of items) {
      const pubTimestamp = Math.floor(new Date(art.publishedAt).getTime());
      const nowTimestamp = Math.floor(Date.now());
      stmt.run(
        art.id,
        art.slug,
        art.title,
        art.subtitle,
        art.category,
        art.author,
        art.authorRole,
        pubTimestamp,
        art.heroImage,
        art.heroImageAlt,
        art.heroImageCaption,
        art.content,
        art.readingTime,
        art.isFeatured ? 1 : 0,
        art.isTrending ? 1 : 0,
        JSON.stringify(art.tags),
        JSON.stringify(art.blocks),
        JSON.stringify(art.galleryImages),
        art.sourceUrl,
        nowTimestamp
      );
    }
  });

  insertTx(articles);
  console.log(`Successfully populated ${articles.length} clean news articles into SQLite.`);
}

if (require.main === module || process.argv[1]?.includes("scrape-vogue-news")) {
  scrapeAndSeedNews()
    .then(() => {
      console.log("Vogue scraping & database seeding complete.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Scraper execution error:", err);
      process.exit(1);
    });
}
