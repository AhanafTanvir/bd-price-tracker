"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Hardware");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else if (selectedCategory !== "All Hardware") {
      router.push(`/search?q=${encodeURIComponent(selectedCategory)}`);
    } else {
      router.push("/search?q=RTX%204060");
    }
  };

  const navCategories = [
    { name: "Graphics Cards", q: "Graphics Cards", dot: "bg-[#2d4cc8]" },
    { name: "Processors", q: "Processors", dot: "bg-[#6d28d9]" },
    { name: "Motherboards", q: "Motherboards", dot: "bg-[#059669]" },
    { name: "RAM", q: "RAM", dot: "bg-[#0891b2]" },
    { name: "Storage", q: "Storage", dot: "bg-[#d97706]" },
    { name: "Laptops", q: "Laptop", dot: "bg-[#e11d48]" },
    { name: "Monitors", q: "Monitors", dot: "bg-[#4f46e5]" },
    { name: "Power & Cases", q: "Power & Cases", dot: "bg-[#0d9488]" },
  ];

  return (
    <>
      {/* 1. Top Utility Micro-Bar (Obsidian Black) */}
      <div className="bg-[#090d16] border-b border-slate-800 text-[10px] sm:text-[11px] text-slate-300 py-1.5 sm:py-2 px-3 sm:px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="bg-[#131a29] border border-slate-700/80 shadow-[inset_1px_1px_3px_#04060a,inset_-1px_-1px_2px_#1e293b] flex items-center gap-1.5 font-extrabold text-[#34d399] px-2 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span className="sm:hidden">LIVE STORES:</span>
              <span className="hidden sm:inline">VERIFIED LIVE STORES:</span>
            </span>
            <span className="font-semibold hidden sm:inline-flex items-center gap-2 truncate">
              <span className="text-[#fb7185] font-bold">Star Tech</span>
              <span className="text-slate-600">•</span>
              <span className="text-[#fbbf24] font-bold">Ryans</span>
              <span className="text-slate-600">•</span>
              <span className="text-[#38bdf8] font-bold">PCB Store</span>
            </span>
            <span className="font-semibold sm:hidden flex items-center gap-1.5 text-[10px] truncate">
              <span className="text-[#fb7185] font-bold">StarTech</span>
              <span className="text-slate-600">•</span>
              <span className="text-[#fbbf24] font-bold">Ryans</span>
              <span className="text-slate-600">•</span>
              <span className="text-[#38bdf8] font-bold">PCB</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 font-semibold text-slate-300 shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-[#34d399]">
              <span>🕒</span> Updated 18 mins ago
            </span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="bg-[#131a29] border border-slate-700/80 shadow-[inset_1px_1px_3px_#04060a,inset_-1px_-1px_2px_#1e293b] px-2 sm:px-2.5 py-0.5 rounded-full text-white font-bold flex items-center gap-1 whitespace-nowrap">
              <span className="text-[#38bdf8] font-black">৳</span> BDT
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="bg-[#e6e7ee]/95 backdrop-blur-md border-b border-[#d1d9e6] sticky top-0 z-50 shadow-[0_6px_16px_rgba(184,185,190,0.45)]">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-8 h-14 sm:h-16 md:h-18 flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#2d4cc8] via-[#4f46e5] to-[#6d28d9] flex items-center justify-center text-white font-black text-base sm:text-xl shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] group-hover:scale-105 transition">
              S
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-base sm:text-xl font-black tracking-tight text-[#31344b] leading-none">SmartPrice</span>
                <span className="text-base sm:text-xl font-black tracking-tight text-[#2d4cc8] leading-none">BD</span>
              </div>
              <p className="text-[8px] sm:text-[9px] font-extrabold text-[#6d28d9] tracking-widest uppercase mt-0.5">Tech Aggregator</p>
            </div>
          </Link>

          {/* Center Global Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center">
            <div className="neu-inset flex w-full rounded-2xl overflow-hidden p-1 focus-within:border-[#2d4cc8]/50 transition">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value !== "All Hardware") {
                    router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
                  }
                }}
                className="bg-transparent border-r border-[#d1d9e6] px-3.5 text-xs font-bold text-[#2d4cc8] outline-none cursor-pointer"
              >
                <option value="All Hardware">All Hardware</option>
                <option value="Graphics Cards">Graphics Cards</option>
                <option value="Processors">Processors</option>
                <option value="Motherboards">Motherboards</option>
                <option value="RAM">RAM & Memory</option>
                <option value="Storage">Storage & SSDs</option>
                <option value="Laptop">Laptops</option>
                <option value="Monitors">Monitors</option>
                <option value="Power & Cases">Power & Cases</option>
              </select>
              
              <div className="flex-1 flex items-center px-3.5">
                <svg className="w-4 h-4 text-[#2d4cc8] mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search GPUs, CPUs, Motherboards, Monitors..."
                  className="w-full py-2 bg-transparent outline-none text-xs md:text-sm font-semibold text-[#31344b] placeholder-[#66799e]"
                />
                <kbd className="neu-pill hidden lg:inline-block px-2 py-0.5 text-[10px] font-bold text-[#44476a] rounded-md">
                  ⌘K
                </kbd>
              </div>

              <button
                type="submit"
                className="neu-btn-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Menu (Clean Mobile Fit) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-3 text-xs font-bold text-[#31344b] shrink-0">
            <button
              onClick={() => router.push("/search?q=RTX%204060")}
              className="neu-btn hidden sm:flex text-[#2d4cc8] px-3.5 py-2 rounded-xl items-center gap-1.5 cursor-pointer"
            >
              <span>📊</span>
              <span>Compare</span>
            </button>

            <button
              onClick={() => router.push("/pc-builder")}
              className="neu-btn-purple px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-extrabold flex items-center gap-1 sm:gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span className="animate-pulse">✨</span>
              <span className="sm:hidden">AI Builder</span>
              <span className="hidden sm:inline">AI PC Builder</span>
              <span className="hidden sm:inline bg-white/25 text-[9px] uppercase px-1.5 py-0.5 rounded-full font-black tracking-wider">NEW</span>
            </button>

            <button
              onClick={() => router.push("/#alerts")}
              className="neu-btn hidden lg:flex items-center gap-1.5 py-2 px-3 rounded-xl text-[#44476a] hover:text-[#2d4cc8] cursor-pointer"
            >
              Price Alerts
            </button>

            <button
              onClick={() => router.push("/search?q=RTX%204060")}
              className="neu-btn hidden sm:flex items-center gap-1.5 py-2 px-3 rounded-xl text-[#44476a] hover:text-[#a91e2c] cursor-pointer"
            >
              <span>Saved</span>
              <span className="neu-pill-inset text-[#a91e2c] text-[10px] font-black px-2 py-0.5 rounded-full">
                3
              </span>
            </button>

            <button
              onClick={() => router.push("/#alerts")}
              aria-label="Get Price Alerts"
              className="neu-btn-emerald px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔔</span>
              <span className="hidden xl:inline">Get Price Alerts</span>
            </button>

            <div className="neu-btn hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-[#2d4cc8] text-sm font-bold cursor-pointer">
              👤
            </div>
          </div>
        </div>

        {/* Mobile Quick Search Row (< md) */}
        <div className="md:hidden px-3 pb-2.5">
          <form onSubmit={handleSearch} className="neu-inset flex w-full rounded-xl overflow-hidden p-1">
            <div className="flex-1 flex items-center px-2.5 min-w-0">
              <svg className="w-3.5 h-3.5 text-[#2d4cc8] mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search GPUs, CPUs, RAM, Monitors..."
                className="w-full py-1.5 bg-transparent outline-none text-xs font-semibold text-[#31344b] placeholder-[#66799e] min-w-0"
              />
            </div>
            <button
              type="submit"
              className="neu-btn-primary px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* 3. Horizontal Sub-Navigation Categories Bar */}
        <div className="border-t border-[#d1d9e6] bg-[#e6e7ee]/85 backdrop-blur-sm">
          <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-8 h-11 sm:h-12 flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#44476a] overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="font-black text-[#66799e] tracking-wider uppercase text-[9px] sm:text-[10px] mr-0.5 shrink-0">HARDWARE:</span>
            <button
              onClick={() => router.push("/pc-builder")}
              className="neu-btn text-[#6d28d9] font-extrabold flex items-center gap-1 py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-xl shrink-0 cursor-pointer"
            >
              <span>✨</span>
              <span>AI PC Builder</span>
            </button>
            {navCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => router.push(`/search?q=${encodeURIComponent(cat.q)}`)}
                className="neu-pill hover:text-[#2d4cc8] text-[#31344b] font-bold transition cursor-pointer flex items-center gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-xl hover:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] shrink-0"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`}></span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
