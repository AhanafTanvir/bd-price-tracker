# BD Price Tracker & AI PC Builder (SmartPriceBD) 🇧🇩💻

A comprehensive tech price aggregator and intelligent AI-powered PC builder designed specifically for the Bangladeshi market. Compare real-time prices across major retailers like Star Tech, Ryans, and PCB Store, and generate optimized PC builds tailored to your exact budget and use-case using Google Gemini AI.

---

## 🚀 Key Features

- **Multi-Store Price Comparison**: Aggregate and compare live component prices across leading retailers in Bangladesh (Star Tech, Ryans, PCB Store).
- **🤖 AI PC Builder**: Built with Google Gemini API to generate balanced, compatible PC part lists based on user budget, target resolution, and workload (Gaming, Content Creation, Office, etc.).
- **Category Filtering & Search**: Easily browse Graphics Cards, Processors, Motherboards, RAM, Storage, Power Supplies, and more.
- **Deals & Best Price Badging**: Spot the lowest available prices, discounts, and value recommendations at a glance.
- **Automated Web Scraping**: Robust Python web scrapers and MongoDB seeders with automated price parsing and store attribution.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: Lucide React

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database ORM**: [Mongoose](https://mongoosejs.com/) (MongoDB)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Google Gemini Flash Models)

### Scraper & Data Pipeline
- **Language**: Python 3
- **Libraries**: `requests`, `beautifulsoup4`, `pymongo`

---

## 📂 Project Structure

```plaintext
bd-price-tracker/
├── frontend/                # Next.js frontend application
│   ├── app/                 # App Router pages (Home, PC Builder, Search)
│   ├── public/              # Static assets & banners
│   ├── package.json
│   └── tsconfig.json
├── backend/                 # Express & TypeScript REST API
│   ├── src/
│   │   ├── models/          # Mongoose data schemas (Product.ts)
│   │   ├── aiBuilder.ts     # Google Gemini AI PC Builder service
│   │   └── server.ts        # Express API endpoints
│   ├── .env.example         # Template for environment variables
│   ├── package.json
│   └── tsconfig.json
├── scraper/                 # Web scrapers & database seeders
│   ├── scraper.py           # Multi-store crawler
│   ├── seed_all_stores.py   # Seeder script for store inventories
│   └── seed_all_categories.py
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/AhanafTanvir/bd-price-tracker.git
cd bd-price-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/bd-price-tracker
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running the Scraper (Optional)
```bash
cd ../scraper
pip install requests beautifulsoup4 pymongo
python seed_all_stores.py
```

---

## 🛡️ License

This project is licensed under the MIT License - feel free to use and contribute!

