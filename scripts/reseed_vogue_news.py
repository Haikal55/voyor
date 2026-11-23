import urllib.request
import re
import json
import sqlite3
import os
import time
from bs4 import BeautifulSoup

DB_PATH = "voyor.db"

ARTICLES_CONFIG = [
    {
        "url": "https://www.vogue.com/article/western-brands-need-a-new-china-playbook",
        "category": "Runway Couture",
        "default_author": "Zofia Zwieglinska",
        "default_role": "International Luxury Fashion Critic",
        "is_featured": True,
        "is_trending": False
    },
    {
        "url": "https://www.vogue.com/article/what-the-eus-plan-to-abandon-the-green-claims-directive-means-for-fashion",
        "category": "Runway Couture",
        "default_author": "Rachel Cernansky",
        "default_role": "European Fashion Features Director",
        "is_featured": False,
        "is_trending": True
    },
    {
        "url": "https://www.vogue.com/article/mario-sorrenti-the-life-behind-the-images",
        "category": "Photovogue",
        "default_author": "Alessia Glaviano",
        "default_role": "Global Head of Photovogue & Visual Director",
        "is_featured": False,
        "is_trending": True
    },
    {
        "url": "https://www.vogue.com/article/chinas-luxury-problem-is-bigger-than-the-economy",
        "category": "Fashion",
        "default_author": "Casey Hall",
        "default_role": "Senior Haute Couture & Markets Editor",
        "is_featured": False,
        "is_trending": True
    },
    {
        "url": "https://www.vogue.com/article/the-new-rules-for-selling-beauty-in-china",
        "category": "The Edit & Trends",
        "default_author": "Denni Hu",
        "default_role": "Atelier Milano Special Correspondent",
        "is_featured": False,
        "is_trending": True
    },
    {
        "url": "https://www.vogue.com/article/who-will-win-the-chinese-sportswear-race",
        "category": "Fashion",
        "default_author": "Chavie Lieber",
        "default_role": "Senior Fashion Business Critic",
        "is_featured": False,
        "is_trending": False
    },
    {
        "url": "https://www.vogue.com/article/connor-storrie-best-dressed-2026-digital-cover",
        "category": "Celebrity Style",
        "default_author": "Christian Allaire",
        "default_role": "Fashion Features & Celebrity Style Editor",
        "is_featured": False,
        "is_trending": False
    },
    {
        "url": "https://www.vogue.com/article/sheroanawe-hakihiiwe-ica-miami",
        "category": "Culture & Arts",
        "default_author": "Liam Hess",
        "default_role": "Culture & Visual Arts Director",
        "is_featured": False,
        "is_trending": False
    },
    {
        "url": "https://www.vogue.com/article/best-airbnbs-palm-springs",
        "category": "The Edit & Trends",
        "default_author": "Elise Taylor",
        "default_role": "Living & Architectural Design Editor",
        "is_featured": False,
        "is_trending": False
    },
    {
        "url": "https://www.vogue.com/article/the-body-costume-designer-mirren-gordon-crozier-interview",
        "category": "Runway Couture",
        "default_author": "Radhika Seth",
        "default_role": "Haute Couture & Film Features Editor",
        "is_featured": False,
        "is_trending": False
    },
    {
        "url": "https://www.vogue.com/article/best-documentaries-of-2026",
        "category": "Culture & Arts",
        "default_author": "Marley Marius",
        "default_role": "Contributing Arts Editor",
        "is_featured": False,
        "is_trending": False
    },
    {
        "url": "https://www.vogue.com/article/new-orleans-guide",
        "category": "Culture & Arts",
        "default_author": "Michaela Trimble",
        "default_role": "Global Travel & Culture Writer",
        "is_featured": False,
        "is_trending": False
    }
]

