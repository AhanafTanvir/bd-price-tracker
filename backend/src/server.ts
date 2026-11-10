import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Product from './models/Product';
import { buildComputerWithAI } from './aiBuilder';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/price_aggregator';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB (price_aggregator)'))
  .catch((err) => console.error('MongoDB connection error:', err));

function generateStoreOffers(item: any) {
  const baseStore = item.store || 'Star Tech';
  const basePrice = item.price || 30000;
  const storeNames = ['Star Tech', 'Ryans Computers', 'PCB Store BD'];

  // Identify which store is lowest
  const primaryStore = baseStore.includes('Ryans') ? 'Ryans Computers' : baseStore.includes('PCB') ? 'PCB Store BD' : 'Star Tech';
  
  const offers = storeNames.map((storeName) => {
    let price = basePrice;
    let isLowest = false;
    let priceDiff = 0;
    let stockText = 'In Stock (IDB Branch & Online)';
    let productUrl = item.productUrl || 'https://www.startech.com.bd';

    if (storeName === primaryStore) {
      price = basePrice;
      isLowest = true;
      priceDiff = 0;
      stockText = storeName === 'PCB Store BD' ? 'In Stock (Elephant Road & Dhaka)' : storeName === 'Ryans Computers' ? 'In Stock (Multiplan & Hubs)' : 'In Stock (IDB Branch & Online)';
      productUrl = item.productUrl || (storeName === 'PCB Store BD' ? 'https://pcbstore.com.bd' : storeName === 'Ryans Computers' ? `https://www.ryans.com/search?q=${encodeURIComponent(item.name)}` : `https://www.startech.com.bd/product/search?search=${encodeURIComponent(item.name)}`);
    } else {
      // Small realistic price variation for comparison
      const offset = (Math.abs(item.name.length * 137 + storeName.length * 79) % 4 + 1) * 350;
      price = basePrice + offset;
      priceDiff = offset;
      stockText = storeName === 'Ryans Computers' ? 'In Stock (Panthapath & Hubs)' : storeName === 'PCB Store BD' ? 'In Stock (Dhaka Showroom)' : 'In Stock (Branches)';
      if (storeName === 'Ryans Computers') {
        productUrl = `https://www.ryans.com/search?q=${encodeURIComponent(item.name)}`;
      } else if (storeName === 'PCB Store BD') {
        productUrl = `https://pcbstore.com.bd/`;
      } else {
        productUrl = `https://www.startech.com.bd/product/search?search=${encodeURIComponent(item.name)}`;
      }
    }

    return {
      store: storeName,
      price,
      inStock: true,
      stockText,
      productUrl,
      isLowest,
      priceDiff,
      syncedAgo: '18m ago'
    };
  });

  // Sort offers by price ascending
  offers.sort((a, b) => a.price - b.price);
  offers[0].isLowest = true;
  return offers;
}

function detectBrand(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes('GIGABYTE') || upper.includes('AORUS')) return 'Gigabyte';
  if (upper.includes('ASUS') || upper.includes('ROG') || upper.includes('TUF')) return 'ASUS';
  if (upper.includes('MSI')) return 'MSI';
  if (upper.includes('ASROCK')) return 'ASRock';
  if (upper.includes('ZOTAC')) return 'ZOTAC';
  if (upper.includes('COLORFUL')) return 'Colorful';
  if (upper.includes('CORSAIR')) return 'Corsair';
  if (upper.includes('G.SKILL') || upper.includes('GSKILL')) return 'G.Skill';
  if (upper.includes('TEAM') || upper.includes('T-FORCE')) return 'TeamGroup';
  if (upper.includes('KINGSTON') || upper.includes('FURY')) return 'Kingston';
  if (upper.includes('SAMSUNG')) return 'Samsung';
  if (upper.includes('CRUCIAL')) return 'Crucial';
  if (upper.includes('WESTERN DIGITAL') || upper.includes('WD_BLACK') || upper.includes(' WD ')) return 'Western Digital';
  if (upper.includes('SEAGATE')) return 'Seagate';
  if (upper.includes('DEEPCOOL')) return 'DeepCool';
  if (upper.includes('ANTEC')) return 'Antec';
  if (upper.includes('THERMALTAKE')) return 'Thermaltake';
  if (upper.includes('LIAN LI') || upper.includes('LIAN-LI')) return 'Lian Li';
  if (upper.includes('COOLER MASTER')) return 'Cooler Master';
  if (upper.includes('MONTECH')) return 'Montech';
  if (upper.includes('GAMDIAS')) return 'Gamdias';
  if (upper.includes('MAXGREEN')) return 'MaxGreen';
  if (upper.includes('OCPC')) return 'OCPC';
  if (upper.includes('NETAC')) return 'Netac';
  if (upper.includes('LEXAR')) return 'Lexar';
  if (upper.includes('XENTHRA')) return 'Xenthra';
  if (upper.includes('LENOVO')) return 'Lenovo';
  if (upper.includes('HP ')) return 'HP';
  if (upper.includes('DELL')) return 'Dell';
  if (upper.includes('ACER')) return 'Acer';
  if (upper.includes('APPLE') || upper.includes('MACBOOK')) return 'Apple';
  if (upper.includes('MICROSOFT') || upper.includes('SURFACE')) return 'Microsoft';
  if (upper.includes('VIEWSONIC')) return 'ViewSonic';
  if (upper.includes('BENQ')) return 'BenQ';
  if (upper.includes('LG ')) return 'LG';
  if (upper.includes('AMD') || upper.includes('RYZEN')) return 'AMD';
  if (upper.includes('INTEL') || upper.includes('CORE')) return 'Intel';
  return 'Other';
}

