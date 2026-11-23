import Database from "better-sqlite3";

const sqlite = new Database("voyor.db");

console.log("Starting catalog color updates...");

try {
  sqlite.prepare("ALTER TABLE product_images ADD COLUMN color_name TEXT;").run();
} catch {
}

const updateCatalog = sqlite.transaction(() => {
  sqlite.prepare(`
    INSERT INTO products (id, slug, name, subtitle, description, category_id, base_price, compare_at_price, currency, is_new, is_bestseller, is_runway, composition, origin, details_json, care_guide, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      subtitle = excluded.subtitle,
      description = excluded.description,
      category_id = excluded.category_id,
      base_price = excluded.base_price,
      is_new = excluded.is_new,
      is_bestseller = excluded.is_bestseller,
      composition = excluded.composition,
      origin = excluded.origin,
      details_json = excluded.details_json,
      care_guide = excluded.care_guide
  `).run(
    "prod_14",
    "medusa-heritage-cotton-jersey-tee",
    "Medusa Heritage Cotton Jersey T-Shirt",
    "Barocco Foil Printed Relaxed Tee",
    "Crafted from premium Italian organic cotton jersey, this crewneck t-shirt is emblazoned with the iconic archival Medusa medallion framed by gilded Barocco filigree. Finished with a ribbed neckline and relaxed tailored fit.",
    "cat_men",
    690,
    750,
    "USD",
    1,
    1,
    0,
    "100% Organic Cotton",
    "Made in Italy",
    JSON.stringify([
      "Medusa motif print in archival foil technique",
      "Outer fabric: 100% Cotton",
      "Ribbed crew neckline and tailored cuffs",
      "Straight hemline with reinforced double-stitch",
      "Manufactured in Milan atelier",
    ]),
    "Delicate hand wash inside out in cool water. Do not tumble dry. Cool iron avoiding print motif.",
    Date.now()
  );

  sqlite.prepare(`
    INSERT INTO products (id, slug, name, subtitle, description, category_id, base_price, compare_at_price, currency, is_new, is_bestseller, is_runway, composition, origin, details_json, care_guide, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      subtitle = excluded.subtitle,
      description = excluded.description,
      category_id = excluded.category_id,
      base_price = excluded.base_price,
      is_new = excluded.is_new,
      is_runway = excluded.is_runway,
      composition = excluded.composition,
      origin = excluded.origin,
      details_json = excluded.details_json,
      care_guide = excluded.care_guide
  `).run(
    "prod_15",
    "medusa-tailored-denim-jacket",
    "Medusa Hardware Tailored Denim Jacket",
    "Washed Italian Denim Outerwear",
    "An elevated Italian denim jacket crafted from rigid selvedge cotton, punctuated by hand-cast 24K gold-plated Medusa buttons. Styled with sharp flap chest pockets, angled side welt pockets, and sculpted shoulder lines.",
    "cat_men",
    1850,
    null,
    "USD",
    1,
    0,
    1,
    "100% Selvedge Cotton Denim",
    "Made in Italy",
    JSON.stringify([
      "Hand-finished washed denim silhouette",
      "Cast metal Medusa shank buttons in 24K gilded finish",
      "Twin chest flap pockets and vertical welt hand-pockets",
      "Buttoned tab waist adjusters at rear",
      "Contrast tobacco topstitching",
    ]),
    "Specialist luxury dry clean or gentle cold wash cycle. Do not bleach.",
    Date.now()
  );

  const productsToReset = [
    "prod_01",
    "prod_02",
    "prod_03",
    "prod_04",
    "prod_05",
    "prod_06",
    "prod_07",
    "prod_08",
    "prod_09",
    "prod_10",
    "prod_11",
    "prod_12",
    "prod_13",
    "prod_14",
    "prod_15",
  ];

  sqlite.prepare("DELETE FROM cart_items").run();

  for (const pid of productsToReset) {
    sqlite.prepare("DELETE FROM product_variants WHERE product_id = ?").run(pid);
    sqlite.prepare("DELETE FROM product_images WHERE product_id = ?").run(pid);
  }

  const insertVariant = sqlite.prepare(`
    INSERT INTO product_variants (id, product_id, size, color_name, color_hex, sku, stock_quantity, price_delta)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertImage = sqlite.prepare(`
    INSERT INTO product_images (id, product_id, url, alt, color_name, is_primary, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);


  const tColors = [
    { name: "Nero & Oro", hex: "#0D0D0D", slug: "black" },
    { name: "Bianco & Oro", hex: "#F5F5F0", slug: "white" },
    { name: "Blu Royal", hex: "#1B365D", slug: "blue" },
  ];
  const tSizes = ["S", "M", "L", "XL"];
  let tVarIdx = 1;
  for (const col of tColors) {
    for (const sz of tSizes) {
      insertVariant.run(
        `var_p14_${col.slug}_${sz.toLowerCase()}`,
        "prod_14",
        sz,
        col.name,
        col.hex,
        `VY-TSH-${col.slug.toUpperCase()}-${sz}`,
        15,
        0
      );
    }
    insertImage.run(
      `img_p14_${col.slug}_1`,
      "prod_14",
      `/images/products/tshirt-${col.slug}-1.jpg`,
      `Medusa Heritage T-Shirt in ${col.name} - Front View`,
      col.name,
      col.slug === "black" ? 1 : 0,
      1
    );
    insertImage.run(
      `img_p14_${col.slug}_2`,
      "prod_14",
      `/images/products/tshirt-${col.slug}-2.jpg`,
      `Medusa Heritage T-Shirt in ${col.name} - Atelier Detail`,
      col.name,
      0,
      2
    );
  }

  const denimColors = [
    { name: "Nero Washed", hex: "#222222", slug: "black" },
    { name: "Indigo Vintage", hex: "#3A567D", slug: "blue" },
  ];
  const denimSizes = ["IT 46", "IT 48", "IT 50", "IT 52"];
  for (const col of denimColors) {
    for (const sz of denimSizes) {
      insertVariant.run(
        `var_p15_${col.slug}_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
        "prod_15",
        sz,
        col.name,
        col.hex,
        `VY-DNM-${col.slug.toUpperCase()}-${sz.replace("IT ", "")}`,
        10,
        0
      );
    }
    insertImage.run(
      `img_p15_${col.slug}_1`,
      "prod_15",
      `/images/products/denim-${col.slug}-1.jpg`,
      `Medusa Tailored Denim Jacket in ${col.name} - Studio Look`,
      col.name,
      col.slug === "black" ? 1 : 0,
      1
    );
    insertImage.run(
      `img_p15_${col.slug}_2`,
      "prod_15",
      `/images/products/denim-${col.slug}-2.jpg`,
      `Medusa Tailored Denim Jacket in ${col.name} - Runway Detail`,
      col.name,
      0,
      2
    );
  }

  const blazerColors = [
    { name: "Nero Profondo", hex: "#121212", slug: "black" },
    { name: "Cammello Reale", hex: "#A97C50", slug: "camel" },
    { name: "Rosso Gala", hex: "#8B1E22", slug: "red" },
  ];
  const blazerSizes = ["IT 38", "IT 40", "IT 42", "IT 44"];
  for (const col of blazerColors) {
    for (const sz of blazerSizes) {
      insertVariant.run(
        `var_p13_${col.slug}_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
        "prod_13",
        sz,
        col.name,
        col.hex,
        `VY-BLZ-${col.slug.toUpperCase()}-${sz.replace("IT ", "")}`,
        8,
        col.slug === "camel" ? 100 : 0
      );
    }
    insertImage.run(
      `img_p13_${col.slug}_1`,
      "prod_13",
      `/images/products/blazer-${col.slug}-1.jpg`,
      `Tailored Hourglass Blazer in ${col.name} - Front View`,
      col.name,
      col.slug === "black" ? 1 : 0,
      1
    );
    insertImage.run(
      `img_p13_${col.slug}_2`,
      "prod_13",
      `/images/products/blazer-${col.slug}-2.jpg`,
      `Tailored Hourglass Blazer in ${col.name} - Editorial Profile`,
      col.name,
      0,
      2
    );
  }

  const bagColors = [
    { name: "Nero & Oro", hex: "#0A0A0A", slug: "black" },
    { name: "Avorio & Oro", hex: "#EAE7DD", slug: "white" },
    { name: "Rosso Barocco", hex: "#78161A", slug: "red" },
  ];
  for (const col of bagColors) {
    insertVariant.run(
      `var_p03_${col.slug}_std`,
      "prod_03",
      "Standard",
      col.name,
      col.hex,
      `VY-BAG-${col.slug.toUpperCase()}-STD`,
      12,
      0
    );
    insertImage.run(
      `img_p03_${col.slug}_1`,
      "prod_03",
      `/images/products/bag-${col.slug}-1.jpg`,
      `Palazzo Imperiale Bag in ${col.name} - Front Silhouette`,
      col.name,
      col.slug === "black" ? 1 : 0,
      1
    );
    insertImage.run(
      `img_p03_${col.slug}_2`,
      "prod_03",
      `/images/products/bag-${col.slug}-2.jpg`,
      `Palazzo Imperiale Bag in ${col.name} - Hardware Detail`,
      col.name,
      0,
      2
    );
  }


  const p1Sizes = ["IT 46", "IT 48", "IT 50", "IT 52"];
  for (const sz of p1Sizes) {
    insertVariant.run(
      `var_p01_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
      "prod_01",
      sz,
      "Nero & Oro Barocco",
      "#1A1713",
      `VY-SLK-ORO-${sz.replace("IT ", "")}`,
      10,
      0
    );
  }
  insertImage.run(
    "img_p01_1",
    "prod_01",
    "/images/products/voyor-barocco-silk-heritage-shirt-1.jpg",
    "Barocco D'Oro Silk Heritage Shirt - Editorial Front",
    "Nero & Oro Barocco",
    1,
    1
  );
  insertImage.run(
    "img_p01_2",
    "prod_01",
    "/images/products/voyor-barocco-silk-heritage-shirt-2.jpg",
    "Barocco D'Oro Silk Heritage Shirt - Detail Print",
    "Nero & Oro Barocco",
    0,
    2
  );

  const p2Sizes = ["IT 38", "IT 40", "IT 42", "IT 44"];
  for (const sz of p2Sizes) {
    insertVariant.run(
      `var_p02_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
      "prod_02",
      sz,
      "Nero Couture",
      "#0D0D0D",
      `VY-GWN-NERO-${sz.replace("IT ", "")}`,
      6,
      0
    );
  }
  insertImage.run(
    "img_p02_1",
    "prod_02",
    "/images/products/medusa-corset-crepe-evening-gown-1.jpg",
    "Sculpted Atelier Corset Evening Gown - Full Runway Look",
    "Nero Couture",
    1,
    1
  );
  insertImage.run(
    "img_p02_2",
    "prod_02",
    "/images/products/medusa-corset-crepe-evening-gown-2.jpg",
    "Sculpted Atelier Corset Evening Gown - Bodice Detail",
    "Nero Couture",
    0,
    2
  );

  const p4Sizes = ["IT 48", "IT 50", "IT 52"];
  for (const sz of p4Sizes) {
    insertVariant.run(
      `var_p04_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
      "prod_04",
      sz,
      "Nero Notte",
      "#151515",
      `VY-COT-NERO-${sz.replace("IT ", "")}`,
      8,
      0
    );
  }
  insertImage.run(
    "img_p04_1",
    "prod_04",
    "/images/products/la-greca-double-breasted-wool-coat-1.jpg",
    "La Greca Peak-Lapel Cashmere & Wool Overcoat - Front",
    "Nero Notte",
    1,
    1
  );
  insertImage.run(
    "img_p04_2",
    "prod_04",
    "/images/products/la-greca-double-breasted-wool-coat-2.jpg",
    "La Greca Peak-Lapel Cashmere & Wool Overcoat - Lapel",
    "Nero Notte",
    0,
    2
  );

  insertVariant.run(
    "var_p05_std",
    "prod_05",
    "100ml",
    "Pure Nectar",
    "#C49B45",
    "VY-PRF-100",
    25,
    0
  );
  insertImage.run(
    "img_p05_1",
    "prod_05",
    "/images/products/gilded-oracle-parfum-extract-1.jpg",
    "Gilded Oracle Flacon",
    "Pure Nectar",
    1,
    1
  );
  insertImage.run(
    "img_p05_2",
    "prod_05",
    "/images/products/gilded-oracle-parfum-extract-2.jpg",
    "Gilded Oracle Coffret Presentation",
    "Pure Nectar",
    0,
    2
  );

  const p6Sizes = ["EU 37", "EU 38", "EU 39", "EU 40"];
  for (const sz of p6Sizes) {
    insertVariant.run(
      `var_p06_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
      "prod_06",
      sz,
      "Nero & 24K Oro",
      "#0F0F0F",
      `VY-SND-${sz.replace("EU ", "")}`,
      10,
      0
    );
  }
  insertImage.run(
    "img_p06_1",
    "prod_06",
    "/images/products/goddess-platform-stiletto-sandals-1.jpg",
    "Sovereign Gold Chain Platform Sandals - Side Profile",
    "Nero & 24K Oro",
    1,
    1
  );
  insertImage.run(
    "img_p06_2",
    "prod_06",
    "/images/products/goddess-platform-stiletto-sandals-2.jpg",
    "Sovereign Gold Chain Platform Sandals - Heel Accent",
    "Nero & 24K Oro",
    0,
    2
  );

  const p7Sizes = ["M", "L"];
  for (const sz of p7Sizes) {
    insertVariant.run(
      `var_p07_${sz.toLowerCase()}`,
      "prod_07",
      sz,
      "Nero Imperial",
      "#111111",
      `VY-SCK-${sz}`,
      30,
      0
    );
  }
  insertImage.run(
    "img_p07_1",
    "prod_07",
    "/images/products/silk-cotton-ribbed-socks-1.jpg",
    "Silk & Cotton Ribbed Socks",
    "Nero Imperial",
    1,
    1
  );
  insertImage.run(
    "img_p07_2",
    "prod_07",
    "/images/products/silk-cotton-ribbed-socks-2.jpg",
    "Silk & Cotton Ribbed Socks Pair",
    "Nero Imperial",
    0,
    2
  );

  insertVariant.run(
    "var_p08_std",
    "prod_08",
    "Standard",
    "Nero Barocco",
    "#171717",
    "VY-BPK-NERO",
    14,
    0
  );
  insertImage.run(
    "img_p08_1",
    "prod_08",
    "/images/products/lou-printed-nylon-backpack-1.jpg",
    "Lou Printed Nylon Backpack Front",
    "Nero Barocco",
    1,
    1
  );
  insertImage.run(
    "img_p08_2",
    "prod_08",
    "/images/products/lou-printed-nylon-backpack-2.jpg",
    "Lou Printed Nylon Backpack Detail",
    "Nero Barocco",
    0,
    2
  );

  const p9Sizes = ["85 cm", "90 cm", "95 cm", "100 cm"];
  for (const sz of p9Sizes) {
    insertVariant.run(
      `var_p09_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
      "prod_09",
      sz,
      "Nero Lucido & Oro",
      "#141414",
      `VY-BLT-${sz.replace(" cm", "")}`,
      16,
      0
    );
  }
  insertImage.run(
    "img_p09_1",
    "prod_09",
    "/images/products/palazzo-leather-belt-4cm-1.jpg",
    "Leather Belt 4 cm",
    "Nero Lucido & Oro",
    1,
    1
  );
  insertImage.run(
    "img_p09_2",
    "prod_09",
    "/images/products/palazzo-leather-belt-4cm-2.jpg",
    "Leather Belt Buckle Detail",
    "Nero Lucido & Oro",
    0,
    2
  );

  insertVariant.run(
    "var_p10_std",
    "prod_10",
    "One Size",
    "Gilded Palladium",
    "#D4AF37",
    "VY-NCK-PLD",
    8,
    0
  );
  insertImage.run(
    "img_p10_1",
    "prod_10",
    "/images/products/bound-gilded-pendant-necklace-1.jpg",
    "Bound Necklace Flat Lay",
    "Gilded Palladium",
    1,
    1
  );
  insertImage.run(
    "img_p10_2",
    "prod_10",
    "/images/products/bound-gilded-pendant-necklace-2.jpg",
    "Bound Necklace Pendant Close-Up",
    "Gilded Palladium",
    0,
    2
  );

  insertVariant.run(
    "var_p11_std",
    "prod_11",
    "One Size",
    "24K Gold Flash",
    "#E5B80B",
    "VY-CHK-24K",
    10,
    0
  );
  insertImage.run(
    "img_p11_1",
    "prod_11",
    "/images/products/medusa-gilded-medallion-choker-1.jpg",
    "Gilded Medallion Choker Front",
    "24K Gold Flash",
    1,
    1
  );
  insertImage.run(
    "img_p11_2",
    "prod_11",
    "/images/products/medusa-gilded-medallion-choker-2.jpg",
    "Gilded Medallion Choker On Bust",
    "24K Gold Flash",
    0,
    2
  );

  const p12Sizes = ["IT 38", "IT 40", "IT 42", "IT 44"];
  for (const sz of p12Sizes) {
    insertVariant.run(
      `var_p12_${sz.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`,
      "prod_12",
      sz,
      "Avorio & Oro Barocco",
      "#F7E7CE",
      `VY-BLS-${sz.replace("IT ", "")}`,
      8,
      0
    );
  }
  insertImage.run(
    "img_p12_1",
    "prod_12",
    "/images/products/barocco-silk-fluid-drape-blouse-1.jpg",
    "Barocco Silk Drape Blouse Front",
    "Avorio & Oro Barocco",
    1,
    1
  );
  insertImage.run(
    "img_p12_2",
    "prod_12",
    "/images/products/barocco-silk-fluid-drape-blouse-2.jpg",
    "Barocco Silk Drape Blouse Sleeve",
    "Avorio & Oro Barocco",
    0,
    2
  );
});

updateCatalog();
console.log("Successfully updated catalog colors and variants!");
