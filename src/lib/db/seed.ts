import { db, sqlite } from "./index";
import { categories, products, productImages, productVariants } from "./schema";
import fs from "fs";
import path from "path";

export function initDbAndSeed() {

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      hero_image TEXT,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      subtitle TEXT,
      description TEXT NOT NULL,
      category_id TEXT NOT NULL REFERENCES categories(id),
      base_price REAL NOT NULL,
      compare_at_price REAL,
      currency TEXT DEFAULT 'USD',
      is_new INTEGER DEFAULT 0,
      is_bestseller INTEGER DEFAULT 0,
      is_runway INTEGER DEFAULT 0,
      composition TEXT,
      origin TEXT DEFAULT 'Made in Italy',
      details_json TEXT,
      care_guide TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS product_images (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      url TEXT NOT NULL,
      alt TEXT NOT NULL,
      color_name TEXT,
      is_primary INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL REFERENCES products(id),
      size TEXT NOT NULL,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      stock_quantity INTEGER DEFAULT 10,
      price_delta REAL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      variant_id TEXT NOT NULL REFERENCES product_variants(id),
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      total_amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'confirmed',
      shipping_address TEXT NOT NULL,
      items_json TEXT NOT NULL,
      created_at INTEGER
    );

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

  // Seed news if empty
  try {
    const newsCount = sqlite.prepare("SELECT COUNT(*) as count FROM news_articles").get() as { count: number };
    if (!newsCount || newsCount.count === 0) {
      const newsJsonPath = path.join(process.cwd(), "scripts", "vogue_scraped_news.json");
      if (fs.existsSync(newsJsonPath)) {
        console.log("Seeding editorial news articles from Vogue archive...");
        const newsItems = JSON.parse(fs.readFileSync(newsJsonPath, "utf-8"));
        const stmt = sqlite.prepare(`
          INSERT OR REPLACE INTO news_articles (
            id, slug, title, subtitle, category, author, author_role,
            published_at, hero_image, hero_image_alt, hero_image_caption,
            content, reading_time, is_featured, is_trending, tags_json,
            blocks_json, gallery_json, source_url, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const art of newsItems) {
          stmt.run(
            art.id,
            art.slug,
            art.title,
            art.subtitle,
            art.category,
            art.author,
            art.authorRole,
            Math.floor(new Date(art.publishedAt).getTime()),
            art.heroImage,
            art.heroImageAlt,
            art.heroImageCaption,
            art.content,
            art.readingTime,
            art.isFeatured ? 1 : 0,
            art.isTrending ? 1 : 0,
            JSON.stringify(art.tags),
            JSON.stringify(art.blocks || []),
            JSON.stringify(art.galleryImages || []),
            art.sourceUrl,
            Date.now()
          );
        }
        console.log(`Seeded ${newsItems.length} Vogue news articles.`);
      }
    }
  } catch (err) {
    console.warn("Could not auto-seed news:", err);
  }

  if (process.argv.includes("--reset")) {
    sqlite.exec("DELETE FROM cart_items; DELETE FROM product_variants; DELETE FROM product_images; DELETE FROM products; DELETE FROM categories;");
  }
  const existingCount = sqlite.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (!process.argv.includes("--reset") && existingCount && existingCount.count > 0) {
    console.log("Database already seeded with", existingCount.count, "products.");
    return;
  }

  console.log("Seeding luxury fashion catalog for VOYOR from authentic Versace catalog...");

  const categoryData = [
    {
      id: "cat_runway",
      slug: "runway-couture",
      name: "Runway Fall/Winter 2026",
      description: "Direct from the Milan Salon: Sculpted silhouettes, gilded accents, and fearless Italian tailoring.",
      heroImage: "/images/categories/category-runway-versace.jpg",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      id: "cat_women",
      slug: "women",
      name: "Women's Collection",
      description: "High-voltage glamour: Evening gowns, printed silk separates, and corset tailoring.",
      heroImage: "/images/categories/category-women-versace.jpg",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      id: "cat_men",
      slug: "men",
      name: "Men's Collection",
      description: "Sharp Italian suiting, Barocco silk button-downs, and contemporary statement outerwear.",
      heroImage: "/images/categories/category-men-versace.jpg",
      isFeatured: true,
      displayOrder: 3,
    },
    {
      id: "cat_accessories",
      slug: "leather-goods",
      name: "Leather Goods & Bags",
      description: "Sculptural leather shoulder bags, gold hardware clasps, and high-fashion micro vanity cases.",
      heroImage: "/images/categories/category-accessories-versace.jpg",
      isFeatured: true,
      displayOrder: 4,
    },
    {
      id: "cat_shoes",
      slug: "shoes",
      name: "Shoes, Socks & Footwear",
      description: "Sculptural Italian runway sandals, Greca statement sneakers, and fine cotton ribbed socks.",
      heroImage: "/images/categories/category-shoes-versace.jpg",
      isFeatured: true,
      displayOrder: 5,
    },
    {
      id: "cat_jewelry",
      slug: "jewelry",
      name: "Fashion Jewelry & Jewels",
      description: "Sculptural Medusa gilded medallions, Greca crystal rings, and handcrafted tribute brass bracelets.",
      heroImage: "/images/categories/category-jewelry-versace.jpg",
      isFeatured: true,
      displayOrder: 6,
    },
    {
      id: "cat_parfumerie",
      slug: "haute-parfumerie",
      name: "Haute Parfumerie",
      description: "Olfactory masterpieces, exclusive atelier extraits de parfum, and artisanal Mediterranean essences.",
      heroImage: "/images/categories/category-parfumerie.jpg",
      isFeatured: false,
      displayOrder: 7,
    },
  ];

  for (const cat of categoryData) {
    db.insert(categories).values(cat).run();
  }

  const catalogPath = path.resolve(process.cwd(), "scraped_versace_catalog.json");
  if (!fs.existsSync(catalogPath)) {
    console.error("scraped_versace_catalog.json not found!");
    return;
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));

  for (const p of catalog) {
    db.insert(products).values({
      id: p.id,
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      categoryId: p.category_id,
      basePrice: p.base_price,
      compareAtPrice: p.base_price * 1.15,
      isNew: Boolean(p.is_new),
      isBestseller: Boolean(p.is_bestseller),
      isRunway: Boolean(p.is_runway),
      composition: p.composition,
      origin: p.origin,
      detailsJson: p.details_json,
      careGuide: p.care_guide,
    }).run();

    const seenImgUrls = new Set<string>();
    p.images.forEach((img: any, idx: number) => {
      if (seenImgUrls.has(img.url)) return;
      seenImgUrls.add(img.url);
      db.insert(productImages).values({
        id: `img_${p.id}_${idx + 1}`,
        productId: p.id,
        url: img.url,
        alt: img.alt,
        colorName: img.color_name,
        isPrimary: Boolean(img.is_primary),
        displayOrder: img.display_order || idx + 1,
      }).run();
    });

    const seenVarKeys = new Set<string>();
    let vIdx = 1;
    p.variants.forEach((v: any) => {
      const key = `${v.color_name}-${v.size}`;
      if (seenVarKeys.has(key)) return;
      seenVarKeys.add(key);
      db.insert(productVariants).values({
        id: `var_${p.id}_${vIdx}`,
        productId: p.id,
        size: v.size,
        colorName: v.color_name,
        colorHex: v.color_hex,
        sku: `${v.sku}-${vIdx++}`,
        stockQuantity: v.stock_quantity || 12,
        priceDelta: v.price_delta || 0,
      }).run();
    });
  }

  console.log("VOYOR luxury catalog seeded successfully!");
}

if (require.main === module) {
  initDbAndSeed();
}
