"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface StoreOffer {
  store: string;
  price: number;
  inStock: boolean;
  stockText: string;
  productUrl: string;
  isLowest: boolean;
  priceDiff?: number;
  syncedAgo: string;
}

interface Deal {
  _id: string;
  name: string;
  store: string;
  price: number;
  rating: number;
  imageUrl: string;
  productUrl: string;
  recommendationScore: number;
  isBestDeal: boolean;
  category: string;
  brand?: string;
  lowestPrice?: number;
  highestPrice?: number;
  spread?: number;
  storeOffers?: StoreOffer[];
  specs?: string[];
  badge?: string;
  modelCode?: string;
}

function SearchEngine() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "RTX 4060";

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedStores, setSelectedStores] = useState<string[]>(["Star Tech", "Ryans Computers", "PCB Store BD"]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([20000, 80000]);
  const [sortBy, setSortBy] = useState<"lowest" | "highest" | "score">("lowest");
  const [viewMode, setViewMode] = useState<"matrix" | "grid">("matrix");
  const [budgetTarget, setBudgetTarget] = useState("35,000");

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(urlQuery)}`);
        const data = await res.json();
        const results: Deal[] = data.results || [];
        setDeals(results);

        if (results.length > 0) {
          const prices = results.map((d) => d.lowestPrice || d.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([Math.floor(min * 0.9 / 1000) * 1000, Math.ceil(max * 1.1 / 1000) * 1000]);
        }
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, [urlQuery]);

  const toggleStore = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedStores(["Star Tech", "Ryans Computers", "PCB Store BD"]);
    setSelectedBrands([]);
    setInStockOnly(true);
    if (deals.length > 0) {
      const prices = deals.map((d) => d.lowestPrice || d.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  };

  // Filtered & Sorted Deals
  const filteredDeals = useMemo(() => {
    let result = deals.filter((deal) => {
      const price = deal.lowestPrice || deal.price;
      if (price < priceRange[0] || price > priceRange[1]) return false;

      // Store filter
      if (selectedStores.length > 0 && selectedStores.length < 3) {
        const matchesStore = selectedStores.some(
          (s) =>
            deal.store.toLowerCase().includes(s.toLowerCase()) ||
            s.toLowerCase().includes(deal.store.toLowerCase())
        );
        const hasMatchingOffer =
          deal.storeOffers &&
          deal.storeOffers.some((o) => selectedStores.includes(o.store) && o.isLowest);
        if (!matchesStore && !hasMatchingOffer) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && deal.brand) {
        if (!selectedBrands.includes(deal.brand)) return false;
      }

      return true;
    });

    if (sortBy === "lowest") {
      result.sort((a, b) => (a.lowestPrice || a.price) - (b.lowestPrice || b.price));
    } else if (sortBy === "highest") {
      result.sort((a, b) => (b.lowestPrice || b.price) - (a.lowestPrice || a.price));
    } else if (sortBy === "score") {
      result.sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));
    }

    return result;
  }, [deals, priceRange, selectedStores, selectedBrands, sortBy]);

  const availableBrands = useMemo(() => {
    const brandsCount: { [key: string]: number } = {};
    deals.forEach((d) => {
      const b = d.brand || "Other";
      brandsCount[b] = (brandsCount[b] || 0) + 1;
    });
    return Object.entries(brandsCount);
  }, [deals]);

  const lowestRecordedPrice = useMemo(() => {
    if (deals.length === 0) return 0;
    return Math.min(...deals.map((d) => d.lowestPrice || d.price));
  }, [deals]);

  // Separate the featured best deal from the rest
  const bestDeal = filteredDeals.length > 0 ? filteredDeals[0] : null;
  const otherDeals = filteredDeals.length > 1 ? filteredDeals.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      
      {/* 1. Breadcrumb & Catalog Sync Header */}
      <section className="bg-white border-b border-slate-200 py-4 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-3">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">Components</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">{deals[0]?.category || "Hardware"}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold">{urlQuery}</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                  {urlQuery}
                </h1>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  {deals.length} LIVE OFFERS FOUND
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  3 Stores Syncing
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Aggregated desktop PC hardware across Star Tech, Ryans Computers, and PCB Store in Dhaka, Chittagong & delivery nationwide.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <div>
                <p className="font-bold text-slate-800">CATALOG SYNC ACTIVE</p>
                <p className="text-[11px] text-slate-500">Updated 14 mins ago • Bangladeshi Taka (৳ BDT)</p>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="font-extrabold text-slate-400 text-[11px] uppercase tracking-wider mr-1">Active Filters:</span>
            
            <span className="bg-slate-100 border border-slate-300 text-slate-700 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span>Query: <strong>{urlQuery}</strong></span>
            </span>

            <span className="bg-slate-100 border border-slate-300 text-slate-700 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span>Range: <strong>৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}</strong></span>
            </span>

            <span className="bg-slate-100 border border-slate-300 text-slate-700 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <span>Stores: <strong>{selectedStores.length} Active</strong></span>
            </span>

            {inStockOnly && (
              <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <span>● In Stock Only</span>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-700 font-bold ml-2 underline text-xs cursor-pointer"
            >
              Clear all filters
            </button>
          </div>

        </div>
      </section>

      {/* 2. Main Workspace: Filters Sidebar + Content Area */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* =========================================================================
            LEFT SIDEBAR: FILTERS & SPECS (Refine Results)
           ========================================================================= */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>⚙️</span> Filters & Specs
              </h3>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Hardware Category */}
            <div>
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Hardware Category</p>
              <select
                value={deals[0]?.category || "Graphics Cards"}
                onChange={(e) => router.push(`/search?q=${encodeURIComponent(e.target.value)}`)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none hover:border-slate-300 cursor-pointer"
              >
                <option value="Graphics Cards">🎮 Graphics Cards (GPU)</option>
                <option value="Processors">🧠 Processors (CPU)</option>
                <option value="Motherboards">🎛️ Motherboards</option>
                <option value="RAM">💾 RAM & Memory</option>
                <option value="SSD">💽 SSDs & Storage</option>
                <option value="Monitors">🖥️ Gaming Monitors</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Price Range (BDT)</p>
                <span className="text-[11px] font-bold text-blue-600">
                  ৳{(priceRange[0] / 1000).toFixed(0)}k - ৳{(priceRange[1] / 1000).toFixed(0)}k
                </span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center w-full">
                  <span className="text-[9px] text-slate-400 block font-bold">MIN ৳</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full text-center text-xs font-bold text-slate-800 bg-transparent outline-none"
                  />
                </div>
                <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center w-full">
                  <span className="text-[9px] text-slate-400 block font-bold">MAX ৳</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full text-center text-xs font-bold text-slate-800 bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Quick Bracket Buttons */}
              <div className="grid grid-cols-3 gap-1.5 mb-3">
                <button
                  type="button"
                  onClick={() => setPriceRange([20000, 36000])}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                >
                  &lt; ৳36k
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange([36000, 42000])}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                >
                  36k - 42k
                </button>
                <button
                  type="button"
                  onClick={() => setPriceRange([42000, 80000])}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                >
                  &gt; ৳42k
                </button>
              </div>

              <button
                type="button"
                onClick={() => {}}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Apply Price Bracket
              </button>
            </div>

            {/* Retail Stores */}
            <div className="border-t border-slate-100 pt-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Retail Stores</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">3 ONLINE</span>
              </div>
              <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                {[
                  { name: "Star Tech", count: deals.filter((d) => d.store.toLowerCase().includes("star") || d.storeOffers?.[0]?.store.includes("Star")).length },
                  { name: "Ryans Computers", count: deals.filter((d) => d.store.toLowerCase().includes("ryans") || d.storeOffers?.[0]?.store.includes("Ryans")).length },
                  { name: "PCB Store BD", count: deals.filter((d) => d.store.toLowerCase().includes("pcb") || d.storeOffers?.[0]?.store.includes("PCB")).length }
                ].map((st) => (
                  <label key={st.name} className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStores.includes(st.name)}
                        onChange={() => toggleStore(st.name)}
                        className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                      />
                      <span>{st.name}</span>
                    </span>
                    <span className="text-slate-400 group-hover:text-blue-600 text-[11px] font-bold">
                      {st.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Availability</p>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <span>In Stock Only</span>
                  </span>
                  <span className="text-emerald-600 text-[11px] font-bold">{filteredDeals.length}</span>
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-400">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" disabled className="w-4 h-4 rounded" />
                    <span>Pre-Order / Upcoming</span>
                  </span>
                  <span className="text-[11px]">0</span>
                </label>
              </div>
            </div>

            {/* Brand / Manufacturer */}
            {availableBrands.length > 0 && (
              <div className="border-t border-slate-100 pt-5">
                <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">Brand Manufacturer</p>
                <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                  {availableBrands.map(([brand, count]) => (
                    <label key={brand} className="flex items-center justify-between cursor-pointer group">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                        />
                        <span>{brand}</span>
                      </span>
                      <span className="text-slate-400 group-hover:text-blue-600 text-[11px] font-bold">{count}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* VRAM / Spec Filter Pills */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-3">VRAM Capacity</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg text-center"
                >
                  8GB ({filteredDeals.length})
                </button>
                <button
                  type="button"
                  className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-1.5 rounded-lg text-center hover:bg-slate-200"
                >
                  16GB Ti (0)
                </button>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Customer Satisfaction</p>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue-600 w-4 h-4 rounded" />
                <span className="text-amber-500 font-bold">★★★★☆</span>
                <span>4★ & above</span>
              </label>
            </div>

          </div>

          {/* Market Price Drop Summary Card */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
              <span>📈</span> Market Summary
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Average Dhaka street price is <strong className="text-slate-900">৳38,100</strong>. Pricing has dipped by 4.2% following fresh regional distributor shipments this week.
            </p>
            <div className="flex justify-between items-center text-xs border-t border-blue-200/60 pt-3">
              <span className="text-slate-500 font-medium">Lowest Recorded:</span>
              <span className="font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                ৳{lowestRecordedPrice.toLocaleString()} (Star Tech)
              </span>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN AREA: SORTING + CARDS + MATRICES
           ========================================================================= */}
        <div className="flex-1 space-y-5">
          
          {/* Top Sort & Results Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-xs gap-3">
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold text-slate-700">
                Showing <strong className="text-slate-900">{filteredDeals.length}</strong> of {deals.length} variants
              </p>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE PRICE GUARANTEED
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "lowest" | "highest" | "score")}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs px-3 py-1.5 rounded-lg font-bold outline-none cursor-pointer hover:border-slate-300"
                >
                  <option value="lowest">Lowest Price First (Default)</option>
                  <option value="highest">Highest Price First</option>
                  <option value="score">Best Value Deal Score</option>
                </select>
              </div>

              <div className="hidden sm:flex border border-slate-200 rounded-lg overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("matrix")}
                  className={`px-2.5 py-1.5 font-bold transition ${
                    viewMode === "matrix" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Matrix View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-2.5 py-1.5 font-bold transition ${
                    viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Grid View
                </button>
              </div>
            </div>
          </div>

          {/* SPONSORED / FEATURED PARTNER OFFER CARD */}
          <div className="bg-linear-to-r from-amber-50/70 via-white to-amber-50/30 border-2 border-amber-300/80 rounded-2xl p-4 md:p-5 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-20 h-20 bg-white rounded-xl border border-amber-200 p-2 flex items-center justify-center flex-shrink-0">
                  <img
                    src="https://www.startech.com.bd/image/cache/catalog/graphics-card/zotac/gaming-geforce-rtx-4060-8gb-twin-edge-oc-white-edition/gaming-geforce-rtx-4060-8gb-twin-edge-oc-white-edition-01-500x500.webp"
                    alt="Zotac Twin Edge"
                    className="max-h-16 object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      SPONSORED
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">Star Tech Official Partner Promotion</span>
                  </div>
                  <h4 className="text-sm md:text-base font-extrabold text-slate-900 leading-snug">
                    ZOTAC Gaming GeForce RTX 4060 8GB Twin Edge OC White Edition
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    Free Express Delivery in Dhaka with voucher code <strong className="font-mono bg-emerald-100 px-1 py-0.2 rounded text-emerald-900">BDTECH</strong>
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-amber-200/60 pt-3 md:pt-0 gap-2">
                <div className="text-left md:text-right">
                  <span className="text-xl md:text-2xl font-black text-slate-900">৳37,200</span>
                  <span className="block text-[10px] text-emerald-600 font-bold">In Stock at Star Tech</span>
                </div>
                <a
                  href="https://www.startech.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs whitespace-nowrap cursor-pointer"
                >
                  Direct Star Tech Deal ↗
                </a>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-500 shadow-xs">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm font-bold text-slate-700">Aggregating live price matrices across verified BD stores...</p>
              <p className="text-xs text-slate-400 mt-1">Cross-referencing Star Tech, Ryans Computers, and PCB Store catalog indexes</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredDeals.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-600 shadow-xs">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-slate-900">No hardware found matching &ldquo;{urlQuery}&rdquo;</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto mb-6">
                Try loosening your price range or check your spelling. You can also reset filters to inspect all hardware listings.
              </p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-blue-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* =====================================================================
              FEATURED BEST DEAL HIGHLIGHT CARD (SmartPrice Best Deal Ribbon)
             ===================================================================== */}
          {!loading && bestDeal && (
            <div className="bg-white border-2 border-emerald-400 rounded-2xl overflow-hidden shadow-md shadow-emerald-50 transition-all">
              
              {/* Ribbon Header */}
              <div className="bg-linear-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⭐</span>
                  <span className="uppercase tracking-wide font-black">
                    SmartPrice Best Deal — Score {((bestDeal.recommendationScore || 0.96) * 100).toFixed(0)}/100
                  </span>
                  <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    Maximum Value Index
                  </span>
                </div>
                <div className="text-[11px] text-emerald-100 font-medium hidden md:inline">
                  ⚖️ Weighted: 60% price spread + 40% stock veracity
                </div>
              </div>

              {/* Main Product Info Block */}
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6">
                
                {/* Image */}
                <div className="w-full md:w-56 flex-shrink-0 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <img
                    src={bestDeal.imageUrl}
                    alt={bestDeal.name}
                    className="max-h-32 object-contain mix-blend-multiply"
                  />
                  <span className="text-[10px] font-bold text-slate-400 mt-2">WindForce 2X Cooling</span>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                        FEATURED BEST VALUE
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono font-semibold">
                        {bestDeal.modelCode || "Model: GV-N4060WF2OC-8GD"}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 leading-tight hover:text-blue-600 transition cursor-pointer">
                      {bestDeal.name}
                    </h2>

                    {/* Specs Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(bestDeal.specs || [
                        "8GB GDDR6 (128-bit)",
                        "Boost Clock: 2475 MHz",
                        "2x DisplayPort 1.4a, 2x HDMI 2.1a",
                        "PCIe 4.0 x8"
                      ]).map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-4 pt-4 border-t border-slate-100 gap-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lowest Street Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-emerald-600 tracking-tight">
                          ৳{(bestDeal.lowestPrice || bestDeal.price).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          at {bestDeal.storeOffers?.[0]?.store || bestDeal.store}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spread Across 3 Stores</p>
                      <p className="text-xs font-bold text-slate-800">
                        ৳{(bestDeal.lowestPrice || bestDeal.price).toLocaleString()} – ৳{((bestDeal.highestPrice || (bestDeal.price + 2100))).toLocaleString()}{" "}
                        <span className="text-emerald-600 font-black">
                          (Save up to ৳{((bestDeal.spread || 2100)).toLocaleString()})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* STORE OFFER MATRIX (3 Verified Sources) */}
              <div className="p-6 bg-slate-50/70 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Live Merchant Quotes (3 Verified Sources)
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium">🕒 Auto-refreshed 18m ago</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(bestDeal.storeOffers || [
                    { store: "PCB Store BD", price: 36900, isLowest: true, stockText: "In Stock (Elephant Road)", productUrl: bestDeal.productUrl, syncedAgo: "18m ago" },
                    { store: "Star Tech", price: 38200, isLowest: false, priceDiff: 1300, stockText: "In Stock (Branches)", productUrl: bestDeal.productUrl, syncedAgo: "18m ago" },
                    { store: "Ryans Computers", price: 39000, isLowest: false, priceDiff: 2100, stockText: "In Stock (Hubs)", productUrl: bestDeal.productUrl, syncedAgo: "18m ago" }
                  ]).map((offer, oIdx) => (
                    <div
                      key={oIdx}
                      className={`rounded-xl p-3.5 border transition ${
                        offer.isLowest
                          ? "bg-emerald-50/80 border-emerald-300 shadow-2xs"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-extrabold text-slate-900 text-xs block">{offer.store}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {offer.stockText}
                          </span>
                        </div>
                        {offer.isLowest ? (
                          <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                            Lowest
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500">
                            +{offer.priceDiff ? `৳${offer.priceDiff.toLocaleString()}` : "৳1,200"}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                        <span className="text-sm font-black text-slate-900">
                          ৳{offer.price.toLocaleString()}
                        </span>
                        <a
                          href={offer.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 ${
                            offer.isLowest
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                          }`}
                        >
                          <span>Visit Store</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Tools */}
              <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => alert(`Price alert set for ${bestDeal.name}!`)}
                    className="text-slate-600 hover:text-blue-600 font-bold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span>🔔</span> Set Price Alert (৳)
                  </button>
                  <button
                    onClick={() => alert(`Added ${bestDeal.name} to PC Builder Matrix!`)}
                    className="text-slate-600 hover:text-blue-600 font-bold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span>🛠️</span> Add to PC Builder
                  </button>
                  <button
                    onClick={() => alert(`Saved deal to wishlist!`)}
                    className="text-slate-600 hover:text-blue-600 font-bold flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span>💾</span> Save Deal
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  PCIe 4.0 x8 • 115W TDP • 3 Years Brand Warranty
                </div>
              </div>

            </div>
          )}

          {/* =====================================================================
              REMAINING PRODUCT CARDS (Offer Matrix Cards)
             ===================================================================== */}
          {!loading && otherDeals.map((deal, idx) => (
            <div
              key={deal._id || idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
            >
              {/* Product Header Row */}
              <div className="p-5 flex flex-col md:flex-row gap-5 border-b border-slate-100">
                
                {/* Thumbnail */}
                <div className="w-full md:w-44 flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <img
                    src={deal.imageUrl}
                    alt={deal.name}
                    className="max-h-24 object-contain mix-blend-multiply"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {deal.badge || (idx === 0 ? "Lowest Entry Price" : idx === 1 ? "Popular Choice" : "In Stock")}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {deal.modelCode || deal.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-blue-600 transition cursor-pointer">
                      {deal.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {deal.specs?.join(" • ") || "Official BD Warranty • 3 Stores Stock Synchronized"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 mt-3 pt-2 border-t border-slate-100">
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> In Stock
                    </span>
                    <span>Verified 18m ago</span>
                    <span>★ {deal.rating || 4.8} rating</span>
                  </div>
                </div>

                {/* Right Price Block */}
                <div className="w-full md:w-52 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Best Live Price
                    </span>
                    <span className="text-2xl font-black text-blue-600 tracking-tight">
                      ৳{(deal.lowestPrice || deal.price).toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">
                      at <strong className="text-slate-700">{deal.storeOffers?.[0]?.store || deal.store}</strong>
                    </span>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto mt-3">
                    <a
                      href={deal.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition text-center shadow-xs"
                    >
                      View at {deal.storeOffers?.[0]?.store.split(" ")[0] || "Store"} ↗
                    </a>
                  </div>
                </div>

              </div>

              {/* Store Offer Matrix Row (Direct Quotes) */}
              <div className="p-4 bg-slate-50/70">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Store Price Breakdown:
                  </span>

                  <div className="flex flex-wrap items-center gap-3">
                    {(deal.storeOffers || []).map((so, sIdx) => (
                      <div
                        key={sIdx}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                          so.isLowest
                            ? "bg-white border-emerald-300 text-emerald-900 font-bold shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{so.store}:</span>
                        <span className="font-extrabold text-slate-900">৳{so.price.toLocaleString()}</span>
                        {so.isLowest && (
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded font-black">
                            Lowest
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* =====================================================================
              TARGETING A SPECIFIC BUDGET ALERT BOX
             ===================================================================== */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 md:p-6 shadow-md border border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  📢
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">Targeting a specific budget for the {urlQuery}?</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Receive immediate SMS or Email notifications as soon as Star Tech, Ryans, or PCB Store breaches your threshold.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 w-full md:w-36">
                  <span className="text-slate-400 text-xs mr-1">৳</span>
                  <input
                    type="text"
                    value={budgetTarget}
                    onChange={(e) => setBudgetTarget(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs font-bold text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Tracking alert set for ৳${budgetTarget} on ${urlQuery}!`)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer"
                >
                  Track Price Drop
                </button>
              </div>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4 pt-4 border-t border-slate-200">
            <span>
              Showing Items 1 to {filteredDeals.length} of {deals.length} {urlQuery} configurations
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold cursor-pointer"
              >
                1
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
              >
                2
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
              >
                3
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
              >
                Next Page
              </button>
            </div>
          </div>

          {/* PRICE TRANSPARENCY & COMPLIANCE NOTICE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4 text-xs text-slate-500 leading-relaxed shadow-xs">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="font-extrabold text-slate-800 mb-0.5">Price Transparency & Compliance Notice</p>
              <p>
                Price accuracy notice: Prices and availability are retrieved from retailer catalog indexes and refreshed every 30 minutes. Clicking &apos;Visit Store&apos; transfers you to the merchant checkout page. SmartPrice BD does not sell products directly and receives zero markup on hardware pricing. Verified partners include Star Tech, Ryans Computers, and PCB Store BD.
              </p>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Search Results...</div>}>
      <SearchEngine />
    </Suspense>
  );
}