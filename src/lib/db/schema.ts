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
  basePrice: real("base_price").notNull(),
  compareAtPrice: real("compare_at_price"),
  currency: text("currency").default("USD"),
  isNew: integer("is_new", { mode: "boolean" }).default(false),
  isBestseller: integer("is_bestseller", { mode: "boolean" }).default(false),
  isRunway: integer("is_runway", { mode: "boolean" }).default(false),
  composition: text("composition"),
  origin: text("origin").default("Made in Italy"),
  detailsJson: text("details_json"),
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
  colorName: text("color_name"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  displayOrder: integer("display_order").default(0),
});

export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  size: text("size").notNull(),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
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
  status: text("status").default("confirmed"),
  shippingAddress: text("shipping_address").notNull(),
  itemsJson: text("items_json").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  title: text("title").default("Mr."),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  country: text("country").default("Indonesia"),
  phone: text("phone"),
  role: text("role").default("client"),
  failedAttempts: integer("failed_attempts").default(0),
  lockoutUntil: integer("lockout_until"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const userSessions = sqliteTable("user_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  sessionTokenHash: text("session_token_hash").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const authRateLimits = sqliteTable("auth_rate_limits", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  attempts: integer("attempts").default(1),
  firstAttemptAt: integer("first_attempt_at").notNull(),
  lastAttemptAt: integer("last_attempt_at").notNull(),
});

export const userWishlists = sqliteTable("user_wishlists", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const userAddresses = sqliteTable("user_addresses", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  label: text("label").default("Residence"),
  recipientName: text("recipient_name").notNull(),
  phone: text("phone").notNull(),
  streetAddress: text("street_address").notNull(),
  suite: text("suite"),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const userAppointments = sqliteTable("user_appointments", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  referenceCode: text("reference_code").notNull().unique(),
  boutiqueName: text("boutique_name").notNull(),
  boutiqueCity: text("boutique_city").notNull(),
  boutiqueAddress: text("boutique_address").notNull(),
  appointmentType: text("appointment_type").notNull(),
  serviceType: text("service_type").default("Haute Couture Styling"),
  date: text("date").notNull(),
  timeSlot: text("time_slot").notNull(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone").notNull(),
  notes: text("notes"),
  status: text("status").default("Confirmed"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const newsArticles = sqliteTable("news_articles", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorRole: text("author_role").default("Senior Fashion Critic"),
  publishedAt: integer("published_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  heroImage: text("hero_image").notNull(),
  heroImageAlt: text("hero_image_alt"),
  heroImageCaption: text("hero_image_caption"),
  content: text("content").notNull(),
  readingTime: text("reading_time").default("4 min read"),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  isTrending: integer("is_trending", { mode: "boolean" }).default(false),
  tagsJson: text("tags_json"),
  blocksJson: text("blocks_json"),
  galleryJson: text("gallery_json"),
  sourceUrl: text("source_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
