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
    { name: "Graphics Cards", q: "Graphics Cards" },
    { name: "Processors", q: "Processors" },
    { name: "Motherboards", q: "Motherboards" },
    { name: "RAM", q: "RAM" },
    { name: "Storage", q: "Storage" },
    { name: "Laptops", q: "Laptop" },
    { name: "Monitors", q: "Monitors" },
    { name: "Power & Cases", q: "Power & Cases" },
  ];

  return (
    <>
      {/* 1. Top Utility Micro-Bar */}
      <div className="bg-white border-b border-slate-200 text-[11px] text-slate-500 py-1.5 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              VERIFIED LIVE STORES:
            </span>
            <span className="text-slate-600 font-medium hidden sm:inline">
              Star Tech <span className="text-slate-300">•</span> Ryans <span className="text-slate-300">•</span> PCB Store
            </span>
          </div>
          <div className="flex items-center gap-4 font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <span>🕒</span> Updated 18 mins ago
            </span>
            <span className="text-slate-300">|</span>
            <span className="hover:text-blue-600 cursor-pointer">EN</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-bold flex items-center gap-1">
              <span className="text-blue-600">৳</span> BDT
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 md:gap-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-600/20 group-hover:bg-blue-700 transition">
              S
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">SmartPrice</span>
                <span className="text-xl font-black tracking-tight text-blue-600 leading-none">BD</span>
              </div>
              <p className="text-[9px] font-extrabold text-slate-400 tracking-widest uppercase mt-0.5">Tech Aggregator</p>
            </div>
          </Link>

          {/* Center Global Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center">
            <div className="flex w-full border border-slate-300 rounded-xl overflow-hidden bg-slate-50/80 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-3 ring-blue-100 transition shadow-xs">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (e.target.value !== "All Hardware") {
                    router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
                  }
                }}
                className="bg-slate-100/80 border-r border-slate-200 px-3.5 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-200/60 cursor-pointer"
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
                <span className="text-slate-400 text-sm mr-2">🔍</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search GPUs, CPUs, Motherboards, Monitors..."
                  className="w-full py-2.5 bg-transparent outline-none text-xs md:text-sm font-medium text-slate-800 placeholder-slate-400"
                />
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/70 border border-slate-300 rounded">
                  ⌘K
                </kbd>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-5 text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Menu */}
          <div className="flex items-center gap-2 lg:gap-4 text-xs font-semibold text-slate-700">
            <button
              onClick={() => router.push("/search?q=RTX%204060")}
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg flex items-center gap-1.5 border border-blue-200/80 transition cursor-pointer"
            >
              <span>📊</span>
              <span className="hidden sm:inline">Compare</span>
            </button>

            <button
              onClick={() => router.push("/pc-builder")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:from-blue-700 hover:to-indigo-700 transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <span className="animate-pulse">✨</span>
              <span>AI PC Builder</span>
              <span className="bg-white/20 text-[9px] uppercase px-1 rounded font-black tracking-wider">NEW</span>
            </button>

            <button
              onClick={() => router.push("/#alerts")}
              className="hover:text-blue-600 hidden lg:flex items-center gap-1 py-1.5 px-2 transition cursor-pointer"
            >
              Price Alerts
            </button>

            <button
              onClick={() => router.push("/search?q=RTX%204060")}
              className="hover:text-blue-600 hidden sm:flex items-center gap-1.5 py-1.5 px-2 transition cursor-pointer"
            >
              <span>Saved Deals</span>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                3
              </span>
            </button>

            <button className="hover:text-blue-600 hidden sm:inline-block py-1.5 px-2 transition cursor-pointer">
              Sign In
            </button>

            <button
              onClick={() => router.push("/#alerts")}
              className="bg-blue-600 text-white px-3.5 py-2 rounded-xl hover:bg-blue-700 transition font-bold shadow-sm shadow-blue-600/20 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🔔</span>
              <span>Get Price Alerts</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold cursor-pointer hover:bg-slate-200 transition">
              👤
            </div>
          </div>
        </div>

        {/* 3. Horizontal Sub-Navigation Categories Bar */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-10 flex items-center gap-6 text-xs text-slate-600 overflow-x-auto whitespace-nowrap scrollbar-none">
            <span className="font-extrabold text-slate-400 tracking-wider uppercase text-[10px]">HARDWARE:</span>
            <button
              onClick={() => router.push("/pc-builder")}
              className="text-blue-600 font-bold flex items-center gap-1 hover:text-blue-800 transition py-1 px-2.5 rounded-md bg-blue-50 border border-blue-200/60 shrink-0"
            >
              <span>✨</span>
              <span>AI PC Builder</span>
            </button>
            {navCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => router.push(`/search?q=${encodeURIComponent(cat.q)}`)}
                className="hover:text-blue-600 font-medium transition cursor-pointer flex items-center gap-1 py-2"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
