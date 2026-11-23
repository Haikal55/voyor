import os
import re
import json
import time
from io import BytesIO
from curl_cffi import requests
from bs4 import BeautifulSoup
from PIL import Image

HEADERS = {
    "Referer": "https://www.versace.com/id/en/",
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
}

IMG_DIR = os.path.abspath("public/images/products")
os.makedirs(IMG_DIR, exist_ok=True)

# Load existing catalog
with open("scraped_versace_catalog.json", "r") as f:
    existing_catalog = json.load(f)

print(f"Loaded {len(existing_catalog)} existing catalog items.")

NEW_PRODUCTS_TO_SCRAPE = [
    # 1. User URL 1: Printed Silk Twill Shirt (Women)
    {
        "id": "prod_13",
        "slug": "printed-silk-twill-shirt",
        "category_id": "cat_women",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/clothing/shirts-tops/printed-silk-twill-shirt/1028153-1A19860_5E860.html",
        "color_map": {
            "1028153-1A19860_5E860": {"name": "Barocco Grigio", "hex": "#7B858B", "slug": "grigio"},
            "1028153-1A19860_5PI00": {"name": "Barocco Rosa", "hex": "#D4A5B8", "slug": "rosa"},
        }
    },
    # 2. User URL 2: Printed Silk Twill Shirt (Women Mint)
    {
        "id": "prod_14",
        "slug": "barocco-mint-silk-twill-shirt",
        "category_id": "cat_women",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/women/clothing/shirts-tops/printed-silk-twill-shirt/1025686-1A18856_5GE70.html",
        "color_map": {
            "1025686-1A18856_5GE70": {"name": "Barocco Mint & Oro", "hex": "#608F79", "slug": "mint"},
        }
    },
    # 3. User URL 3: Wool-Jersey Tank Top (Women)
    {
        "id": "prod_15",
        "slug": "wool-jersey-tank-top",
        "category_id": "cat_women",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/clothing/t-shirts-sweatshirts/t-shirts/wool-jersey-tank-top/1027860-1A19911_1ED90.html",
        "color_map": {
            "1027860-1A19911_1ED90": {"name": "Nero & Tribute Gold", "hex": "#1A1A1A", "slug": "nero"},
        }
    },
    # 4. User URL 4: Denim Blazer (Women)
    {
        "id": "prod_16",
        "slug": "denim-blazer",
        "category_id": "cat_women",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/women/clothing/denim/denim-jackets/denim-blazer/1027805-1A19444_1D870.html",
        "color_map": {
            "1027805-1A19444_1D870": {"name": "Raw Indigo Denim", "hex": "#22374E", "slug": "indigo"},
        }
    },
    # 5. User URL 5: Denim High-Waist Flared Pants (Women)
    {
        "id": "prod_17",
        "slug": "denim-high-waist-flared-pants",
        "category_id": "cat_women",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/women/clothing/denim/jeans/denim-high-waist-flared-pants/1027145-1A19444_1D870.html",
        "color_map": {
            "1027145-1A19444_1D870": {"name": "Raw Indigo Denim", "hex": "#22374E", "slug": "indigo"},
        }
    },
    # 6. User URL 6: Croc-Effect Nappa Blazer (Women)
    {
        "id": "prod_18",
        "slug": "croc-effect-nappa-blazer",
        "category_id": "cat_women",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/clothing/outerwear-coats/jackets/croc-effect-nappa-blazer/1027492-1A19488_1N230.html",
        "color_map": {
            "1027492-1A19488_1N230": {"name": "Espresso Croc Leather", "hex": "#2D1E18", "slug": "espresso"},
        }
    },
    # 7. Men Sneakers: Greca Run Suede Sneakers
    {
        "id": "prod_19",
        "slug": "greca-run-suede-sneakers",
        "category_id": "cat_men",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/shoes/sneakers/greca-run-suede-sneakers/1028311-1A20326_1UM40.html",
        "color_map": {
            "1028311-1A20326_1UM40": {"name": "Royal Blue & Sand", "hex": "#274C77", "slug": "blue"},
            "1028311-1A20326_1N870": {"name": "Caramel Nappa", "hex": "#8D5B4C", "slug": "caramel"},
            "1028311-1A20326_1W030": {"name": "Optic White Suede", "hex": "#EEEEEE", "slug": "white"},
        }
    },
    # 8. Men Pants: Plongé Leather Pants
    {
        "id": "prod_20",
        "slug": "plonge-leather-pants",
        "category_id": "cat_men",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/men/clothing/pants-shorts/plonge-leather-pants/1023731-1A17491_1B000.html",
        "color_map": {
            "1023731-1A17491_1B000": {"name": "Nero Plongé", "hex": "#111111", "slug": "nero"},
            "1023731-1A17491_1UP70": {"name": "Midnight Blue", "hex": "#16243B", "slug": "blue"},
            "1023731-1A17491_1RE60": {"name": "Rosso Red Plongé", "hex": "#8A1A24", "slug": "rosso"},
        }
    },
    # 9. Bags: Severine Croc-Effect Leather Shoulder Bag
    {
        "id": "prod_21",
        "slug": "severine-croc-leather-shoulder-bag",
        "category_id": "cat_accessories",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/bags/top-handle/severine-croc-effect-leather-shoulder-bag/1026479-1A19683_1B00G.html",
        "color_map": {
            "1026479-1A19683_1RH8G": {"name": "Rosso Red Croc", "hex": "#8A1A24", "slug": "rosso"},
            "1026479-1A19683_1B00G": {"name": "Nero Croc Gold", "hex": "#141414", "slug": "nero"},
        }
    },
    # 10. Perfume: Crystal Noir EDT
    {
        "id": "prod_22",
        "slug": "crystal-noir-eau-de-toilette",
        "category_id": "cat_parfumerie",
        "is_runway": 0,
        "is_new": 0,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/accessories/fragrances-body-care/crystal-noir/crystal-noir-edt-50-ml/R07126-R050MLS_RNUL.html",
        "fallback_title": "Crystal Noir Eau de Toilette (50 ml)",
        "fallback_desc": "A sensual and delicate fragrance with a floral-oriental aroma and a warm, amber and musky base.",
        "fallback_price": 1901000.0,
        "color_map": {
            "R07126-R050MLS_RNUL": {"name": "Garnet Noir", "hex": "#2E1524", "slug": "noir"},
        }
    },
    # 11. Perfume: Bright Crystal Parfum
    {
        "id": "prod_23",
        "slug": "bright-crystal-parfum",
        "category_id": "cat_parfumerie",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/accessories/fragrances-body-care/bright-crystal/bright-crystal-parfum-50-ml/R512030-R050MLS_RNUL.html",
        "fallback_title": "Bright Crystal Parfum (50 ml)",
        "fallback_desc": "An intense, long-lasting floral fragrance with refined notes of pomegranate, yuzu, peony, magnolia, and lotus flower.",
        "fallback_price": 2350000.0,
        "color_map": {
            "R512030-R050MLS_RNUL": {"name": "Crystal Rosé", "hex": "#E8A5B8", "slug": "rose"},
        }
    },
    # 12. Perfume: Eros Eau de Toilette
    {
        "id": "prod_24",
        "slug": "eros-eau-de-toilette",
        "category_id": "cat_parfumerie",
        "is_runway": 0,
        "is_new": 0,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/accessories/fragrances-body-care/eros/eros-edt-100-ml/R740010-R100MLS_RNUL.html",
        "fallback_title": "Eros Eau de Toilette (100 ml)",
        "fallback_desc": "Versace Eros is a fragrance for a strong, passionate man who is master of himself. Notes of mint leaves, Italian lemon zest, green apple, tonka beans, and cedarwood.",
        "fallback_price": 2100000.0,
        "color_map": {
            "R740010-R100MLS_RNUL": {"name": "Mediterranean Turquoise", "hex": "#1C6E8C", "slug": "turquoise"},
        }
    }
]

