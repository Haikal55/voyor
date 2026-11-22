import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  heroImage: text("hero_image"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").default(0),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  description: text("description").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  basePrice: real("base_price").notNull(), // stored in USD
  compareAtPrice: real("compare_at_price"),
  currency: text("currency").default("USD"),
  isNew: integer("is_new", { mode: "boolean" }).default(false),
  isBestseller: integer("is_bestseller", { mode: "boolean" }).default(false),
  isRunway: integer("is_runway", { mode: "boolean" }).default(false),
  composition: text("composition"), // e.g. "100% Mulberry Silk Twill"
  origin: text("origin").default("Made in Italy"),
  detailsJson: text("details_json"), // JSON string array of bullet points
  careGuide: text("care_guide"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const productImages = sqliteTable("product_images", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").default(0),
});

export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  size: text("size").notNull(), // e.g. "IT 40", "IT 42", "IT 44" or "S", "M", "L"
  colorName: text("color_name").notNull(), // e.g. "Nero & Oro Barocco", "Deep Emerald"
  colorHex: text("color_hex").notNull(), // e.g. "#000000", "#1b4d3e"
  sku: text("sku").notNull().unique(),
  stockQuantity: integer("stock_quantity").default(10),
  priceDelta: real("price_delta").default(0),
});

export const cartItems = sqliteTable("cart_items", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  totalAmount: real("total_amount").notNull(),
  currency: text("currency").default("USD"),
  status: text("status").default("confirmed"), // pending, confirmed, dispatched, delivered
  shippingAddress: text("shipping_address").notNull(),
  itemsJson: text("items_json").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
