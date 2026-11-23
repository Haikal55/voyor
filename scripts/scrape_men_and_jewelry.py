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

ITEMS_TO_SCRAPE = [
    # 1. Men's Double Wool & Cashmere Coat (Runway)
    {
        "id": "prod_29",
        "slug": "double-wool-cashmere-coat",
        "category_id": "cat_men",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/clothing/jackets-coats/coats/double-wool-cashmere-coat/1027779-1A19640_1B000.html",
        "color_map": {
            "1027779-1A19640_1B000": {"name": "Nero Black", "hex": "#111111", "slug": "nero"}
        }
    },
    # 2. Men's Embroidered Cotton-Jersey Hoodie
    {
        "id": "prod_30",
        "slug": "embroidered-cotton-jersey-hoodie",
        "category_id": "cat_men",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/clothing/sweatshirts/embroidered-cotton-jersey-hoodie/1008661-1A06213_1B000.html",
        "color_map": {
            "1008661-1A06213_1B000": {"name": "Nero & Gold Logo", "hex": "#141414", "slug": "nero"}
        }
    },
    # 3. Men's Printed Cotton-Jersey Hoodie (Barocco)
    {
        "id": "prod_31",
        "slug": "printed-cotton-jersey-hoodie",
        "category_id": "cat_men",
        "is_runway": 0,
        "is_new": 0,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/clothing/sweatshirts/printed-cotton-jersey-hoodie/1025433-1A18731_1E090.html",
        "color_map": {
            "1025433-1A18731_1E090": {"name": "Barocco Print White", "hex": "#E8E2D5", "slug": "white"}
        }
    },
    # 4. Men's Embroidered Straight Jeans (Runway)
    {
        "id": "prod_32",
        "slug": "embroidered-straight-jeans",
        "category_id": "cat_men",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/men/clothing/denim/jeans/embroidered-straight-jeans/1027308-1A19825_1D040.html",
        "color_map": {
            "1027308-1A19825_1D040": {"name": "Vintage Wash Blue", "hex": "#3A506B", "slug": "blue"}
        }
    },
    # 5. Jewelry: Bound Medusa Ring
    {
        "id": "prod_26",
        "slug": "bound-ring",
        "category_id": "cat_jewelry",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/fashion-jewelry/rings/bound-ring/1026989-1A00620_3J030.html",
        "color_map": {
            "1026989-1A00620_3J030": {"name": "Tribute Gold & Ruthenium", "hex": "#D4AF37", "slug": "gold"}
        }
    },
    # 6. Jewelry: Bound Medusa Bracelet
    {
        "id": "prod_27",
        "slug": "bound-bracelet",
        "category_id": "cat_jewelry",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/fashion-jewelry/bracelets/bound-bracelet-/1026988-1A00620_3J030.html",
        "color_map": {
            "1026988-1A00620_3J030": {"name": "Tribute Gold & Ruthenium", "hex": "#D4AF37", "slug": "gold"}
        }
    },
    # 7. Jewelry: Greca Ring
    {
        "id": "prod_28",
        "slug": "greca-ring",
        "category_id": "cat_jewelry",
        "is_runway": 0,
        "is_new": 0,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/fashion-jewelry/rings/greca-ring/1027321-1A00620_4JUT0.html",
        "color_map": {
            "1027321-1A00620_4JUT0": {"name": "Tribute Gold & Crystal", "hex": "#E5B80B", "slug": "gold"}
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

scraped_new_items = []

for p in ITEMS_TO_SCRAPE:
    print(f"\n==========================================")
    print(f"Scraping {p['id']}: {p['slug']} from {p['url']}")
    try:
        r = requests.get(p["url"], impersonate="chrome120", headers=HEADERS, timeout=15)
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
            name = h1.text.strip() if h1 else p["slug"].replace("-", " ").title()
            description = "Official Gianni Versace S.r.l. Italian creation."
            base_price_idr = 15000000.0
            variants_raw = [{"sku": list(p["color_map"].keys())[0], "size": ["Standard"], "offers": {"price": str(base_price_idr)}}]

        print(f"Product: {name} (Variants: {len(variants_raw)})")

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

        for v in variants_raw:
            sku = v.get("sku") or v.get("productID", "")
            color_info = None

            for k, info in p["color_map"].items():
                if k in sku or sku in k:
                    color_info = info
                    break
            if not color_info:
                color_info = list(p["color_map"].values())[0]

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

                c_slug = color_info["slug"]
                c_name = color_info["name"]
                filename = f"{p['slug']}-{c_slug}-{img_idx}.jpg"
                filepath = os.path.join(IMG_DIR, filename)
                local_url = f"/images/products/{filename}"
                success = download_and_save_image(img_url, filepath)
                if success:
                    product_images.append({
                        "url": local_url,
                        "alt": f"{name} in {c_name} - Versace View {img_idx}",
                        "color_name": c_name,
                        "is_primary": 1 if (img_idx == 1 and len(product_images) == 0) else 0,
                        "display_order": len(product_images) + 1
                    })
                    img_idx += 1

        scraped_new_items.append({
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
            "care_guide": "Specialist luxury care or boutique service. Preserve in provided protective case.",
            "variants": product_variants,
            "images": product_images
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error scraping {p['slug']}: {e}")

# Load and update master catalog
with open("scraped_versace_catalog.json") as f:
    master_catalog = json.load(f)

# Update prod_07 category to cat_jewelry
for item in master_catalog:
    if item["id"] == "prod_07":
        item["category_id"] = "cat_jewelry"
        print("Updated prod_07 (Medusa Choker Necklace) category_id to cat_jewelry")

# Add new items (avoid duplicate IDs)
seen_ids = set(x["id"] for x in master_catalog)
for item in scraped_new_items:
    if item["id"] not in seen_ids:
        seen_ids.add(item["id"])
        master_catalog.append(item)

with open("scraped_versace_catalog.json", "w") as f:
    json.dump(master_catalog, f, indent=2)

print(f"\n==========================================")
print(f"Catalog updated! Total products: {len(master_catalog)}")
