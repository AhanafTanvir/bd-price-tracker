import re
import time
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime, timezone

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

# Expand this dictionary later to add RAM, Motherboards, etc!
CATEGORY_URLS = {
    "Graphics Cards": {
        "Star Tech": "https://www.startech.com.bd/component/graphics-card",
        "Ryans": "https://www.ryans.com/category/desktop-component-graphics-card",
        "PCB Store": "https://pcbstore.net/product-category/components/graphics-card/"
    },
    "Processors": {
        "Star Tech": "https://www.startech.com.bd/component/processor",
        "Ryans": "https://www.ryans.com/category/desktop-component-processor",
        "PCB Store": "https://pcbstore.net/product-category/components/processor/"
    },
    "Motherboards": {
        "Star Tech": "https://www.startech.com.bd/component/motherboard",
        "Ryans": "https://www.ryans.com/category/desktop-component-motherboard",
        "PCB Store": "https://pcbstore.net/product-category/components/motherboard/"
    },
    "RAM": {
        "Star Tech": "https://www.startech.com.bd/component/ram",
        "Ryans": "https://www.ryans.com/category/desktop-component-ram",
        "PCB Store": "https://pcbstore.net/product-category/components/ram/"
    },
    "Storage": {
        "Star Tech": "https://www.startech.com.bd/ssd",
        "Ryans": "https://www.ryans.com/category/desktop-component-internal-ssd",
        "PCB Store": "https://pcbstore.net/product-category/components/storage/"
    },
    "Power Supply": {
        "Star Tech": "https://www.startech.com.bd/component/power-supply",
        "Ryans": "https://www.ryans.com/category/desktop-component-power-supply",
        "PCB Store": "https://pcbstore.net/product-category/components/power-supply/"
    },
    "Casing": {
        "Star Tech": "https://www.startech.com.bd/component/casing",
        "Ryans": "https://www.ryans.com/category/desktop-component-casing",
        "PCB Store": "https://pcbstore.net/product-category/components/casing/"
    },
    "Laptop": {
        "Star Tech": "https://www.startech.com.bd/laptop-notebook/laptop",
        "Ryans": "https://www.ryans.com/category/laptop-all-laptop",
        "PCB Store": "https://pcbstore.net/product-category/laptop/"
    },
    "Monitors": {
        "Star Tech": "https://www.startech.com.bd/monitor",
        "Ryans": "https://www.ryans.com/category/monitor-all",
        "PCB Store": "https://pcbstore.net/product-category/monitor/"
    }
}

def clean_price(price_str):
    numbers = re.findall(r'\d+', price_str.replace(',', ''))
    return int(numbers[0]) if numbers else 0

def scrape_store(base_url, category, store_name, max_pages=4):
    products = []
    for page in range(1, max_pages + 1):
        if store_name == "PCB Store":
            url = f"{base_url}page/{page}/" if page > 1 else base_url
        else:
            url = f"{base_url}?page={page}" if page > 1 else base_url
            
        try:
            res = requests.get(url, headers=HEADERS, timeout=10)
            if res.status_code != 200: break
            soup = BeautifulSoup(res.text, "html.parser")
            
            if store_name == "Star Tech": items = soup.find_all("div", class_="p-item")
            elif store_name == "Ryans": items = soup.select(".category-single-product, .card")
            else: items = soup.select(".product-grid-item, .product")
                
            if not items: break # End of pagination
            
            for item in items:
                if store_name == "Star Tech":
                    name_tag = item.find("h4", class_="p-item-name")
                    price_tag = item.find("div", class_="p-item-price")
                    img_tag = item.find("div", class_="p-item-img")
                    img_url = img_tag.find("img")["src"] if img_tag and img_tag.find("img") else ""
                    link = name_tag.find("a")["href"] if name_tag and name_tag.find("a") else ""
                elif store_name == "Ryans":
                    name_tag = item.select_one(".card-text a, .product-name a")
                    price_tag = item.select_one(".pr-text, .price")
                    img_tag = item.select_one("img")
                    img_url = img_tag["src"] if img_tag and img_tag.has_attr("src") else ""
                    link = name_tag["href"] if name_tag and name_tag.has_attr("href") else ""
                else: # PCB Store
                    name_tag = item.select_one(".wd-entities-title, .woocommerce-loop-product__title")
                    price_tag = item.select_one(".price")
                    img_tag = item.select_one("img")
                    link_tag = item.select_one("a")
                    img_url = img_tag["src"] if img_tag and img_tag.has_attr("src") else ""
                    link = link_tag["href"] if link_tag and link_tag.has_attr("href") else ""

                if not name_tag or not price_tag: continue
                
                price = clean_price(price_tag.text.strip())
                name = name_tag.text.strip()
                
                # JUNK FILTER: Block batteries, cables, cooler blocks
                bad_words = ["battery", "cable", "block", "bracket"]
                
                if price > 0 and not any(w in name.lower() for w in bad_words):
                    products.append({
                        "name": name,
                        "category": category,
                        "store": store_name,
                        "price": price,
                        "rating": 4.8 if store_name == "Star Tech" else 4.7,
                        "imageUrl": img_url,
                        "productUrl": link,
                        "inStock": True,
                        "updatedAt": datetime.now(timezone.utc).isoformat()
                    })
            
            print(f"   -> {store_name}: Scraped page {page} ({len(items)} items checked)")
            time.sleep(1) # Prevent getting banned by the store
            
        except Exception as e:
            print(f"[{store_name} Error on page {page}]: {e}")
            
    return products

def run_scraper():
    all_deals = []
    print("🚀 Starting Deep Pagination Scraper...")
    
    for category, stores in CATEGORY_URLS.items():
        print(f"\n📁 Scraping {category}...")
        for store_name, url in stores.items():
            all_deals.extend(scrape_store(url, category, store_name, max_pages=4))

    try:
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=3000)
        db = client["price_aggregator"]
        collection = db["products"]
        
        collection.delete_many({}) # Clear old limits
        
        for deal in all_deals:
            collection.update_one(
                {"name": deal["name"], "store": deal["store"]},
                {"$set": deal},
                upsert=True
            )
        print(f"\n✅ SUCCESS: Added {len(all_deals)} verified components to MongoDB!")
    except Exception as e:
        print(f"⚠️ MongoDB error: {e}")

if __name__ == "__main__":
    run_scraper()
