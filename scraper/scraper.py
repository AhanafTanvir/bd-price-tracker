import re
import json
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime, timezone

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}

# 1. THE COMPLETE CATEGORY MAP
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

def scrape_startech(url, category):
    products = []
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")
        for item in soup.find_all("div", class_="p-item"):
            name_tag = item.find("h4", class_="p-item-name")
            price_tag = item.find("div", class_="p-item-price")
            img_tag = item.find("div", class_="p-item-img")
            
            if not name_tag or not price_tag: continue
            
            price = clean_price(price_tag.text.strip())
            if price > 0:
                products.append({
                    "name": name_tag.text.strip(),
                    "category": category,
                    "store": "Star Tech",
                    "price": price,
                    "rating": 4.8,
                    "imageUrl": img_tag.find("img")["src"] if img_tag and img_tag.find("img") else "",
                    "productUrl": name_tag.find("a")["href"] if name_tag.find("a") else "",
                    "inStock": True,
                    "updatedAt": datetime.now(timezone.utc).isoformat()
                })
    except Exception as e:
        print(f"[Star Tech Error - {category}]: {e}")
    return products

def scrape_ryans(url, category):
    products = []
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")
        for item in soup.select(".category-single-product, .card"):
            name_tag = item.select_one(".card-text a, .product-name a")
            price_tag = item.select_one(".pr-text, .price")
            img_tag = item.select_one("img")
            
            if not name_tag or not price_tag: continue
            
            price = clean_price(price_tag.text.strip())
            if price > 0:
                products.append({
                    "name": name_tag.text.strip(),
                    "category": category,
                    "store": "Ryans",
                    "price": price,
                    "rating": 4.7,
                    "imageUrl": img_tag["src"] if img_tag and img_tag.has_attr("src") else "",
                    "productUrl": name_tag["href"] if name_tag.has_attr("href") else "",
                    "inStock": True,
                    "updatedAt": datetime.now(timezone.utc).isoformat()
                })
    except Exception as e:
        print(f"[Ryans Error - {category}]: {e}")
    return products

def scrape_pcbstore(url, category):
    products = []
    try:
        res = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")
        for item in soup.select(".product-grid-item, .product"):
            name_tag = item.select_one(".wd-entities-title, .woocommerce-loop-product__title")
            price_tag = item.select_one(".price")
            img_tag = item.select_one("img")
            link_tag = item.select_one("a")
            
            if not name_tag or not price_tag: continue
            
            price = clean_price(price_tag.text.strip())
            if price > 0:
                products.append({
                    "name": name_tag.text.strip(),
                    "category": category,
                    "store": "PCB Store",
                    "price": price,
                    "rating": 4.6,
                    "imageUrl": img_tag["src"] if img_tag and img_tag.has_attr("src") else "",
                    "productUrl": link_tag["href"] if link_tag and link_tag.has_attr("href") else "",
                    "inStock": True,
                    "updatedAt": datetime.now(timezone.utc).isoformat()
                })
    except Exception as e:
        print(f"[PCB Store Error - {category}]: {e}")
    return products

def run_scraper():
    all_deals = []
    
    print("🚀 Starting Category-Based Hardware Scraper...")
    for category, stores in CATEGORY_URLS.items():
        print(f"\n📁 Scraping Category: {category}")
        
        if "Star Tech" in stores:
            all_deals.extend(scrape_startech(stores["Star Tech"], category))
        if "Ryans" in stores:
            all_deals.extend(scrape_ryans(stores["Ryans"], category))
        if "PCB Store" in stores:
            all_deals.extend(scrape_pcbstore(stores["PCB Store"], category))

    # Try saving to MongoDB
    try:
        client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=3000)
        db = client["price_aggregator"]
        collection = db["products"]
        
        # Optional: Clear old keyword-based junk data before inserting clean category data
        # collection.delete_many({}) 
        
        for deal in all_deals:
            collection.update_one(
                {"name": deal["name"], "store": deal["store"]},
                {"$set": deal},
                upsert=True
            )
        print(f"\n✅ Successfully synced {len(all_deals)} clean hardware components to MongoDB!")
    except Exception as e:
        print(f"⚠️ MongoDB sync error: {e}")

if __name__ == "__main__":
    run_scraper()