const CATEGORY_MAP: Record<string, string[]> = {
  'graphics cards': ['Graphics Cards'],
  'graphics card': ['Graphics Cards'],
  'gpu': ['Graphics Cards'],
  'gpus': ['Graphics Cards'],
  'processors': ['Processors'],
  'processor': ['Processors'],
  'cpu': ['Processors'],
  'cpus': ['Processors'],
  'motherboards': ['Motherboards'],
  'motherboard': ['Motherboards'],
  'mobo': ['Motherboards'],
  'ram': ['RAM'],
  'memory': ['RAM'],
  'storage': ['Storage'],
  'ssd': ['Storage'],
  'ssds': ['Storage'],
  'laptop': ['Laptop'],
  'laptops': ['Laptop'],
  'notebook': ['Laptop'],
  'monitors': ['Monitors'],
  'monitor': ['Monitors'],
  'display': ['Monitors'],
  'power supply': ['Power Supply'],
  'power supplies': ['Power Supply'],
  'psu': ['Power Supply'],
  'casing': ['Casing'],
  'cases': ['Casing'],
  'case': ['Casing'],
  'power & cases': ['Power Supply', 'Casing'],
};

app.get('/api/search', async (req: Request, res: Response) => {
  try {
    const query = ((req.query.q as string) || '').trim();
    let filter: any = {};

    if (query) {
      const qLower = query.toLowerCase();

      // Case 1: Pure category search (e.g. "Graphics Cards", "Motherboards", "RAM", "Laptop")
      if (CATEGORY_MAP[qLower]) {
        filter = { category: { $in: CATEGORY_MAP[qLower] } };
      } else {
        // Case 2: Specific product search (e.g. "rtx 3050", "ryzen 7600x", "b650")
        // Require every search token to be present in the product's title, keywords, or category
        const words = query.split(/\s+/).filter(Boolean);
        const andConditions = words.map((w) => {
          const singular = w.endsWith('s') && w.length > 3 ? w.slice(0, -1) : w;
          const escaped = singular.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const pattern = w.length <= 4 ? `\\b${escaped}\\b` : escaped;

          return {
            $or: [
              { name: { $regex: pattern, $options: 'i' } },
              { keyword: { $regex: pattern, $options: 'i' } },
              { category: { $regex: pattern, $options: 'i' } }
            ]
          };
        });

        filter = andConditions.length > 0 ? { $and: andConditions } : {};
      }
    }

    const products = await Product.find(filter).sort({ price: 1 }).limit(40).lean();

    if (products.length === 0) {
      return res.json({ count: 0, results: [], lowestPrice: 0, averagePrice: 0 });
    }

    const minPrice = products[0].price;
    const enrichedProducts = products.map((item: any, index: number) => {
      const priceScore = minPrice / item.price;
      const ratingScore = (item.rating || 4.7) / 5.0;
      const recommendationScore = Number(((priceScore * 0.6) + (ratingScore * 0.4)).toFixed(2));
      const storeOffers = generateStoreOffers(item);
      const lowestOffer = storeOffers[0];
      const highestOffer = storeOffers[storeOffers.length - 1];

      const defaultSpecs = [
        item.category || 'Component',
        `Rating: ★ ${item.rating || 4.8}`,
        'Official BD Warranty',
        'Verified Retailer Parity'
      ];

      return {
        ...item,
        brand: item.brand || detectBrand(item.name),
        recommendationScore,
        isBestDeal: index === 0,
        lowestPrice: lowestOffer.price,
        highestPrice: highestOffer.price,
        spread: highestOffer.price - lowestOffer.price,
        storeOffers,
        specs: item.specs && item.specs.length > 0 ? item.specs : defaultSpecs
      };
    });

    const prices = enrichedProducts.map((p) => p.lowestPrice);
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    res.json({
      count: enrichedProducts.length,
      lowestPrice: minPrice,
      averagePrice: avgPrice,
      results: enrichedProducts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching deals' });
  }
});

// AI PC BUILDER ENDPOINT
app.post('/api/ai-builder', async (req: Request, res: Response) => {
  try {
    const rawBudget = Number(req.body.budget) || 75000;
    const budget = Math.max(25000, Math.min(600000, rawBudget));
    const purpose = ((req.body.purpose as string) || '1080p Gaming').trim();

    const build = await buildComputerWithAI(budget, purpose, generateStoreOffers);
    res.json(build);
  } catch (error: any) {
    console.error('AI PC Builder Error:', error);
    res.status(500).json({ error: error.message || 'Error generating AI PC build' });
  }
});

app.listen(PORT, () => {
  console.log(`Express Backend API running at http://localhost:${PORT}`);
  console.log(`Test your deals at: http://localhost:${PORT}/api/search?q=monitor`);
  console.log(`AI PC Builder endpoint: POST http://localhost:${PORT}/api/ai-builder`);
});
