import { db } from "./index";
import { categories, products, productImages, productVariants, cartItems, newsArticles } from "./schema";
import { eq, desc, asc, or, and, ne } from "drizzle-orm";
import { Product, Category, CartItemDetailed, NewsArticle } from "../types";

export function getAllCategories(): Category[] {
  const cats = db.select().from(categories).orderBy(asc(categories.displayOrder)).all();
  return cats.map((c) => ({
    ...c,
    isFeatured: Boolean(c.isFeatured),
    displayOrder: c.displayOrder ?? 0,
  }));
}

export function getAllProducts(): Product[] {
  const allProds = db.select().from(products).orderBy(desc(products.isRunway), desc(products.createdAt)).all();
  if (allProds.length === 0) return [];

  const allImgs = db.select().from(productImages).orderBy(desc(productImages.isPrimary), asc(productImages.displayOrder)).all();
  const allVars = db.select().from(productVariants).all();

  const imgsByProdId = new Map<string, typeof allImgs>();
  for (const img of allImgs) {
    let list = imgsByProdId.get(img.productId);
    if (!list) {
      list = [];
      imgsByProdId.set(img.productId, list);
    }
    list.push(img);
  }

  const varsByProdId = new Map<string, typeof allVars>();
  for (const v of allVars) {
    let list = varsByProdId.get(v.productId);
    if (!list) {
      list = [];
      varsByProdId.set(v.productId, list);
    }
    list.push(v);
  }

  return allProds.map((prod) => ({
    ...prod,
    currency: prod.currency ?? "USD",
    isNew: Boolean(prod.isNew),
    isBestseller: Boolean(prod.isBestseller),
    isRunway: Boolean(prod.isRunway),
    origin: prod.origin ?? "Made in Italy",
    images: (imgsByProdId.get(prod.id) || []).map((img) => ({
      ...img,
      isPrimary: Boolean(img.isPrimary),
      displayOrder: img.displayOrder ?? 0,
    })),
    variants: (varsByProdId.get(prod.id) || []).map((v) => ({
      ...v,
      stockQuantity: v.stockQuantity ?? 10,
      priceDelta: v.priceDelta ?? 0,
    })),
  }));
}

export function getProductBySlug(slug: string): Product | null {
  const prod = db.select().from(products).where(eq(products.slug, slug)).get();
  if (!prod) return null;
  return attachImagesAndVariants(prod);
}

export function getProductsByCategory(categorySlug: string): { category: Category | null; products: Product[] } {

  const resolvedSlug =
    categorySlug === "accessories"
      ? "leather-goods"
      : categorySlug === "shoes-footwear"
      ? "shoes"
      : categorySlug === "jewels" || categorySlug === "jewellery"
      ? "jewelry"
      : categorySlug;

  const cat =
    db.select().from(categories).where(eq(categories.slug, resolvedSlug)).get() ||
    db.select().from(categories).where(eq(categories.slug, categorySlug)).get();

  if (!cat) return { category: null, products: [] };

  const prods =
    cat.slug === "runway-couture"
      ? db
          .select()
          .from(products)
          .where(or(eq(products.categoryId, cat.id), eq(products.isRunway, true)))
          .all()
      : db.select().from(products).where(eq(products.categoryId, cat.id)).all();

  if (prods.length === 0) {
    return {
      category: {
        ...cat,
        isFeatured: Boolean(cat.isFeatured),
        displayOrder: cat.displayOrder ?? 0,
      },
      products: [],
    };
  }

  const prodIds = new Set(prods.map((p) => p.id));
  const allImgs = db.select().from(productImages).orderBy(desc(productImages.isPrimary), asc(productImages.displayOrder)).all();
  const allVars = db.select().from(productVariants).all();

  const imgsByProdId = new Map<string, typeof allImgs>();
  for (const img of allImgs) {
    if (!prodIds.has(img.productId)) continue;
    let list = imgsByProdId.get(img.productId);
    if (!list) {
      list = [];
      imgsByProdId.set(img.productId, list);
    }
    list.push(img);
  }

  const varsByProdId = new Map<string, typeof allVars>();
  for (const v of allVars) {
    if (!prodIds.has(v.productId)) continue;
    let list = varsByProdId.get(v.productId);
    if (!list) {
      list = [];
      varsByProdId.set(v.productId, list);
    }
    list.push(v);
  }

  return {
    category: {
      ...cat,
      isFeatured: Boolean(cat.isFeatured),
      displayOrder: cat.displayOrder ?? 0,
    },
    products: prods.map((prod) => ({
      ...prod,
      currency: prod.currency ?? "USD",
      isNew: Boolean(prod.isNew),
      isBestseller: Boolean(prod.isBestseller),
      isRunway: Boolean(prod.isRunway),
      origin: prod.origin ?? "Made in Italy",
      images: (imgsByProdId.get(prod.id) || []).map((img) => ({
        ...img,
        isPrimary: Boolean(img.isPrimary),
        displayOrder: img.displayOrder ?? 0,
      })),
      variants: (varsByProdId.get(prod.id) || []).map((v) => ({
        ...v,
        stockQuantity: v.stockQuantity ?? 10,
        priceDelta: v.priceDelta ?? 0,
      })),
    })),
  };
}

export function getRunwayProducts(): Product[] {
  const prods = db.select().from(products).where(eq(products.isRunway, true)).all();
  return prods.map(attachImagesAndVariants);
}