def clean_text(s):
    if not s: return ""
    s = re.sub(r'<[^>]+>', ' ', s)
    s = s.replace('&amp;', '&').replace('&#39;', "'").replace('&quot;', '"').replace('&nbsp;', ' ')
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def clean_html_with_links(el):
    if not el: return ""
    copy_soup = BeautifulSoup(str(el), 'html.parser')
    root = copy_soup.find(['p', 'h2', 'h3'])
    if not root:
        root = copy_soup

    for tag in root.find_all(True):
        if tag.name == 'a':
            href = tag.get('href', '').strip()
            if not href or any(k in href for k in ['sign-in', 'account', 'facebook', 'twitter', 'pinterest']):
                tag.unwrap()
                continue
            if href.startswith('/'):
                href = f"https://www.vogue.com{href}"
            tag.attrs = {
                'href': href,
                'target': '_blank',
                'rel': 'noopener noreferrer',
                'class': 'editorial-link text-white underline decoration-[#a7c080]/60 hover:decoration-[#a7c080] hover:text-[#a7c080] underline-offset-4 transition-colors font-medium'
            }
        elif tag.name in ['strong', 'b', 'em', 'i']:
            tag.attrs = {}
        else:
            tag.unwrap()

    html_str = ''.join(str(c) for c in root.contents)
    html_str = re.sub(r'\s+', ' ', html_str).strip()
    return html_str

def is_spam(t):
    l = t.lower()
    return any(k in l for k in [
        'wishlist', 'favorite look', 'vote now', 'condé nast', 'conde nast',
        'see more stories', 'more great', 'more fashion stories', 'more stories from',
        'affiliate partnerships', 'ad choices', 'all rights reserved', 'cn fashion',
        'sign in', 'newsletter', 'vogue club', 'photo:', 'photos:', 'all products featured',
        'vogue may earn a portion', 'save story', 'sign up', 'inside rebecca hall',
        'a guide to the great italian cocktails', 'meet the women leading norway'
    ])

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')

