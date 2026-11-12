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

function StarRatingInline({ rating }: { rating: number | string }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-3.5 h-3.5 text-[#f0b400] fill-current"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="neu-pill-inset text-[10px] font-black text-[#31344b] px-2 py-0.5 rounded-full ml-1.5">
        {rating}
      </span>
    </div>
  );
}

function NeuCheckbox({
  checked,
  onChange,
  accentClass = "bg-[#2d4cc8]",
  disabled = false,
}: {
  checked: boolean;
  onChange?: () => void;
  accentClass?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      aria-pressed={checked}
      className={`neu-inset w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {checked && <span className={`w-2.5 h-2.5 rounded-full ${accentClass} shadow-xs`} />}
    </button>
  );
}

function SearchEngine() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") || "RTX 4060";

  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedStores, setSelectedStores] = useState<string[]>([
    "Star Tech",
    "Ryans Computers",
    "PCB Store BD",
  ]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([20000, 80000]);
  const [maxBound, setMaxBound] = useState<number>(200000);
  const [sortBy, setSortBy] = useState<"lowest" | "highest" | "score">("lowest");
  const [viewMode, setViewMode] = useState<"matrix" | "grid">("matrix");
  const [budgetTarget, setBudgetTarget] = useState("35,000");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
          const calculatedMax = Math.ceil((max * 1.1) / 1000) * 1000;
          setMaxBound(Math.max(calculatedMax, 50000));
          setPriceRange([Math.floor((min * 0.9) / 1000) * 1000, calculatedMax]);
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

  const filteredDeals = useMemo(() => {
    const result = deals.filter((deal) => {
      const price = deal.lowestPrice || deal.price;
      if (price < priceRange[0] || price > priceRange[1]) return false;

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

  const bestDeal = filteredDeals.length > 0 ? filteredDeals[0] : null;
  const otherDeals = filteredDeals.length > 1 ? filteredDeals.slice(1) : [];

  const getStoreAccent = (storeName: string) => {
    if (storeName.toLowerCase().includes("star")) return "text-[#a91e2c]";
    if (storeName.toLowerCase().includes("ryans")) return "text-[#b45309]";
    return "text-[#2d4cc8]";
  };

  return (
    <div className="min-h-screen text-[#31344b] pb-16">
      
      {/* 1. Breadcrumb & Catalog Sync Header */}
      <section className="border-b border-[#d1d9e6]/70 py-5 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          
          <div className="flex items-center gap-2 text-xs text-[#66799e] font-bold mb-3">
            <Link href="/" className="hover:text-[#2d4cc8] transition">Home</Link>
            <span>/</span>
            <span className="hover:text-[#2d4cc8] cursor-pointer">Components</span>
            <span>/</span>
            <span className="hover:text-[#2d4cc8] cursor-pointer">{deals[0]?.category || "Hardware"}</span>
            <span>/</span>
            <span className="text-[#2d4cc8] font-black">{urlQuery}</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-[#31344b] tracking-tight uppercase">
                  {urlQuery}
                </h1>
                <span className="neu-pill text-xs font-black text-[#2d4cc8] px-3.5 py-1 rounded-full">
                  {deals.length} LIVE OFFERS
                </span>
                <span className="neu-pill text-xs font-extrabold text-[#18634b] px-3.5 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                  3 Stores Syncing
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#44476a] mt-1.5 font-medium">
                Aggregated desktop PC hardware across{" "}
                <strong className="text-[#a91e2c]">Star Tech</strong>,{" "}
                <strong className="text-[#b45309]">Ryans Computers</strong>, and{" "}
                <strong className="text-[#2d4cc8]">PCB Store</strong> in Dhaka & delivery nationwide.
              </p>
            </div>

            <div className="neu-card-sm rounded-2xl px-4 py-3 flex items-center gap-3 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
              <div>
                <p className="font-black text-[#18634b]">CATALOG SYNC ACTIVE</p>
                <p className="text-[11px] text-[#66799e] font-semibold">Updated 14 mins ago • Bangladeshi Taka (৳ BDT)</p>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-[#d1d9e6] text-xs">
            <span className="font-black text-[#66799e] text-[11px] uppercase tracking-wider mr-1">Active Filters:</span>
            
            <span className="neu-pill-inset text-[#2d4cc8] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>Query: <strong>{urlQuery}</strong></span>
            </span>

            <span className="neu-pill-inset text-[#6d28d9] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>Range: <strong>৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}</strong></span>
            </span>

            <span className="neu-pill-inset text-[#b45309] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <span>Stores: <strong>{selectedStores.length} Active</strong></span>
            </span>

            {inStockOnly && (
              <span className="neu-pill-inset text-[#18634b] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span>● In Stock Only</span>
              </span>
            )}

            <button
              onClick={resetFilters}
              className="neu-btn text-[#a91e2c] font-extrabold ml-1 px-3 py-1 rounded-full text-xs cursor-pointer"
            >
              Clear all filters
            </button>
          </div>

        </div>
      </section>

      {/* 2. Main Workspace: Neumorphic Sidebar + Content Area */}
      <main className="max-w-[1600px] mx-auto px-3.5 sm:px-4 md:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-5 lg:gap-7">
        
        {/* Mobile Filter Toggle Button (< lg) */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="neu-btn w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-xs font-black text-[#2d4cc8] cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>⚙️</span>
              <span>{showMobileFilters ? "Hide Filters & Price Range" : "Show Filters & Price Range"}</span>
            </span>
            <span className="neu-pill-inset px-2 py-0.5 rounded-full text-[10px] text-[#31344b]">
              {selectedStores.length} Stores
            </span>
          </button>
        </div>

        {/* =========================================================================
            LEFT SIDEBAR: NEUMORPHIC FILTERS (Screenshots 4, 5, 6)
           ========================================================================= */}
        <aside className={`${showMobileFilters ? "block" : "hidden"} lg:block w-full lg:w-76 flex-shrink-0 space-y-6`}>
          
          {/* Card 1: Price Range Card (EXACTLY Screenshot 4!) */}
          <div className="neu-card rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-[#31344b]">Price range</h3>
              <span className="text-xs font-extrabold text-[#2d4cc8]">
                ৳{(priceRange[0] / 1000).toFixed(0)}k - ৳{(priceRange[1] / 1000).toFixed(0)}k
              </span>
            </div>

            {/* Neumorphic Range Slider */}
            <div className="py-2">
              <input
                type="range"
                min={0}
                max={maxBound}
                step={1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Math.max(priceRange[0], Number(e.target.value))])}
                className="neu-range w-full"
              />
            </div>

            {/* Min & Max Inset Input Wells */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#44476a] block mb-1.5">Min</label>
                <div className="neu-inset rounded-xl px-3 py-2 flex items-center">
                  <span className="text-xs font-bold text-[#66799e] mr-1">৳</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full text-xs font-extrabold text-[#31344b] bg-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#44476a] block mb-1.5 text-right">Max</label>
                <div className="neu-inset rounded-xl px-3 py-2 flex items-center">
                  <span className="text-xs font-bold text-[#66799e] mr-1">৳</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full text-xs font-extrabold text-[#31344b] bg-transparent outline-none text-right"
                  />
                </div>
              </div>
            </div>

            {/* Quick Bracket Pills */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriceRange([1000, 36000])}
                className="neu-btn text-[#2d4cc8] py-1.5 rounded-xl text-[11px] font-extrabold cursor-pointer"
              >
                &lt; ৳36k
              </button>
              <button
                type="button"
                onClick={() => setPriceRange([36000, 42000])}
                className="neu-btn text-[#6d28d9] py-1.5 rounded-xl text-[11px] font-extrabold cursor-pointer"
              >
                36k - 42k
              </button>
              <button
                type="button"
                onClick={() => setPriceRange([42000, maxBound])}
                className="neu-btn text-[#18634b] py-1.5 rounded-xl text-[11px] font-extrabold cursor-pointer"
              >
                &gt; ৳42k
              </button>
            </div>

            <button
              type="button"
              onClick={() => {}}
              className="neu-btn w-full text-[#2d4cc8] py-2.5 rounded-xl text-xs font-black cursor-pointer"
            >
              Apply
            </button>
          </div>

          {/* Card 2: Product Type Double-Bevel Card (EXACTLY Screenshot 6!) */}
          <div className="neu-inset p-2 rounded-2xl">
            <div className="neu-card-sm rounded-xl p-4 space-y-3">
              <h3 className="text-base font-black text-[#31344b]">Product type</h3>
              <ul className="space-y-2.5 text-xs font-bold text-[#44476a]">
                {[
                  { label: "Graphics Cards", q: "Graphics Cards", count: 1420, color: "text-[#2d4cc8]" },
                  { label: "Processors", q: "Processors", count: 650, color: "text-[#6d28d9]" },
                  { label: "Motherboards", q: "Motherboards", count: 1350, color: "text-[#18634b]" },
                  { label: "RAM & Memory", q: "RAM", count: 980, color: "text-[#0891b2]" },
                  { label: "SSDs & Storage", q: "SSD", count: 1590, color: "text-[#b45309]" },
                  { label: "Monitors", q: "Monitors", count: 720, color: "text-[#a91e2c]" },
                ].map((item) => (
                  <li
                    key={item.q}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(item.q)}`)}
                    className="flex items-center justify-between cursor-pointer group py-0.5"
                  >
                    <span className="group-hover:text-[#2d4cc8] transition">{item.label}</span>
                    <span className={`neu-pill-inset px-2.5 py-0.5 rounded-full text-[11px] font-black ${item.color}`}>
                      {item.count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: Retail Stores & Brand Checkboxes (EXACTLY Screenshot 5!) */}
          <div className="neu-card rounded-2xl p-5 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-black text-[#31344b]">Retail Stores</h3>
                <span className="neu-pill-inset text-[10px] font-black text-[#18634b] px-2.5 py-0.5 rounded-full">
                  3 ONLINE
                </span>
              </div>

              <div className="space-y-3 text-xs font-bold text-[#31344b]">
                {[
                  {
                    name: "Star Tech",
                    accent: "bg-[#a91e2c]",
                    textColor: "text-[#a91e2c]",
                    count: deals.filter((d) => d.store.toLowerCase().includes("star") || d.storeOffers?.[0]?.store.includes("Star")).length
                  },
                  {
                    name: "Ryans Computers",
                    accent: "bg-[#d97706]",
                    textColor: "text-[#b45309]",
                    count: deals.filter((d) => d.store.toLowerCase().includes("ryans") || d.storeOffers?.[0]?.store.includes("Ryans")).length
                  },
                  {
                    name: "PCB Store BD",
                    accent: "bg-[#2d4cc8]",
                    textColor: "text-[#2d4cc8]",
                    count: deals.filter((d) => d.store.toLowerCase().includes("pcb") || d.storeOffers?.[0]?.store.includes("PCB")).length
                  }
                ].map((st) => {
                  const isChecked = selectedStores.includes(st.name);
                  return (
                    <div
                      key={st.name}
                      onClick={() => toggleStore(st.name)}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5">
                        <NeuCheckbox checked={isChecked} accentClass={st.accent} />
                        <span className={`${isChecked ? st.textColor : "text-[#44476a]"} font-extrabold`}>
                          {st.name}
                        </span>
                      </span>
                      <span className="neu-pill-inset px-2 py-0.5 rounded-full text-[11px] font-black text-[#44476a]">
                        {st.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {availableBrands.length > 0 && (
              <div className="border-t border-[#d1d9e6] pt-4">
                <h4 className="text-sm font-black text-[#31344b] mb-3">Brand Manufacturer</h4>
                <div className="grid grid-cols-2 gap-2.5 text-xs font-bold text-[#44476a]">
                  {availableBrands.map(([brand, count]) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <div
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <NeuCheckbox checked={isChecked} accentClass="bg-[#6d28d9]" />
                        <span className={`truncate ${isChecked ? "text-[#6d28d9]" : "group-hover:text-[#2d4cc8]"}`}>
                          {brand} ({count})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-[#d1d9e6] pt-4 space-y-2.5 text-xs font-bold text-[#44476a]">
              <div
                onClick={() => setInStockOnly(!inStockOnly)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <NeuCheckbox checked={inStockOnly} accentClass="bg-[#059669]" />
                  <span>In Stock Only</span>
                </span>
                <span className="text-[#18634b] font-black">{filteredDeals.length}</span>
              </div>
              <div className="flex items-center justify-between text-[#66799e]">
                <span className="flex items-center gap-2.5">
                  <NeuCheckbox checked={false} disabled />
                  <span>4★ & above</span>
                </span>
                <span className="text-[#f0b400] font-bold">★★★★☆</span>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="neu-btn text-[#a91e2c] font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Card 4: Market Summary Card */}
          <div className="neu-card rounded-2xl p-5">
            <div className="flex items-center gap-2 text-[#2d4cc8] font-black text-xs uppercase tracking-wider mb-2">
              <span>📈</span> Market Summary
            </div>
            <p className="text-xs text-[#44476a] leading-relaxed mb-3 font-medium">
              Average Dhaka street price is <strong className="text-[#31344b]">৳38,100</strong>. Pricing dipped by{" "}
              <strong className="text-[#18634b]">4.2%</strong> following fresh shipments this week.
            </p>
            <div className="flex justify-between items-center text-xs border-t border-[#d1d9e6] pt-3">
              <span className="text-[#66799e] font-bold">Lowest Recorded:</span>
              <span className="neu-pill text-xs font-black text-[#18634b] px-3 py-1 rounded-full">
                ৳{lowestRecordedPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </aside>

        {/* =========================================================================
            RIGHT MAIN AREA: SORTING + HORIZONTAL & GRID NEUMORPHIC CARDS
           ========================================================================= */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* Top Sort & View Toggle Bar */}
          <div className="neu-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <p className="text-xs font-bold text-[#44476a]">
                Showing <strong className="text-[#2d4cc8] font-black">{filteredDeals.length}</strong> of {deals.length} variants
              </p>
              <span className="text-[#b8b9be] hidden sm:inline">•</span>
              <span className="text-[11px] font-black text-[#18634b] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                LIVE PRICE GUARANTEED
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 text-xs flex-1 sm:flex-initial">
                <span className="text-[#66799e] font-bold shrink-0">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "lowest" | "highest" | "score")}
                  className="neu-inset text-[#31344b] text-xs px-3 py-2 rounded-xl font-extrabold outline-none cursor-pointer w-full sm:w-auto min-w-0"
                >
                  <option value="lowest">Lowest Price First (Default)</option>
                  <option value="highest">Highest Price First</option>
                  <option value="score">Best Value Deal Score</option>
                </select>
              </div>

              <div className="neu-inset hidden sm:flex p-1 rounded-xl text-xs gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("matrix")}
                  className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
                    viewMode === "matrix" ? "neu-btn-primary" : "text-[#44476a] hover:text-[#2d4cc8]"
                  }`}
                >
                  Matrix View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer ${
                    viewMode === "grid" ? "neu-btn-primary" : "text-[#44476a] hover:text-[#2d4cc8]"
                  }`}
                >
                  Grid View
                </button>
              </div>
            </div>
          </div>

          {/* SPONSORED PARTNER PROMOTION CARD */}
          <div className="neu-card rounded-2xl p-5 border-l-4 border-l-[#d97706]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="neu-inset w-20 h-20 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                  <img
                    src="/categories/gpu.jpg"
                    alt="Zotac Twin Edge"
                    className="max-h-16 object-contain mix-blend-multiply"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-[#f59e0b] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      SPONSORED
                    </span>
                    <span className="text-[11px] text-[#a91e2c] font-extrabold">Star Tech Official Partner Promotion</span>
                  </div>
                  <h4 className="text-sm md:text-base font-black text-[#31344b] leading-snug">
                    ZOTAC Gaming GeForce RTX 4060 8GB Twin Edge OC White Edition
                  </h4>
                  <p className="text-xs text-[#18634b] font-bold mt-1">
                    Free Express Delivery in Dhaka with voucher code{" "}
                    <strong className="neu-pill-inset font-mono px-2 py-0.5 rounded text-[#31344b]">BDTECH</strong>
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-[#d1d9e6] pt-3 md:pt-0 gap-2">
                <div className="text-left md:text-right">
                  <span className="text-2xl font-black text-[#a91e2c]">৳37,200</span>
                  <span className="block text-[10px] text-[#18634b] font-extrabold">In Stock at Star Tech</span>
                </div>
                <a
                  href="https://www.startech.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-btn-primary text-xs font-extrabold px-5 py-2.5 rounded-xl whitespace-nowrap cursor-pointer"
                >
                  Direct Star Tech Deal ↗
                </a>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="neu-card rounded-2xl p-16 text-center text-[#44476a]">
              <div className="animate-spin w-10 h-10 border-4 border-[#2d4cc8] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm font-extrabold text-[#31344b]">Aggregating live price matrices across verified BD stores...</p>
              <p className="text-xs text-[#66799e] mt-1 font-medium">Cross-referencing Star Tech, Ryans Computers, and PCB Store catalog indexes</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && filteredDeals.length === 0 && (
            <div className="neu-card rounded-2xl p-16 text-center text-[#44476a]">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-black text-[#31344b]">No hardware found matching &ldquo;{urlQuery}&rdquo;</h3>
              <p className="text-xs text-[#66799e] mt-1 max-w-md mx-auto mb-6 font-medium">
                Try loosening your price range or check your spelling. You can also reset filters to inspect all hardware listings.
              </p>
              <button
                onClick={resetFilters}
                className="neu-btn-primary font-extrabold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* =====================================================================
              FEATURED BEST DEAL HIGHLIGHT CARD (Screenshot 3 Horizontal Pattern)
             ===================================================================== */}
          {!loading && bestDeal && (
            <div className="neu-card rounded-2xl overflow-hidden">
              
              {/* Vibrant Ribbon Header */}
              <div className="bg-gradient-to-r from-[#059669] via-[#0d9488] to-[#2d4cc8] text-white px-5 py-2.5 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⭐</span>
                  <span className="uppercase tracking-wide font-black">
                    SmartPrice Best Deal — Score {((bestDeal.recommendationScore || 0.96) * 100).toFixed(0)}/100
                  </span>
                  <span className="bg-white/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    Maximum Value Index
                  </span>
                </div>
                <div className="text-[11px] text-white/90 font-semibold hidden md:inline">
                  ⚖️ Weighted: 60% price spread + 40% stock veracity
                </div>
              </div>

              {/* Screenshot 3: 3-Column Horizontal Featured Product Block */}
              <div className="p-6 border-b border-[#d1d9e6] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left Image (col-md-3) */}
                <div className="md:col-span-3 flex flex-col items-center justify-center p-3">
                  <img
                    src={bestDeal.imageUrl}
                    alt={bestDeal.name}
                    className="max-h-36 object-contain mix-blend-multiply"
                  />
                  <span className="text-[10px] font-bold text-[#66799e] mt-2">{bestDeal.brand || "Official BD Warranty"}</span>
                </div>

                {/* Center Details (col-md-6) */}
                <div className="md:col-span-6 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="neu-pill text-[10px] font-black text-[#2d4cc8] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      FEATURED BEST VALUE
                    </span>
                    <span className="text-[11px] text-[#66799e] font-mono font-bold">
                      {bestDeal.modelCode || bestDeal.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-black text-[#31344b] leading-tight hover:text-[#2d4cc8] transition cursor-pointer">
                    {bestDeal.name}
                  </h2>

                  {/* 5 Golden Stars + Score Pill + Green Orders/Stock (EXACTLY Screenshot 3!) */}
                  <div className="flex flex-wrap items-center gap-3">
                    <StarRatingInline rating={(bestDeal.rating || 4.8).toFixed(1)} />
                    <span className="text-xs font-extrabold text-[#18634b] flex items-center gap-1">
                      <span>🛒</span> 150+ tracked orders
                    </span>
                  </div>

                  {/* Specs Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(bestDeal.specs || [
                      "8GB GDDR6 (128-bit)",
                      "Boost Clock: 2475 MHz",
                      "PCIe 4.0 x8"
                    ]).map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="neu-pill-inset text-[#44476a] text-[10px] font-bold px-2.5 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Price & Stacked Neumorphic Buttons (col-md-3, Screenshot 3!) */}
                <div className="md:col-span-3 md:border-l border-[#d1d9e6] md:pl-5 space-y-3">
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm text-[#66799e] line-through font-bold">
                        ৳{((bestDeal.highestPrice || bestDeal.price + 2100)).toLocaleString()}
                      </span>
                      <span className="text-2xl font-black text-[#a91e2c]">
                        ৳{(bestDeal.lowestPrice || bestDeal.price).toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-[#18634b] flex items-center gap-1 mt-1">
                      <span>🚚</span> Free / Express shipping
                    </span>
                    <span className="text-[11px] font-bold text-[#66799e] block mt-0.5">
                      Save up to ৳{((bestDeal.spread || 2100)).toLocaleString()} across 3 stores
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <a
                      href={bestDeal.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn-primary w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                    >
                      <span>Details & Buy</span>
                      <span>↗</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => alert(`Saved ${bestDeal.name} to wishlist!`)}
                      className="neu-btn w-full py-2 px-4 rounded-xl text-xs font-extrabold text-[#a91e2c] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>♥</span>
                      <span>Wishlist</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* STORE OFFER MATRIX (3 Verified Sources) */}
              <div className="p-5 bg-[#e6e7ee] border-b border-[#d1d9e6]">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] font-black text-[#44476a] uppercase tracking-wider">
                    Live Merchant Quotes (3 Verified Sources)
                  </p>
                  <span className="text-[11px] text-[#66799e] font-bold">🕒 Auto-refreshed 18m ago</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(bestDeal.storeOffers || [
                    { store: "PCB Store BD", price: 36900, isLowest: true, stockText: "In Stock (Elephant Road)", productUrl: bestDeal.productUrl, syncedAgo: "18m ago" },
                    { store: "Star Tech", price: 38200, isLowest: false, priceDiff: 1300, stockText: "In Stock (Branches)", productUrl: bestDeal.productUrl, syncedAgo: "18m ago" },
                    { store: "Ryans Computers", price: 39000, isLowest: false, priceDiff: 2100, stockText: "In Stock (Hubs)", productUrl: bestDeal.productUrl, syncedAgo: "18m ago" }
                  ]).map((offer, oIdx) => (
                    <div
                      key={oIdx}
                      className={`rounded-2xl p-4 transition ${
                        offer.isLowest ? "neu-card border-l-4 border-l-[#10b981]" : "neu-card-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className={`font-black text-xs block ${getStoreAccent(offer.store)}`}>
                            {offer.store}
                          </span>
                          <span className="text-[10px] text-[#18634b] font-bold flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                            {offer.stockText}
                          </span>
                        </div>
                        {offer.isLowest ? (
                          <span className="bg-[#059669] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            Lowest
                          </span>
                        ) : (
                          <span className="neu-pill-inset text-[10px] font-extrabold text-[#a91e2c] px-2 py-0.5 rounded-full">
                            +{offer.priceDiff ? `৳${offer.priceDiff.toLocaleString()}` : "৳1,200"}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-[#d1d9e6]">
                        <span className={`text-base font-black ${offer.isLowest ? "text-[#18634b]" : "text-[#31344b]"}`}>
                          ৳{offer.price.toLocaleString()}
                        </span>
                        <a
                          href={offer.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition inline-flex items-center gap-1 ${
                            offer.isLowest ? "neu-btn-emerald" : "neu-btn text-[#2d4cc8]"
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
              <div className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => alert(`Price alert set for ${bestDeal.name}!`)}
                    className="neu-btn text-[#2d4cc8] font-extrabold flex items-center gap-1.5 py-1.5 px-3 rounded-xl cursor-pointer"
                  >
                    <span>🔔</span> Set Price Alert
                  </button>
                  <button
                    onClick={() => router.push("/pc-builder")}
                    className="neu-btn text-[#6d28d9] font-extrabold flex items-center gap-1.5 py-1.5 px-3 rounded-xl cursor-pointer"
                  >
                    <span>🛠️</span> Add to AI PC Builder
                  </button>
                </div>

                <div className="text-[11px] text-[#66799e] font-bold">
                  Official BD Distributor Warranty • Verified Stock
                </div>
              </div>

            </div>
          )}

          {/* =====================================================================
              REMAINING PRODUCT CARDS (Supports BOTH Matrix Horizontal & Grid View!)
             ===================================================================== */}
          {!loading && viewMode === "grid" ? (
            /* GRID VIEW (Screenshot 2 vertical card design!) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {otherDeals.map((deal, idx) => (
                <div
                  key={deal._id || idx}
                  className="neu-card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="p-5 h-44 flex items-center justify-center bg-[#e6e7ee]">
                      <img
                        src={deal.imageUrl}
                        alt={deal.name}
                        className="max-h-36 object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="border-t border-[#d1d9e6] p-5 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="neu-pill-inset text-[10px] font-black text-[#2d4cc8] px-2.5 py-0.5 rounded-full">
                          {deal.badge || deal.category}
                        </span>
                        <span className={`text-[11px] font-extrabold ${getStoreAccent(deal.storeOffers?.[0]?.store || deal.store)}`}>
                          {deal.storeOffers?.[0]?.store || deal.store}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-[#31344b] leading-snug hover:text-[#2d4cc8] transition line-clamp-2">
                        {deal.name}
                      </h3>

                      <p className="text-[11px] text-[#44476a] font-medium line-clamp-1">
                        {deal.specs?.join(" • ") || "Official BD Warranty • 3 Stores Synced"}
                      </p>

                      <StarRatingInline rating={(deal.rating || 4.8).toFixed(1)} />
                    </div>
                  </div>

                  <div className="border-t border-[#d1d9e6] p-4 flex items-center justify-between gap-2">
                    <div>
                      {deal.highestPrice && deal.highestPrice > (deal.lowestPrice || deal.price) && (
                        <span className="text-[11px] text-[#66799e] line-through block font-bold">
                          ৳{deal.highestPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-lg font-black text-[#a91e2c]">
                        ৳{(deal.lowestPrice || deal.price).toLocaleString()}
                      </span>
                    </div>

                    <a
                      href={deal.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-btn text-[#2d4cc8] text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <span>🛒</span>
                      <span>View Deal</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* MATRIX VIEW (Screenshot 3 horizontal cards + Store Breakdown!) */
            !loading &&
            otherDeals.map((deal, idx) => (
              <div
                key={deal._id || idx}
                className="neu-card-hover rounded-2xl overflow-hidden"
              >
                <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center border-b border-[#d1d9e6]">
                  
                  {/* Left Image (col-md-3) */}
                  <div className="md:col-span-3 flex items-center justify-center p-2">
                    <img
                      src={deal.imageUrl}
                      alt={deal.name}
                      className="max-h-28 object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Center Info (col-md-6) */}
                  <div className="md:col-span-6 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="neu-pill-inset text-[10px] font-black text-[#6d28d9] px-2.5 py-0.5 rounded-full">
                        {deal.badge || (idx === 0 ? "Lowest Entry Price" : idx === 1 ? "Popular Choice" : "In Stock")}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#66799e] uppercase tracking-wider">
                        {deal.modelCode || deal.category}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#31344b] leading-snug hover:text-[#2d4cc8] transition cursor-pointer">
                      {deal.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3">
                      <StarRatingInline rating={(deal.rating || 4.8).toFixed(1)} />
                      <span className="text-[#18634b] text-xs font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> In Stock
                      </span>
                    </div>

                    <p className="text-xs text-[#44476a] font-medium line-clamp-1">
                      {deal.specs?.join(" • ") || "Official BD Warranty • 3 Stores Stock Synchronized"}
                    </p>
                  </div>

                  {/* Right Price & Action (col-md-3) */}
                  <div className="md:col-span-3 md:border-l border-[#d1d9e6] md:pl-5 flex flex-row md:flex-col justify-between items-center md:items-stretch gap-3">
                    <div>
                      <span className="text-[10px] font-extrabold text-[#66799e] uppercase tracking-wider block">
                        Best Live Price
                      </span>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {deal.highestPrice && deal.highestPrice > (deal.lowestPrice || deal.price) && (
                          <span className="text-xs text-[#66799e] line-through font-bold">
                            ৳{deal.highestPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-2xl font-black text-[#a91e2c]">
                          ৳{(deal.lowestPrice || deal.price).toLocaleString()}
                        </span>
                      </div>
                      <span className="block text-[11px] text-[#44476a] font-semibold mt-0.5">
                        at <strong className={getStoreAccent(deal.storeOffers?.[0]?.store || deal.store)}>{deal.storeOffers?.[0]?.store || deal.store}</strong>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <a
                        href={deal.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neu-btn-primary w-full text-xs font-extrabold px-4 py-2 rounded-xl text-center block"
                      >
                        Details @ {deal.storeOffers?.[0]?.store.split(" ")[0] || "Store"} ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => alert(`Added ${deal.name} to Wishlist!`)}
                        className="neu-btn w-full text-[#44476a] hover:text-[#a91e2c] text-xs font-extrabold px-4 py-1.5 rounded-xl text-center hidden md:block cursor-pointer"
                      >
                        ♥ Wishlist
                      </button>
                    </div>
                  </div>

                </div>

                {/* Store Offer Matrix Row */}
                <div className="p-4 bg-[#e6e7ee]">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                    <span className="text-[11px] font-black text-[#66799e] uppercase tracking-wider">
                      Store Breakdown:
                    </span>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {(deal.storeOffers || []).map((so, sIdx) => (
                        <a
                          key={sIdx}
                          href={so.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`neu-pill flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition hover:scale-[1.02] ${
                            so.isLowest ? "text-[#18634b]" : "text-[#44476a]"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${so.isLowest ? "bg-[#10b981]" : "bg-[#93a0b8]"}`}></span>
                          <span className={getStoreAccent(so.store)}>{so.store}:</span>
                          <span className="font-black text-[#31344b]">৳{so.price.toLocaleString()}</span>
                          {so.isLowest && (
                            <span className="bg-[#059669] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                              Lowest
                            </span>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))
          )}

          {/* =====================================================================
              TARGETING A SPECIFIC BUDGET ALERT BOX (Neumorphic)
             ===================================================================== */}
          <div className="neu-card rounded-2xl p-5 md:p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="neu-inset w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  📢
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#31344b]">
                    Targeting a specific budget for <span className="text-[#2d4cc8]">{urlQuery}</span>?
                  </h4>
                  <p className="text-xs text-[#44476a] mt-0.5 font-medium">
                    Receive immediate SMS or Email notifications as soon as Star Tech, Ryans, or PCB Store drops below your target.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <div className="neu-inset flex items-center rounded-xl px-3.5 py-2.5 w-full sm:w-36">
                  <span className="text-[#2d4cc8] font-black text-xs mr-1.5">৳</span>
                  <input
                    type="text"
                    value={budgetTarget}
                    onChange={(e) => setBudgetTarget(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs font-extrabold text-[#31344b]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Tracking alert set for ৳${budgetTarget} on ${urlQuery}!`)}
                  className="neu-btn-emerald font-black text-xs px-5 py-2.5 rounded-xl whitespace-nowrap cursor-pointer"
                >
                  Track Price Drop
                </button>
              </div>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-[#44476a] font-semibold gap-4 pt-4 border-t border-[#d1d9e6] text-center sm:text-left">
            <span>
              Showing Items 1 to {filteredDeals.length} of {deals.length} {urlQuery} configurations
            </span>

            <div className="flex flex-wrap justify-center items-center gap-2">
              <button
                type="button"
                className="neu-btn px-3.5 py-1.5 rounded-xl text-[#44476a] font-extrabold cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                className="neu-btn-active px-3.5 py-1.5 rounded-xl text-[#2d4cc8] font-black cursor-pointer"
              >
                1
              </button>
              <button
                type="button"
                className="neu-btn px-3.5 py-1.5 rounded-xl text-[#44476a] font-extrabold cursor-pointer"
              >
                2
              </button>
              <button
                type="button"
                className="neu-btn px-3.5 py-1.5 rounded-xl text-[#44476a] font-extrabold cursor-pointer"
              >
                3
              </button>
              <button
                type="button"
                className="neu-btn px-3.5 py-1.5 rounded-xl text-[#2d4cc8] font-extrabold cursor-pointer"
              >
                Next Page
              </button>
            </div>
          </div>

          {/* PRICE TRANSPARENCY & COMPLIANCE NOTICE */}
          <div className="neu-inset rounded-2xl p-5 flex items-start gap-4 text-xs text-[#44476a] leading-relaxed">
            <span className="text-xl">🛡️</span>
            <div>
              <p className="font-black text-[#31344b] mb-0.5">Price Transparency & Compliance Notice</p>
              <p className="font-medium">
                Prices and availability are retrieved from retailer catalog indexes and refreshed every 30 minutes. Clicking &apos;Details&apos; transfers you to the merchant checkout page. Verified partners include{" "}
                <span className="text-[#a91e2c] font-bold">Star Tech</span>,{" "}
                <span className="text-[#b45309] font-bold">Ryans Computers</span>, and{" "}
                <span className="text-[#2d4cc8] font-bold">PCB Store BD</span>.
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
    <Suspense fallback={<div className="min-h-screen bg-[#e6e7ee] flex items-center justify-center text-[#2d4cc8] font-black">Loading Search Results...</div>}>
      <SearchEngine />
    </Suspense>
  );
}