function attachImagesAndVariants(prod: typeof products.$inferSelect): Product {
  const imgs = db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, prod.id))
    .orderBy(desc(productImages.isPrimary), asc(productImages.displayOrder))
    .all()
    .map((img) => ({
      ...img,
      isPrimary: Boolean(img.isPrimary),
      displayOrder: img.displayOrder ?? 0,
    }));

  const vars = db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, prod.id))
    .all()
    .map((v) => ({
      ...v,
      stockQuantity: v.stockQuantity ?? 10,
      priceDelta: v.priceDelta ?? 0,
    }));

  return {
    ...prod,
    currency: prod.currency ?? "USD",
    isNew: Boolean(prod.isNew),
    isBestseller: Boolean(prod.isBestseller),
    isRunway: Boolean(prod.isRunway),
    origin: prod.origin ?? "Made in Italy",
    images: imgs,
    variants: vars,
  };
}

export function getCartItemsDetailed(sessionId: string): CartItemDetailed[] {
  const items = db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId)).all();
  const detailed: CartItemDetailed[] = [];

  for (const item of items) {
    const variant = db.select().from(productVariants).where(eq(productVariants.id, item.variantId)).get();
    if (!variant) continue;

    const prod = db.select().from(products).where(eq(products.id, variant.productId)).get();
    if (!prod) continue;

    const allImgs = db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, prod.id))
      .orderBy(desc(productImages.isPrimary))
      .all();

    const matchingColorImg = variant.colorName
      ? allImgs.find((img) => img.colorName && img.colorName.toLowerCase() === variant.colorName.toLowerCase())
      : null;
    const itemImg = matchingColorImg ?? allImgs[0];

    detailed.push({
      id: item.id,
      quantity: item.quantity,
      variant: {
        ...variant,
        stockQuantity: variant.stockQuantity ?? 10,
        priceDelta: variant.priceDelta ?? 0,
      },
      product: {
        id: prod.id,
        slug: prod.slug,
        name: prod.name,
        subtitle: prod.subtitle,
        basePrice: prod.basePrice,
        image: itemImg?.url ?? "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600",
      },
    });
  }

  return detailed;
}

function mapArticle(raw: any): NewsArticle {
  let tags: string[] = [];
  try {
    if (raw.tagsJson) {
      tags = JSON.parse(raw.tagsJson);
    }
  } catch {}

  let blocks: any[] | undefined = undefined;
  try {
    if (raw.blocksJson) {
      blocks = JSON.parse(raw.blocksJson);
    }
  } catch {}

  let galleryImages: any[] | undefined = undefined;
  try {
    if (raw.galleryJson) {
      galleryImages = JSON.parse(raw.galleryJson);
    }
  } catch {}

  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle ?? null,
    category: raw.category,
    author: raw.author,
    authorRole: raw.authorRole ?? "Senior Fashion Critic",
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : new Date(),
    heroImage: raw.heroImage,
    heroImageAlt: raw.heroImageAlt ?? raw.title,
    heroImageCaption: raw.heroImageCaption ?? null,
    content: raw.content,
    readingTime: raw.readingTime ?? "4 min read",
    isFeatured: Boolean(raw.isFeatured),
    isTrending: Boolean(raw.isTrending),
    tags,
    sourceUrl: raw.sourceUrl ?? null,
    blocks,
    galleryImages,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : undefined,
  };
}

export function getAllNewsArticles(): NewsArticle[] {
  try {
    const rows = db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt), desc(newsArticles.createdAt))
      .all();
    return rows.map(mapArticle);
  } catch (err) {
    console.error("Error fetching news articles:", err);
    return [];
  }
}

export function getNewsArticleBySlug(slug: string): NewsArticle | null {
  try {
    const row = db.select().from(newsArticles).where(eq(newsArticles.slug, slug)).get();
    if (!row) return null;
    return mapArticle(row);
  } catch (err) {
    console.error("Error fetching news article by slug:", err);
    return null;
  }
}

export function getFeaturedNewsArticle(): NewsArticle | null {
  try {
    const row = db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.isFeatured, true))
      .orderBy(desc(newsArticles.publishedAt))
      .get();
    if (row) return mapArticle(row);

    const fallback = db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt))
      .get();
    return fallback ? mapArticle(fallback) : null;
  } catch (err) {
    console.error("Error fetching featured news article:", err);
    return null;
  }
}

export function getTrendingNewsArticles(limit: number = 4): NewsArticle[] {
  try {
    const rows = db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.isTrending, true))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit)
      .all();

    if (rows.length >= limit) return rows.map(mapArticle);

    // If not enough trending, fill with recent
    const ids = rows.map((r) => r.id);
    const fillRows = db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.isFeatured, false))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit)
      .all();

    const combined = [...rows];
    for (const r of fillRows) {
      if (!ids.includes(r.id) && combined.length < limit) {
        combined.push(r);
      }
    }
    return combined.map(mapArticle);
  } catch (err) {
    console.error("Error fetching trending news articles:", err);
    return [];
  }
}

export function getRelatedNewsArticles(currentSlug: string, category: string, limit: number = 3): NewsArticle[] {
  try {
    const rows = db
      .select()
      .from(newsArticles)
      .where(and(ne(newsArticles.slug, currentSlug), eq(newsArticles.category, category)))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit)
      .all();

    if (rows.length >= limit) return rows.map(mapArticle);

    // Fallback: any other articles
    const otherRows = db
      .select()
      .from(newsArticles)
      .where(ne(newsArticles.slug, currentSlug))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit)
      .all();

    return otherRows.map(mapArticle);
  } catch (err) {
    console.error("Error fetching related news:", err);
    return [];
  }
}