def fetch_and_clean_article(cfg, idx):
    url = cfg["url"]
    print(f"[{idx+1}/{len(ARTICLES_CONFIG)}] Processing: {url.split('/')[-1]}")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    
    with urllib.request.urlopen(req, timeout=12) as resp:
        html = resp.read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Metadata from JSON-LD
    ld = {}
    for s in soup.find_all('script', type='application/ld+json'):
        try:
            d = json.loads(s.string)
            if isinstance(d, list): d = d[0]
            if d.get('@type') in ['NewsArticle', 'Article']:
                ld = d
                break
        except: pass
        
    title = clean_text(ld.get('headline') or (soup.find('h1').get_text().strip() if soup.find('h1') else ''))
    subtitle = clean_text(ld.get('description') or '')
    
    author = cfg["default_author"]
    if ld.get('author'):
        if isinstance(ld['author'], list) and len(ld['author']) > 0:
            author = ld['author'][0].get('name', author)
        elif isinstance(ld['author'], dict):
            author = ld['author'].get('name', author)
            
    # Hero image
    hero_img = ""
    if ld.get('image'):
        if isinstance(ld['image'], list) and len(ld['image']) > 0:
            hero_img = ld['image'][0]
        elif isinstance(ld['image'], str):
            hero_img = ld['image']
    if not hero_img:
        for img in soup.find_all('img'):
            src = img.get('src') or ''
            if 'assets.vogue.com/photos' in src and 'w_120' not in src:
                hero_img = re.sub(r'w_\d+', 'w_1600', src)
                break
                
    keywords = ld.get('keywords', [])
    if isinstance(keywords, str):
        keywords = [k.strip() for k in keywords.split(',')]
    if not keywords:
        keywords = [cfg['category'], "Vogue", "Haute Couture", "Atelier Milano"]
        
    art = soup.find('article') or soup.find('div', class_=re.compile(r'article__body'))
    raw_elements = art.find_all(['h2', 'h3', 'p', 'figure', 'picture', 'img']) if art else []
    
    blocks = []
    seen_texts = set()
    seen_imgs = set()
    gallery_images = []
    
    if hero_img:
        hero_img_high = re.sub(r'w_\d+', 'w_1600', hero_img)
        seen_imgs.add(hero_img_high)
        gallery_images.append({"url": hero_img_high, "alt": title, "caption": f"Editorial documentation via Vogue Archives. Reported by {author}."})

    # Collect all article photos first
    article_photos = []
    if art:
        for img in art.find_all('img'):
            src = img.get('src') or img.get('data-src') or ''
            if 'assets.vogue.com/photos' in src and '1:1' not in src:
                high_res = re.sub(r'w_\d+', 'w_1600', src)
                if high_res not in article_photos and high_res != hero_img:
                    article_photos.append(high_res)

    for el in raw_elements:
        if el.name in ['h2', 'h3']:
            txt_clean = clean_text(el.get_text())
            if not txt_clean or len(txt_clean) < 3 or len(txt_clean) > 140 or is_spam(txt_clean):
                continue
            if blocks and blocks[-1]["type"] == "heading":
                continue
                
            # If heading has an affiliate / external link, preserve it
            a_tag = el.find('a')
            if a_tag and a_tag.get('href'):
                h_link = a_tag.get('href').strip()
                if h_link.startswith('/'): h_link = f"https://www.vogue.com{h_link}"
                heading_html = f'<a href="{h_link}" target="_blank" rel="noopener noreferrer" class="hover:text-[#a7c080] transition-colors">{txt_clean}</a>'
            else:
                heading_html = txt_clean
                
            blocks.append({"type": "heading", "text": heading_html})
            
        elif el.name == 'p':
            txt_clean = clean_text(el.get_text())
            if not txt_clean or len(txt_clean) < 25 or is_spam(txt_clean):
                continue
            if txt_clean in seen_texts:
                continue
            seen_texts.add(txt_clean)
            
            # Preserve rich inline hyperlinks!
            p_html = clean_html_with_links(el)
            blocks.append({"type": "paragraph", "text": p_html})
            
        elif el.name == 'figure':
            img = el.find('img')
            if img:
                src = img.get('src') or img.get('data-src') or ''
                if 'assets.vogue.com/photos' in src:
                    high_res = re.sub(r'w_\d+', 'w_1600', src)
                    if high_res not in seen_imgs:
                        seen_imgs.add(high_res)
                        cap = el.find('figcaption')
                        cap_txt = clean_text(cap.get_text()) if cap else ""
                        if is_spam(cap_txt): cap_txt = ""
                        
                        img_block = {
                            "type": "image",
                            "url": high_res,
                            "caption": cap_txt or f"Photography curated via Vogue Archives."
                        }
                        if len(blocks) >= 2 and blocks[-1]["type"] == "image" and blocks[-2]["type"] == "image":
                            pass
                        else:
                            blocks.append(img_block)
                            
                        gallery_images.append({"url": high_res, "alt": cap_txt or title, "caption": cap_txt or title})

    # If article has fewer than 2 images in body, interleave extra photos from article_photos
    current_img_count = sum(1 for b in blocks if b["type"] == "image")
    if current_img_count < 3 and article_photos:
        interleaved_blocks = []
        p_since_img = 0
        photo_idx = 0
        for b in blocks:
            interleaved_blocks.append(b)
            if b["type"] == "paragraph":
                p_since_img += 1
                if p_since_img >= 6 and photo_idx < len(article_photos):
                    img_url = article_photos[photo_idx]
                    photo_idx += 1
                    p_since_img = 0
                    interleaved_blocks.append({
                        "type": "image",
                        "url": img_url,
                        "caption": f"Editorial photography documented via Vogue Archives."
                    })
                    if not any(g["url"] == img_url for g in gallery_images):
                        gallery_images.append({"url": img_url, "alt": title, "caption": title})
        blocks = interleaved_blocks

    # If the article has NO headings, inject 3 elegant contextual headings to form 4-5 chapters
    heading_count = sum(1 for b in blocks if b["type"] == "heading")
    if heading_count == 0 and len(blocks) > 6:
        new_blocks = []
        p_count = 0
        h_injected = 0
        h_titles = [
            "The Aesthetic Architecture",
            "A Reframing of Modern Luxury",
            "Sensory Nuance & Atelier Craftsmanship",
            "Looking Toward Tomorrow's Horizon"
        ]
        for b in blocks:
            if b["type"] == "paragraph":
                p_count += 1
                if p_count in [3, 8, 14, 22] and h_injected < len(h_titles):
                    new_blocks.append({"type": "heading", "text": h_titles[h_injected]})
                    h_injected += 1
            new_blocks.append(b)
        blocks = new_blocks

    # Remove any trailing orphan headings
    while blocks and blocks[-1]["type"] == "heading":
        blocks.pop()

    # Calculate words & reading time
    p_texts = [clean_text(b["text"]) for b in blocks if b["type"] == "paragraph"]
    word_count = sum(len(t.split()) for t in p_texts)
    reading_min = max(3, round(word_count / 180))
    reading_time = f"{reading_min} min read"
    
    slug = slugify(title) or url.split('/')[-1]
    
    # Clean plain text content for search / sitemap / meta
    content = "\n\n".join(p_texts)
    
    return {
        "id": f"art_vogue_{idx+1}",
        "slug": slug,
        "title": title,
        "subtitle": subtitle,
        "category": cfg["category"],
        "author": author,
        "author_role": cfg["default_role"],
        "published_at": int(time.time() * 1000) - (idx * 86400000 * 2), # staggered dates
        "hero_image": hero_img or gallery_images[0]["url"],
        "hero_image_alt": title,
        "hero_image_caption": f"Editorial photography via Vogue Archives. Documented by {author}.",
        "content": content,
        "reading_time": reading_time,
        "is_featured": 1 if cfg["is_featured"] else 0,
        "is_trending": 1 if cfg["is_trending"] else 0,
        "tags_json": json.dumps(keywords[:5]),
        "blocks_json": json.dumps(blocks),
        "gallery_json": json.dumps(gallery_images),
        "source_url": url,
        "created_at": int(time.time() * 1000)
    }

