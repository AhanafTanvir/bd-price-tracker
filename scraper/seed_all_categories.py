import re
import time
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime, timezone

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

CATEGORIES = [
    {
        "category": "Motherboards",
        "url": "https://www.startech.com.bd/component/motherboard?limit=50",
        "keywords": "motherboard motherboards mobo mainboard am4 am5 lga1700 b650 b760 z790 h610 a520"
    },
    {
        "category": "RAM",
        "url": "https://www.startech.com.bd/component/ram?limit=50",
        "keywords": "ram memory desktop ram ddr4 ddr5 8gb 16gb 32gb 3200mhz 6000mhz"
    },
    {
        "category": "Storage",
        "url": "https://www.startech.com.bd/ssd?limit=50",
        "keywords": "storage ssd nvme m.2 pcie gen4 sata solid state drive 500gb 1tb 2tb"
    },
    {
        "category": "Power Supply",
        "url": "https://www.startech.com.bd/component/power-supply?limit=50",
        "keywords": "power supply psu 80 plus bronze gold 550w 650w 750w 850w smps power & cases"
    },
    {
        "category": "Casing",
        "url": "https://www.startech.com.bd/component/casing?limit=50",
        "keywords": "casing case chassis tower atx gaming case rgb tempered glass power & cases"
    },
    {
        "category": "Laptop",
        "url": "https://www.startech.com.bd/laptop-notebook/laptop?limit=50",
        "keywords": "laptop laptops notebook ultrabook gaming laptop macbook oled"
    },
    {
        "category": "Graphics Cards",
        "url": "https://www.startech.com.bd/component/graphics-card?limit=50",
        "keywords": "graphics cards graphics card gpu rtx gtx rx nvidia radeon"
    },
    {
        "category": "Processors",
        "url": "https://www.startech.com.bd/component/processor?limit=50",
        "keywords": "processors processor cpu intel core ryzen amd"
    },
    {
        "category": "Monitors",
        "url": "https://www.startech.com.bd/monitor?limit=50",
        "keywords": "monitors monitor gaming monitor ips 144hz 165hz 180hz 240hz 2k 4k"
    }
]

def clean_price(price_tag):
    if not price_tag:
        return 0
    # Try finding new price span first
    new_span = price_tag.find("span", class_="price-new")
    target_text = new_span.text if new_span else price_tag.text
    numbers = re.findall(r'\d+', target_text.replace(',', ''))
    return int(numbers[0]) if numbers else 0

def scrape_startech_category(cat_info):
    products = []
    url = cat_info["url"]
    category = cat_info["category"]
    keywords = cat_info["keywords"]
    
    print(f"\n Scraping category: {category} -> {url}")
    try:
        res = requests.get(url, headers=HEADERS, timeout=15)
        if res.status_code != 200:
            print(f" Failed with HTTP {res.status_code}")
            return products

        soup = BeautifulSoup(res.text, "html.parser")
        items = soup.find_all("div", class_="p-item")
        print(f" Found {len(items)} items for {category}")

        for item in items:
            name_tag = item.find("h4", class_="p-item-name")
            price_tag = item.find("div", class_="p-item-price")
            img_tag = item.find("div", class_="p-item-img")

            if not name_tag or not price_tag:
                continue

            name = name_tag.text.strip()
            price = clean_price(price_tag)
            if price <= 0:
                continue

            # Skip small accessories / noise
            bad_words = ["battery", "cable", "bracket", "screw", "sata cable", "converter"]
            if any(b in name.lower() for b in bad_words):
                continue

            # Extract specs
            specs = [li.text.strip() for li in item.find_all("li") if li.text.strip()]
            if not specs:
                specs = [category, "Official BD Warranty", "Verified In-Stock"]

            # Image URL
            img_url = ""
            if img_tag and img_tag.find("img"):
                img_url = img_tag.find("img").get("src", "")

            # Product Link
            product_url = ""
            link_a = name_tag.find("a")
            if link_a and link_a.has_attr("href"):
                product_url = link_a["href"]

            products.append({
                "name": name,
                "category": category,
                "keyword": f"{keywords} {name.lower()}",
                "store": "Star Tech",
                "price": price,
                "rating": 4.8,
                "specs": specs,
                "imageUrl": img_url,
                "productUrl": product_url,
                "inStock": True,
                "updatedAt": datetime.now(timezone.utc).isoformat()
            })

    except Exception as e:
        print(f" Error scraping {category}: {e}")

    return products

def main():
    all_products = []
    for cat in CATEGORIES:
        prods = scrape_startech_category(cat)
        all_products.extend(prods)
        time.sleep(1) # respectful delay

    print(f"\n Total scraped products: {len(all_products)}")

    try:
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=4000)
        db = client["price_aggregator"]
        collection = db["products"]

        inserted = 0
        updated = 0
        for p in all_products:
            res = collection.update_one(
                {"name": p["name"], "store": p["store"]},
                {"$set": p},
                upsert=True
            )
            if res.upserted_id:
                inserted += 1
            else:
                updated += 1

        print(f" MongoDB Sync Complete! Inserted: {inserted}, Updated: {updated}")
        total_now = collection.count_documents({})
        print(f" Total products now in database: {total_now}")
        distinct_cats = collection.distinct("category")
        print(f" Current categories in database: {distinct_cats}")

    except Exception as e:
        print(f" MongoDB Error: {e}")

if __name__ == "__main__":
    main()
