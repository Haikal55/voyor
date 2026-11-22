import { db, sqlite } from "./index";
import { categories, products, productImages, productVariants } from "./schema";

export function initDbAndSeed() {
  // Create tables directly if they don't exist
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
  `);

  // Check if data already exists
  const existingCount = sqlite.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (existingCount && existingCount.count > 0) {
    console.log("Database already seeded with", existingCount.count, "products.");
    return;
  }

  console.log("Seeding luxury fashion catalog for VOYOR...");

  const categoryData = [
    {
      id: "cat_runway",
      slug: "runway-couture",
      name: "Runway Fall/Winter 2026",
      description: "Direct from the Milan Salon: Sculpted silhouettes, gilded accents, and fearless Italian tailoring.",
      heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1800&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 1,
    },
    {
      id: "cat_women",
      slug: "women",
      name: "Women's Collection",
      description: "High-voltage glamour: Evening gowns, printed silk separates, and corset tailoring.",
      heroImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 2,
    },
    {
      id: "cat_men",
      slug: "men",
      name: "Men's Tailoring",
      description: "Sharp Italian suiting, Barocco silk button-downs, and contemporary statement outerwear.",
      heroImage: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1800&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 3,
    },
    {
      id: "cat_accessories",
      slug: "accessories",
      name: "Leather Goods & Bags",
      description: "Sculptural leather shoulder bags, gold hardware clasps, and high-fashion micro vanity cases.",
      heroImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1800&auto=format&fit=crop",
      isFeatured: true,
      displayOrder: 4,
    },
    {
      id: "cat_parfumerie",
      slug: "haute-parfumerie",
      name: "Haute Parfumerie & Jewels",
      description: "Olfactory masterpieces and 24-karat gold electroplated signature jewellery.",
      heroImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1800&auto=format&fit=crop",
      isFeatured: false,
      displayOrder: 5,
    },
  ];

  for (const cat of categoryData) {
    db.insert(categories).values(cat).run();
  }

  const productsData = [
    {
      id: "prod_01",
      slug: "voyor-barocco-silk-heritage-shirt",
      name: "Barocco D'Oro Silk Heritage Shirt",
      subtitle: "Runway FW26 Look 04",
      description: "A signature statement of the VOYOR Maison. Spun from heavyweight 100% Italian mulberry silk twill, adorned with our opulent archive Barocco gilded filigree. Features mother-of-pearl front buttons and a sculptured camp collar.",
      categoryId: "cat_men",
      basePrice: 1650,
      compareAtPrice: 1950,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "100% Mulberry Silk Twill",
      origin: "Handcrafted in Milan, Italy",
      detailsJson: JSON.stringify([
        "Signature VOYOR Barocco D'Oro hand-screened print",
        "Point collar with removable gilded collar stays",
        "Laser-engraved genuine mother-of-pearl buttons",
        "Buttoned barrel cuffs with gold-thread reinforcement",
        "Fluid relaxed cut with subtle side slits",
      ]),
      careGuide: "Specialist dry clean only. Protect gilded buttons during cleaning.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=1600&auto=format&fit=crop",
          alt: "Barocco D'Oro Silk Heritage Shirt - Front Editorial Look",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop",
          alt: "Barocco D'Oro Silk Heritage Shirt - Runway Model Styling",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "IT 46 (S)", colorName: "Nero & Oro Antico", colorHex: "#a7c080", sku: "VBRC-SHRT-46" },
        { size: "IT 48 (M)", colorName: "Nero & Oro Antico", colorHex: "#a7c080", sku: "VBRC-SHRT-48" },
        { size: "IT 50 (L)", colorName: "Nero & Oro Antico", colorHex: "#a7c080", sku: "VBRC-SHRT-50" },
        { size: "IT 52 (XL)", colorName: "Nero & Oro Antico", colorHex: "#a7c080", sku: "VBRC-SHRT-52" },
      ],
    },
    {
      id: "prod_02",
      slug: "medusa-corset-crepe-evening-gown",
      name: "Sculpted Atelier Corset Evening Gown",
      subtitle: "Couture Gala Edition",
      description: "Daring architectural glamour designed to command the red carpet. Engineered in fluid viscose cady with an internal boned corset that sculpts the waistline. Detailed with a dramatic thigh-high slit and polished 24K gold chain strap hardware.",
      categoryId: "cat_women",
      basePrice: 3890,
      compareAtPrice: 4200,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "96% Viscose Cady, 4% Elastane; Lining: 100% Silk",
      origin: "Atelier Made in Rome, Italy",
      detailsJson: JSON.stringify([
        "Internal custom-boned corset structure",
        "Hand-polished 24K gold-plated asymmetrical chain strap",
        "Sensual deep slit with subtle internal satin facing",
        "Concealed side-zip closure with hook-and-eye fastening",
        "Floor-sweeping column silhouette",
      ]),
      careGuide: "Haute couture dry clean only. Handle chain hardware with garment glove.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1600&auto=format&fit=crop",
          alt: "Sculpted Atelier Corset Evening Gown - Full Length Editorial",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
          alt: "Sculpted Atelier Corset Evening Gown - Back Details",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "IT 38 (XS)", colorName: "Midnight Nero", colorHex: "#0c0c0c", sku: "VCRST-GWN-38" },
        { size: "IT 40 (S)", colorName: "Midnight Nero", colorHex: "#0c0c0c", sku: "VCRST-GWN-40" },
        { size: "IT 42 (M)", colorName: "Midnight Nero", colorHex: "#0c0c0c", sku: "VCRST-GWN-42" },
        { size: "IT 44 (L)", colorName: "Midnight Nero", colorHex: "#0c0c0c", sku: "VCRST-GWN-44" },
      ],
    },
    {
      id: "prod_03",
      slug: "palazzo-imperiale-leather-top-handle-bag",
      name: "Palazzo Imperiale Leather Shoulder Bag",
      subtitle: "The Icon Collection",
      description: "Sculpted from buttery Italian calfskin with a semi-gloss finish. Centered with the iconic VOYOR Sovereign Gilded Seal clasp, accented by hand-burnished edges, a detachable curb chain, and lambskin lining.",
      categoryId: "cat_accessories",
      basePrice: 2450,
      compareAtPrice: null,
      isNew: false,
      isBestseller: true,
      isRunway: false,
      composition: "100% Full-Grain Italian Calfskin; 100% Lambskin Nappa Lining",
      origin: "Crafted in Florence, Italy",
      detailsJson: JSON.stringify([
        "Cast brass Sovereign Medallion clasp with 24K gold flash finish",
        "Two structured main internal compartments with central zip partition",
        "Includes interchangeable calfskin strap and chunky diamond-cut chain",
        "Protective metal bottom feet with micro-engraving",
        "Dimensions: 26cm W x 18cm H x 11cm D",
      ]),
      careGuide: "Store in provided flannel dust bag. Wipe with soft dry cloth.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1600&auto=format&fit=crop",
          alt: "Palazzo Imperiale Leather Shoulder Bag - Studio Portrait",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1600&auto=format&fit=crop",
          alt: "Palazzo Imperiale Leather Shoulder Bag - Lifestyle Runway Shot",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "Medium (26cm)", colorName: "Onyx Black & Gold", colorHex: "#111111", sku: "VPLZ-BAG-BLK" },
        { size: "Medium (26cm)", colorName: "Ivory Carrara & Gold", colorHex: "#f5f3ef", sku: "VPLZ-BAG-IVR" },
        { size: "Medium (26cm)", colorName: "Ruby Barocco Red", colorHex: "#8b0000", sku: "VPLZ-BAG-RED" },
      ],
    },
    {
      id: "prod_04",
      slug: "la-greca-double-breasted-wool-coat",
      name: "La Greca Peak-Lapel Cashmere & Wool Overcoat",
      subtitle: "Tailored Outerwear FW26",
      description: "An imposing, razor-sharp silhouette crafted from double-faced virgin wool and Mongolian cashmere. Features architectural padded shoulders, peak lapels, and custom cast gold crest buttons.",
      categoryId: "cat_men",
      basePrice: 3200,
      compareAtPrice: 3600,
      isNew: true,
      isBestseller: false,
      isRunway: true,
      composition: "85% Virgin Wool, 15% Cashmere; Bemberg Cupro Lining",
      origin: "Made in Biella, Italy",
      detailsJson: JSON.stringify([
        "Exaggerated power-shoulder construction",
        "Double-breasted front with 6 engraved heraldic buttons",
        "Deep central vent for fluid movement while walking",
        "Flap front pockets and welt ticket pocket",
        "Full internal cupro jacquard monogram lining",
      ]),
      careGuide: "Delicate dry clean only. Store on wide cedar coat hanger.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1600&auto=format&fit=crop",
          alt: "La Greca Peak-Lapel Wool Overcoat - Editorial Street Style",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
          alt: "La Greca Peak-Lapel Wool Overcoat - Runway Detail",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "IT 48 (M)", colorName: "Nero Profondo", colorHex: "#080808", sku: "VLGR-COAT-48" },
        { size: "IT 50 (L)", colorName: "Nero Profondo", colorHex: "#080808", sku: "VLGR-COAT-50" },
        { size: "IT 52 (XL)", colorName: "Nero Profondo", colorHex: "#080808", sku: "VLGR-COAT-52" },
      ],
    },
    {
      id: "prod_05",
      slug: "gilded-oracle-parfum-extract",
      name: "Gilded Oracle - Extrait De Parfum (100ml)",
      subtitle: "VOYOR Haute Parfumerie",
      description: "An intoxicating nectar of rare Tuscan orris butter, smoked Bulgarian Damask rose, rich golden ambergris, and sun-drenched Italian bergamot. Housed in a heavy faceted black crystal flacon crowned with a hand-burnished 24K gold sovereign cap.",
      categoryId: "cat_parfumerie",
      basePrice: 480,
      compareAtPrice: null,
      isNew: true,
      isBestseller: true,
      isRunway: false,
      composition: "Concentration: 32% Pure Extrait de Parfum",
      origin: "Crafted in Grasse, France & Bottled in Milan",
      detailsJson: JSON.stringify([
        "Top Notes: Calabrian Bergamot, Saffron Thread, Pink Peppercorn",
        "Heart Notes: Florentine Orris Butter, Damask Rose Absolute, Frankincense",
        "Base Notes: Golden Ambergris, Royal Oud, Bourbon Vanilla, Smoked Leather",
        "Hand-numbered bottle with certificate of authenticity",
        "Accompanied by silk-lined lacquered wooden presentation box",
      ]),
      careGuide: "Keep away from direct heat and sunlight. Store at room temperature.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop",
          alt: "Gilded Oracle Extrait De Parfum - Flacon Presentation",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1600&auto=format&fit=crop",
          alt: "Gilded Oracle Extrait De Parfum - Luxury Box Set",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "100ml / 3.4 fl. oz", colorName: "Pure Nectar", colorHex: "#c5a059", sku: "VGOR-PRF-100" },
      ],
    },
    {
      id: "prod_06",
      slug: "goddess-platform-stiletto-sandals",
      name: "Sovereign Gold Chain Platform Sandals",
      subtitle: "Evening Footwear FW26",
      description: "Soaring 140mm platform sandals sculpted in mirror-finish metallic leather. Anchored by a bold architectural block heel and detailed with an ankle harness featuring the signature VOYOR chunky gold gourmette chain.",
      categoryId: "cat_women",
      basePrice: 1450,
      compareAtPrice: null,
      isNew: true,
      isBestseller: false,
      isRunway: true,
      composition: "100% Metallic Calf Leather; Leather Sole with Rubber Injection",
      origin: "Handcrafted in Veneto, Italy",
      detailsJson: JSON.stringify([
        "Heel height: 140mm / 5.5 inches; Platform: 40mm / 1.5 inches",
        "Adjustable buckle ankle strap with gold curb chain drape",
        "Squared modern open-toe silhouette",
        "Branded leather insole with ergonomic arch support",
      ]),
      careGuide: "Protect metallic leather from abrasive contact. Avoid moisture.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600&auto=format&fit=crop",
          alt: "Sovereign Gold Chain Platform Sandals - Side Profile",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=1600&auto=format&fit=crop",
          alt: "Sovereign Gold Chain Platform Sandals - Look 02",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "IT 36", colorName: "Specchio Gold", colorHex: "#ffd700", sku: "VSNDL-GLD-36" },
        { size: "IT 37", colorName: "Specchio Gold", colorHex: "#ffd700", sku: "VSNDL-GLD-37" },
        { size: "IT 38", colorName: "Specchio Gold", colorHex: "#ffd700", sku: "VSNDL-GLD-38" },
        { size: "IT 39", colorName: "Specchio Gold", colorHex: "#ffd700", sku: "VSNDL-GLD-39" },
      ],
    },
    {
      id: "prod_07",
      slug: "silk-cotton-ribbed-socks",
      name: "Silk & Cotton Ribbed Socks",
      subtitle: "Runway FW26 Look 02",
      description: "Engineered from luxurious silk and combed Egyptian cotton with subtle ribbed texturing and embroidered gold hardware insignia.",
      categoryId: "cat_men",
      basePrice: 195,
      compareAtPrice: 250,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "65% Mulberry Silk, 35% Combed Cotton",
      origin: "Handcrafted in Brescia, Italy",
      detailsJson: JSON.stringify([
        "Ribbed knit structure",
        "Reinforced toe and heel",
        "VOYOR engraved gold plaque",
      ]),
      careGuide: "Hand wash in cold water with silk detergent.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=1000&auto=format&fit=crop",
          alt: "Silk & Cotton Ribbed Socks",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1000&auto=format&fit=crop",
          alt: "Silk & Cotton Ribbed Socks - Alternate Profile",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "M", colorName: "Terracotta Bronze", colorHex: "#c87d55", sku: "SK-M-TER" },
        { size: "L", colorName: "Terracotta Bronze", colorHex: "#c87d55", sku: "SK-L-TER" },
      ],
    },
    {
      id: "prod_08",
      slug: "lou-printed-nylon-backpack",
      name: "Lou Printed Nylon Backpack",
      subtitle: "Runway FW26 Look 11",
      description: "Technical nylon backpack adorned with classical Greco-Roman mythology illustrations and trimmed in rich full-grain Italian leather.",
      categoryId: "cat_men",
      basePrice: 1850,
      compareAtPrice: 2200,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "100% Recycled Technical Nylon, 100% Calf Leather Accents",
      origin: "Made in Florence, Italy",
      detailsJson: JSON.stringify([
        "Dual top zip closure",
        "Padded ergonomic straps",
        "Sculpted medusa enamel emblem",
        "External front zipped pocket",
      ]),
      careGuide: "Wipe clean with a damp microfiber cloth.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
          alt: "Lou Printed Nylon Backpack",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?q=80&w=1000&auto=format&fit=crop",
          alt: "Lou Printed Nylon Backpack - Runway Editorial",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "One Size", colorName: "Imperial Blue", colorHex: "#2c4365", sku: "BP-LOU-BLU" },
      ],
    },
    {
      id: "prod_09",
      slug: "palazzo-leather-belt-4cm",
      name: "Leather Belt 4 cm",
      subtitle: "Runway FW26 Look 07",
      description: "Smooth matte calfskin leather belt anchored by an architectural polished palladium-finish buckle with subtle engraved brandmark.",
      categoryId: "cat_men",
      basePrice: 620,
      compareAtPrice: 720,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "100% Calf Leather; Solid Brass Buckle",
      origin: "Handcrafted in Tuscany, Italy",
      detailsJson: JSON.stringify([
        "Width: 4 cm / 1.5 inches",
        "Engraved buckle closure",
        "Five adjustable sizing holes",
        "Hand-painted beveled edges",
      ]),
      careGuide: "Condition with specialty leather cream once a year.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=1000&auto=format&fit=crop",
          alt: "Leather Belt 4 cm",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1000&auto=format&fit=crop",
          alt: "Leather Belt 4 cm - Architectural Buckle",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "90 cm", colorName: "Noir Black", colorHex: "#0a0a0a", sku: "BLT-BLK-90" },
        { size: "95 cm", colorName: "Noir Black", colorHex: "#0a0a0a", sku: "BLT-BLK-95" },
        { size: "100 cm", colorName: "Noir Black", colorHex: "#0a0a0a", sku: "BLT-BLK-100" },
      ],
    },
    {
      id: "prod_10",
      slug: "bound-gilded-pendant-necklace",
      name: "Bound Necklace",
      subtitle: "Runway FW26 Look 14",
      description: "Sculptural talismanic capsule pendant suspended from a diamond-cut rolo chain, electroplated in durable 24-karat white and yellow gold.",
      categoryId: "cat_men",
      basePrice: 550,
      compareAtPrice: 650,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "Hypoallergenic Solid Brass, 24K White Rhodium & Gold Finish",
      origin: "Crafted in Arezzo, Italy",
      detailsJson: JSON.stringify([
        "Length: 60 cm with 5 cm extender",
        "Lobster clasp closure with logo charm",
        "Heavyweight solid pendant cylinder",
      ]),
      careGuide: "Store in protective felt pouch. Avoid contact with perfumes.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop",
          alt: "Bound Necklace",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?q=80&w=1000&auto=format&fit=crop",
          alt: "Bound Necklace - Gilded Detail",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "One Size", colorName: "Silver Palladium", colorHex: "#d4d8dd", sku: "NCK-BND-SLV" },
      ],
    },
    {
      id: "prod_11",
      slug: "medusa-gilded-medallion-choker",
      name: "Gilded Medallion Choker",
      subtitle: "Runway FW26 Look 08",
      description: "Show-stopping runway collar choker defined by intertwining Cuban chain links and a coin medallion featuring high-relief laurel wreath engraving.",
      categoryId: "cat_women",
      basePrice: 780,
      compareAtPrice: 920,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "100% Brass with 24K Gold Plating",
      origin: "Handcrafted in Vicenza, Italy",
      detailsJson: JSON.stringify([
        "Adjustable hook closure",
        "High-polish mirror finish",
        "Nickel-free and hypoallergenic",
      ]),
      careGuide: "Clean gently with jewellery polishing cloth.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop",
          alt: "Gilded Medallion Choker",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
          alt: "Gilded Medallion Choker - Runway Silhouette",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "One Size", colorName: "Everforest Gold", colorHex: "#ffd700", sku: "CHK-MDL-GLD" },
      ],
    },
    {
      id: "prod_12",
      slug: "barocco-silk-fluid-drape-blouse",
      name: "Barocco Silk Drape Blouse",
      subtitle: "Runway FW26 Look 03",
      description: "Pure silk crepe de chine draped blouse with flowing pussy-bow necktie, accented with golden Barocco scroll motifs and pleated cuffs.",
      categoryId: "cat_women",
      basePrice: 1350,
      compareAtPrice: 1580,
      isNew: true,
      isBestseller: false,
      isRunway: true,
      composition: "100% Silk Crepe de Chine",
      origin: "Made in Como, Italy",
      detailsJson: JSON.stringify([
        "Convertible necktie collar",
        "Concealed mother-of-pearl placket",
        "Elongated french cuffs with gold buttons",
      ]),
      careGuide: "Dry clean only. Cool iron on reverse.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
          alt: "Barocco Silk Drape Blouse",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=1000&auto=format&fit=crop",
          alt: "Barocco Silk Drape Blouse - Fluid Motion",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "IT 38", colorName: "Ivory & Gold", colorHex: "#f8f4e6", sku: "BLS-IVR-38" },
        { size: "IT 40", colorName: "Ivory & Gold", colorHex: "#f8f4e6", sku: "BLS-IVR-40" },
        { size: "IT 42", colorName: "Ivory & Gold", colorHex: "#f8f4e6", sku: "BLS-IVR-42" },
      ],
    },
    {
      id: "prod_13",
      slug: "tailored-hourglass-wool-blazer",
      name: "Tailored Hourglass Wool Blazer",
      subtitle: "Runway FW26 Look 05",
      description: "Architecturally tailored single-breasted blazer cut to sculpt an ultra-cinched hourglass waist, finished with custom gilded hardware.",
      categoryId: "cat_women",
      basePrice: 2750,
      compareAtPrice: 3100,
      isNew: true,
      isBestseller: true,
      isRunway: true,
      composition: "100% Virgin Wool Cady, Silk Satin Lining",
      origin: "Made in Milan, Italy",
      detailsJson: JSON.stringify([
        "Structured peak lapels",
        "Cinched architectural waistline",
        "Signature Medusa gilded single button",
      ]),
      careGuide: "Specialist dry clean only.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
          alt: "Tailored Hourglass Wool Blazer",
          isPrimary: true,
        },
        {
          url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop",
          alt: "Tailored Hourglass Wool Blazer - Atelier Profile",
          isPrimary: false,
        },
      ],
      variants: [
        { size: "IT 38", colorName: "Midnight Black", colorHex: "#080808", sku: "BLZ-BLK-38" },
        { size: "IT 40", colorName: "Midnight Black", colorHex: "#080808", sku: "BLZ-BLK-40" },
      ],
    },
  ];

  for (const p of productsData) {
    db.insert(products).values({
      id: p.id,
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      categoryId: p.categoryId,
      basePrice: p.basePrice,
      compareAtPrice: p.compareAtPrice,
      isNew: p.isNew,
      isBestseller: p.isBestseller,
      isRunway: p.isRunway,
      composition: p.composition,
      origin: p.origin,
      detailsJson: p.detailsJson,
      careGuide: p.careGuide,
    }).run();

    p.images.forEach((img, idx) => {
      db.insert(productImages).values({
        id: `img_${p.id}_${idx}`,
        productId: p.id,
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
        displayOrder: idx,
      }).run();
    });

    p.variants.forEach((v) => {
      db.insert(productVariants).values({
        id: `var_${v.sku}`,
        productId: p.id,
        size: v.size,
        colorName: v.colorName,
        colorHex: v.colorHex,
        sku: v.sku,
        stockQuantity: 12,
        priceDelta: 0,
      }).run();
    });
  }

  console.log("VOYOR luxury catalog seeded successfully!");
}

// Auto-seed if run directly
if (require.main === module) {
  initDbAndSeed();
}
