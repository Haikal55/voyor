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

PRODUCTS_TO_SCRAPE = [
    {
        "id": "prod_01",
        "slug": "printed-cotton-jersey-slim-t-shirt",
        "category_id": "cat_men",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/clothing/t-shirts-polos/printed-cotton-jersey-slim-t-shirt/1026452-1A19929_1B000.html",
        "color_map": {
            "1026452-1A19929_1B000": {"name": "Black", "hex": "#111111", "slug": "black"},
            "1026452-1A19929_1W000": {"name": "White", "hex": "#FFFFFF", "slug": "white"},
        }
    },
    {
        "id": "prod_02",
        "slug": "printed-nylon-padded-jacket",
        "category_id": "cat_men",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/men/clothing/jackets-coats/jackets/printed-nylon-padded-jacket/1027330-1A19434_1UF50.html",
        "color_map": {
            "1027330-1A19434_1LJ80": {"name": "Purple Barocco", "hex": "#4B2840", "slug": "purple"},
            "1027330-1A19434_1UF50": {"name": "Royal Blue Barocco", "hex": "#1D3B6C", "slug": "blue"},
        }
    },
    {
        "id": "prod_03",
        "slug": "embleme-nappa-hobo-bag",
        "category_id": "cat_accessories",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/bags/shoulder-crossbody/embleme-nappa-hobo-bag/1026199-1A17449_1UR9J.html",
        "color_map": {
            "1026199-1A17449_1B55J": {"name": "Nero Black", "hex": "#141414", "slug": "black"},
            "1026199-1A17449_1NL3J": {"name": "Tangerine Orange", "hex": "#D95D22", "slug": "orange"},
            "1026199-1A17449_1NH4J": {"name": "Camel Dune", "hex": "#C29B72", "slug": "camel"},
            "1026199-1A17449_1UR9J": {"name": "Capri Blue", "hex": "#2B588C", "slug": "blue"},
        }
    },
    {
        "id": "prod_04",
        "slug": "envers-satin-gown",
        "category_id": "cat_women",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/women/clothing/dresses/envers-satin-gown/1028155-1A10194_1RH70.html",
        "color_map": {
            "1028155-1A10194_1RH70": {"name": "Rosso Red", "hex": "#9B1A24", "slug": "red"},
            "1028155-1A10194_1UR80": {"name": "Cobalt Blue", "hex": "#1E3F78", "slug": "blue"},
        }
    },
    {
        "id": "prod_05",
        "slug": "printed-silk-twill-regular-shirt",
        "category_id": "cat_men",
        "is_runway": 1,
        "is_new": 0,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/clothing/shirts/printed-silk-twill-regular-shirt/1027642-1A19744_5E860.html",
        "color_map": {
            "1027642-1A19744_5NB00": {"name": "Barocco Oro & Nero", "hex": "#D4AF37", "slug": "oro"}
        }
    },
    {
        "id": "prod_06",
        "slug": "lace-wool-blend-mini-dress",
        "category_id": "cat_women",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/women/clothing/knitwear/lace-wool-blend-mini-dress/1027683-1A19449_1B000.html",
        "color_map": {
            "1027683-1A19449_1B000": {"name": "Nero Couture", "hex": "#111111", "slug": "nero"}
        }
    },
    {
        "id": "prod_07",
        "slug": "medusa-choker-necklace",
        "category_id": "cat_women",
        "is_runway": 1,
        "is_new": 0,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/women/fashion-jewelry/necklaces/medusa-necklace/DG16949-DJMT_KOT.html",
        "color_map": {
            "DG16949-DJMT_KOT": {"name": "Tribute Gold", "hex": "#E5B80B", "slug": "gold"}
        }
    },
    {
        "id": "prod_08",
        "slug": "valentina-embellished-satin-sandals-105-mm",
        "category_id": "cat_women",
        "is_runway": 1,
        "is_new": 1,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/women/shoes/sandals/high-heel-sandals/valentina-embellished-satin-sandals-105-mm/1027289-1A19894_1B55J.html",
        "color_map": {
            "1027289-1A19894_1B55J": {"name": "Nero Satin & Crystal", "hex": "#0D0D0D", "slug": "nero"}
        }
    },
    {
        "id": "prod_09",
        "slug": "lou-leather-backpack",
        "category_id": "cat_men",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/bags/backpacks/lou-leather-backpack/1024360-1A18107_1B55J.html",
        "color_map": {
            "1024360-1A18107_1B55J": {"name": "Nero Leather", "hex": "#121212", "slug": "nero"}
        }
    },
    {
        "id": "prod_10",
        "slug": "medusa-biggie-leather-belt",
        "category_id": "cat_men",
        "is_runway": 0,
        "is_new": 0,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/accessories/belts/medusa-biggie-leather-belt-1.2/1003760-DVTP1_1B00V.html",
        "color_map": {
            "1003760-DVTP1_1B00V": {"name": "Nero & Oro Medusa", "hex": "#1A1A1A", "slug": "nero"}
        }
    },
    {
        "id": "prod_11",
        "slug": "eros-energy-eau-de-parfum",
        "category_id": "cat_parfumerie",
        "is_runway": 0,
        "is_new": 1,
        "is_bestseller": 1,
        "url": "https://www.versace.com/id/en/men/accessories/fragrances-body-care/eros/eros-energy-edp-50-ml/R742008-R050MLS_RNUL.html",
        "fallback_title": "Eros Energy Eau de Parfum (100 ml)",
        "fallback_desc": "Inspired by the breath-taking beauty of the Mediterranean coastline, Eros Energy is the fresh, vibrant fragrance of passionate citrus and Italian sun.",
        "fallback_price": 2850000.0,
        "color_map": {
            "R742008-R050MLS_RNUL": {"name": "Pure Citrus Gold", "hex": "#D4AF37", "slug": "gold"}
        }
    },
    {
        "id": "prod_12",
        "slug": "roomy-leather-wallet",
        "category_id": "cat_accessories",
        "is_runway": 0,
        "is_new": 0,
        "is_bestseller": 0,
        "url": "https://www.versace.com/id/en/men/accessories/wallets/bifold-wallets/roomy-leather-wallet/DPU6737-1A18566_2B0AJ.html",
        "color_map": {
            "DPU6737-1A18566_2B0AJ": {"name": "Nero Bifold", "hex": "#141414", "slug": "nero"}
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

scraped_catalog = []

for p in PRODUCTS_TO_SCRAPE:
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
                    data = data[0]
                if data.get("@type") in ("ProductGroup", "Product"):
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
            variants_raw = [{"sku": list(p["color_map"].keys())[0], "size": ["100 ml"], "offers": {"price": str(base_price_idr)}}]

        print(f"Product: {name} (Variants: {len(variants_raw)})")

        product_variants = []
        product_images = []

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
                raw_imgs = re.findall(r'https://www\.versace\.com/dw/image/v2/[^\"\'\s]+\.jpg', r.text)
                raw_imgs = list(dict.fromkeys(raw_imgs))

            if isinstance(raw_imgs, str):
                raw_imgs = [raw_imgs]

            img_idx = 1
            for img_url in raw_imgs[:3]:
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
                        "display_order": img_idx
                    })
                    img_idx += 1

        scraped_catalog.append({
            "id": p["id"],
            "slug": p["slug"],
            "name": name,
            "subtitle": f"Versace Atelier Milano • Authentic Collection",
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

with open("scraped_versace_catalog.json", "w") as f:
    json.dump(scraped_catalog, f, indent=2)

print("\nFinished scraping! Total products saved to scraped_versace_catalog.json:", len(scraped_catalog))
