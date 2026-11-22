import { db } from "./index";
import { categories, products, productImages, productVariants, cartItems } from "./schema";
import { eq, desc, asc, or } from "drizzle-orm";
import { Product, Category, CartItemDetailed } from "../types";

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
  return allProds.map(attachImagesAndVariants);
}

export function getProductBySlug(slug: string): Product | null {
  const prod = db.select().from(products).where(eq(products.slug, slug)).get();
  if (!prod) return null;
  return attachImagesAndVariants(prod);
}

export function getProductsByCategory(categorySlug: string): { category: Category | null; products: Product[] } {
  const cat = db.select().from(categories).where(eq(categories.slug, categorySlug)).get();
  if (!cat) return { category: null, products: [] };

  const prods =
    cat.slug === "runway-couture"
      ? db
          .select()
          .from(products)
          .where(or(eq(products.categoryId, cat.id), eq(products.isRunway, true)))
          .all()
      : db.select().from(products).where(eq(products.categoryId, cat.id)).all();

  return {
    category: {
      ...cat,
      isFeatured: Boolean(cat.isFeatured),
      displayOrder: cat.displayOrder ?? 0,
    },
    products: prods.map(attachImagesAndVariants),
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

    const primaryImg = db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, prod.id))
      .orderBy(desc(productImages.isPrimary))
      .get();

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
        image: primaryImg?.url ?? "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600",
      },
    });
  }

  return detailed;
}