def main():
    print("Connecting to database:", DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Ensure table exists
    cur.execute("""
    CREATE TABLE IF NOT EXISTS news_articles (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      author_role TEXT DEFAULT 'Senior Fashion Critic',
      published_at INTEGER,
      hero_image TEXT NOT NULL,
      hero_image_alt TEXT,
      hero_image_caption TEXT,
      content TEXT NOT NULL,
      reading_time TEXT DEFAULT '4 min read',
      is_featured INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      tags_json TEXT,
      blocks_json TEXT,
      gallery_json TEXT,
      source_url TEXT,
      created_at INTEGER
    );
    """)
    
    # Wipe old messy articles
    cur.execute("DELETE FROM news_articles")
    print("Wiped old news_articles table.")
    
    all_articles = []
    for idx, cfg in enumerate(ARTICLES_CONFIG):
        try:
            art = fetch_and_clean_article(cfg, idx)
            cur.execute("""
            INSERT INTO news_articles (
              id, slug, title, subtitle, category, author, author_role,
              published_at, hero_image, hero_image_alt, hero_image_caption,
              content, reading_time, is_featured, is_trending, tags_json,
              blocks_json, gallery_json, source_url, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                art["id"], art["slug"], art["title"], art["subtitle"], art["category"],
                art["author"], art["author_role"], art["published_at"], art["hero_image"],
                art["hero_image_alt"], art["hero_image_caption"], art["content"],
                art["reading_time"], art["is_featured"], art["is_trending"],
                art["tags_json"], art["blocks_json"], art["gallery_json"],
                art["source_url"], art["created_at"]
            ))
            all_articles.append(art)
            print(f"  ✓ Saved: {art['title'][:45]} ({len(json.loads(art['blocks_json']))} blocks)")
        except Exception as e:
            print(f"  ✗ Failed {cfg['url']}: {e}")
            
    conn.commit()
    cur.execute("PRAGMA wal_checkpoint(TRUNCATE);")
    conn.close()
    
    # Save JSON backup
    backup_path = os.path.join("scripts", "vogue_scraped_news.json")
    with open(backup_path, "w", encoding="utf-8") as f:
        json.dump(all_articles, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(all_articles)} pristine articles to {backup_path}")
    
    # Sync to standalone if present
    standalone_db = os.path.join(".next", "standalone", "voyor.db")
    if os.path.exists(os.path.dirname(standalone_db)):
        import shutil
        shutil.copy2(DB_PATH, standalone_db)
        print("Synchronized voyor.db to standalone.")

if __name__ == "__main__":
    main()
