import Database from "better-sqlite3";
import fs from "fs";

const sqlite = new Database("voyor.db");

console.log("Seeding voyor.db with 100% authentic Versace scraped catalog...");

const catalog = JSON.parse(fs.readFileSync("scraped_versace_catalog.json", "utf8"));

const seedDb = sqlite.transaction(() => {
  sqlite.prepare("DELETE FROM cart_items").run();
  sqlite.prepare("DELETE FROM product_images").run();
  sqlite.prepare("DELETE FROM product_variants").run();
  sqlite.prepare("DELETE FROM products").run();
  sqlite.prepare("DELETE FROM categories").run();

  const insertCategory = sqlite.prepare(`
    INSERT INTO categories (id, slug, name, description, hero_image, is_featured, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const categoryData = [
    {
      id: "cat_runway",
      slug: "runway-couture",
      name: "Runway Fall/Winter 2026",
      description: "Direct from the Milan Salon: Sculpted silhouettes, gilded accents, and fearless Italian tailoring.",
      heroImage: "/images/categories/category-runway-versace.jpg",
      isFeatured: 1,
      displayOrder: 1,
    },
    {
      id: "cat_women",
      slug: "women",
      name: "Women's Collection",
      description: "High-voltage glamour: Evening gowns, printed silk separates, and corset tailoring.",
      heroImage: "/images/categories/category-women-versace.jpg",
      isFeatured: 1,
      displayOrder: 2,
    },
    {
      id: "cat_men",
      slug: "men",
      name: "Men's Tailoring & Silks",
      description: "Sharp Italian suiting, Barocco silk button-downs, and contemporary statement outerwear.",
      heroImage: "/images/categories/category-men-versace.jpg",
      isFeatured: 1,
      displayOrder: 3,
    },
    {
      id: "cat_accessories",
      slug: "leather-goods",
      name: "Leather Goods & Bags",
      description: "Sculptural leather shoulder bags, gold hardware clasps, and high-fashion micro vanity cases.",
      heroImage: "/images/categories/category-accessories-versace.jpg",
      isFeatured: 1,
      displayOrder: 4,
    },
    {
      id: "cat_shoes",
      slug: "shoes",
      name: "Shoes, Socks & Footwear",
      description: "Sculptural Italian runway sandals, Greca statement sneakers, and fine cotton ribbed socks.",
      heroImage: "/images/categories/category-shoes-versace.jpg",
      isFeatured: 1,
      displayOrder: 5,
    },
    {
      id: "cat_jewelry",
      slug: "jewelry",
      name: "Fashion Jewelry & Jewels",
      description: "Sculptural Medusa gilded medallions, Greca crystal rings, and handcrafted tribute brass bracelets.",
      heroImage: "/images/categories/category-jewelry-versace.jpg",
      isFeatured: 1,
      displayOrder: 6,
    },
    {
      id: "cat_parfumerie",
      slug: "haute-parfumerie",
      name: "Haute Parfumerie",
      description: "Olfactory masterpieces, exclusive atelier extraits de parfum, and artisanal Mediterranean essences.",
      heroImage: "/images/categories/category-parfumerie.jpg",
      isFeatured: 1,
      displayOrder: 7,
    },
  ];

  for (const c of categoryData) {
    insertCategory.run(c.id, c.slug, c.name, c.description, c.heroImage, c.isFeatured, c.displayOrder);
  }

  const insertProduct = sqlite.prepare(`
    INSERT INTO products (
      id, slug, name, subtitle, description, category_id,
      base_price, compare_at_price, currency, is_new,
      is_bestseller, is_runway, composition, origin,
      details_json, care_guide, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertVariant = sqlite.prepare(`
    INSERT INTO product_variants (
      id, product_id, size, color_name, color_hex, sku, stock_quantity, price_delta
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertImage = sqlite.prepare(`
    INSERT INTO product_images (
      id, product_id, url, alt, color_name, is_primary, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of catalog) {
    insertProduct.run(
      p.id,
      p.slug,
      p.name,
      p.subtitle,
      p.description,
      p.category_id,
      p.base_price,
      p.base_price * 1.15,
      p.currency || "USD",
      p.is_new ? 1 : 0,
      p.is_bestseller ? 1 : 0,
      p.is_runway ? 1 : 0,
      p.composition,
      p.origin,
      p.details_json,
      p.care_guide,
      Date.now()
    );

    const seenVarKeys = new Set();
    let vIdx = 1;
    for (const v of p.variants) {
      const key = `${v.color_name}-${v.size}`;
      if (seenVarKeys.has(key)) continue;
      seenVarKeys.add(key);

      const varId = `var_${p.id}_${vIdx++}`;
      insertVariant.run(
        varId,
        p.id,
        v.size,
        v.color_name,
        v.color_hex,
        `${v.sku}-${vIdx}`,
        v.stock_quantity || 10,
        v.price_delta || 0
      );
    }

    const seenImgUrls = new Set();
    let imgIdx = 1;
    for (const img of p.images) {
      if (seenImgUrls.has(img.url)) continue;
      seenImgUrls.add(img.url);

      const imgId = `img_${p.id}_${imgIdx++}`;
      insertImage.run(
        imgId,
        p.id,
        img.url,
        img.alt,
        img.color_name,
        img.is_primary ? 1 : 0,
        img.display_order || imgIdx
      );
    }
  }
});

seedDb();
console.log("Successfully seeded 100% authentic Versace catalog into voyor.db!");