def download_and_save_image(img_url: str, output_path: str):
    if not img_url.startswith("http"):
        img_url = f"https://www.versace.com{img_url}"
    base_img_url = img_url.split("?")[0]
    if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
        print(f"Already cached: {os.path.basename(output_path)}")
        return True

    print(f"Downloading: {base_img_url} -> {os.path.basename(output_path)}")
    try:
        r = requests.get(base_img_url, impersonate="chrome120", headers=HEADERS, timeout=15)
        if r.status_code == 200:
            img = Image.open(BytesIO(r.content))
            rgb_img = img.convert("RGB")
            rgb_img.save(output_path, "JPEG", quality=92)
            print(f"  Saved successfully: {os.path.basename(output_path)} ({os.path.getsize(output_path)} bytes)")
            return True
        else:
            print(f"  Failed with status: {r.status_code}")
    except Exception as e:
        print(f"  Download error: {e}")
    return False

new_catalog_items = []

for p in NEW_PRODUCTS_TO_SCRAPE:
    print(f"\n==========================================")
    print(f"Scraping {p['id']}: {p['slug']} from {p['url']}")
    try:
        r = requests.get(p["url"], impersonate="chrome120", headers={"Referer": "https://www.versace.com/id/en/"}, timeout=15)
        if r.status_code != 200:
            print(f"Warning: got HTTP {r.status_code}")
            continue

        soup = BeautifulSoup(r.text, "html.parser")
        product_group = None
        for s in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(s.string)
                if isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict) and item.get("@type") in ("ProductGroup", "Product"):
                            product_group = item
                            break
                elif isinstance(data, dict) and data.get("@type") in ("ProductGroup", "Product"):
                    product_group = data
                    break
            except Exception:
                pass

        name = None
        description = ""
        variants_raw = []
        base_price_idr = None

        if product_group:
            name = product_group.get("name")
            description = product_group.get("description", "")
            variants_raw = product_group.get("hasVariant", [])
            if not variants_raw and product_group.get("@type") == "Product":
                variants_raw = [product_group]
        else:
            h1 = soup.find("h1")
            name = h1.text.strip() if h1 else p.get("fallback_title", p["slug"].replace("-", " ").title())
            description = p.get("fallback_desc", "Official Gianni Versace S.r.l. Italian creation.")
            base_price_idr = p.get("fallback_price", 2850000.0)
            variants_raw = [{"sku": list(p["color_map"].keys())[0], "size": ["50 ml", "100 ml"], "offers": {"price": str(base_price_idr)}}]

        print(f"Product: {name} (Raw variants: {len(variants_raw)})")

        product_variants = []
        product_images = []
        seen_img_urls = set()

        if not base_price_idr:
            for v in variants_raw:
                price_str = v.get("offers", {}).get("price")
                if price_str:
                    try:
                        base_price_idr = float(price_str)
                        break
                    except Exception:
                        pass
        if not base_price_idr:
            base_price_idr = 15000000.0

        base_price_usd = round((base_price_idr / 15800) / 10) * 10

        # Match variants with color_map
        for v in variants_raw:
            sku = v.get("sku") or v.get("productID", "")
            color_info = None

            for k, info in p["color_map"].items():
                if k in sku or sku in k:
                    color_info = info
                    break
            if not color_info:
                if len(p["color_map"]) == 1:
                    color_info = list(p["color_map"].values())[0]
                else:
                    color_name = v.get("color") or "Signature"
                    color_info = {"name": color_name, "hex": "#111111", "slug": color_name.lower().replace(" ", "-")}

            sizes_raw = v.get("size") or (product_group.get("size") if product_group else None)
            if isinstance(sizes_raw, dict):
                sizes = sizes_raw.get("name") or ["One Size"]
            elif isinstance(sizes_raw, list):
                sizes = sizes_raw
            elif isinstance(sizes_raw, str):
                sizes = [sizes_raw]
            else:
                sizes = ["One Size"]

            for sz in sizes[:5]:
                product_variants.append({
                    "sku": f"{sku}-{sz}".replace(" ", "_"),
                    "size": str(sz),
                    "color_name": color_info["name"],
                    "color_hex": color_info["hex"],
                    "stock_quantity": 12,
                    "price_delta": 0
                })

            raw_imgs = v.get("image", [])
            if not raw_imgs and product_group:
                raw_imgs = product_group.get("image", [])
            if not raw_imgs:
                # Find demandware images in page
                raw_imgs = re.findall(r'https://www\.versace\.com/dw/image/v2/[^\"\'\s]+\.jpg', r.text)
                raw_imgs = list(dict.fromkeys(raw_imgs))

            if isinstance(raw_imgs, str):
                raw_imgs = [raw_imgs]

            img_idx = 1
            for img_url in raw_imgs[:3]:
                clean_url = img_url.split("?")[0]
                if clean_url in seen_img_urls:
                    continue
                seen_img_urls.add(clean_url)

                filename = f"{p['slug']}-{color_info['slug']}-{img_idx}.jpg"
                filepath = os.path.join(IMG_DIR, filename)
                local_url = f"/images/products/{filename}"
                success = download_and_save_image(img_url, filepath)
                if success:
                    product_images.append({
                        "url": local_url,
                        "alt": f"{name} in {color_info['name']} - Versace View {img_idx}",
                        "color_name": color_info["name"],
                        "is_primary": 1 if (img_idx == 1 and len(product_images) == 0) else 0,
                        "display_order": len(product_images) + 1
                    })
                    img_idx += 1

        new_catalog_items.append({
            "id": p["id"],
            "slug": p["slug"],
            "name": name,
            "subtitle": "Versace Atelier Milano • Authentic Collection",
            "description": description,
            "category_id": p["category_id"],
            "base_price": base_price_usd,
            "base_price_idr": base_price_idr,
            "currency": "USD",
            "is_new": p["is_new"],
            "is_bestseller": p["is_bestseller"],
            "is_runway": p["is_runway"],
            "composition": "100% Authentic Italian Atelier Craftsmanship",
            "origin": "Made in Italy",
            "details_json": json.dumps([
                "Official Gianni Versace S.r.l. Milan Creation",
                "Crafted with signature Medusa and Barocco elements",
                "Includes NFC digital authenticity passport embedded inside label",
                "Complimentary white-glove boutique delivery in rigid Italian gift box"
            ]),
            "care_guide": "Specialist luxury dry clean or boutique care service. Preserve in provided garment bag.",
            "variants": product_variants,
            "images": product_images
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error scraping {p['slug']}: {e}")

# Combine existing catalog and new items (filter out duplicates by id or slug)
combined_catalog = []
seen_ids = set()
for item in existing_catalog:
    if item["id"] not in seen_ids:
        seen_ids.add(item["id"])
        combined_catalog.append(item)

for item in new_catalog_items:
    if item["id"] not in seen_ids:
        seen_ids.add(item["id"])
        combined_catalog.append(item)

with open("scraped_versace_catalog.json", "w") as f:
    json.dump(combined_catalog, f, indent=2)

print(f"\n==========================================")
print(f"Catalog expanded successfully! Total items now: {len(combined_catalog)}")
