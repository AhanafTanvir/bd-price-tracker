"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDealFilter, setActiveDealFilter] = useState("All Deals");
  const [emailAlert, setEmailAlert] = useState("");
  const [showInstantMatches, setShowInstantMatches] = useState(false);
  const router = useRouter();

  // Auto-Sliding Background Carousel State (5-second auto-play, pause on hover)
  const [heroSlide, setHeroSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const heroSlides = [
    {
      image: "/banners/banner1.jpg",
      title: "Clean Studio PC Setup",
      overlayGradient: "bg-slate-950/45 md:bg-linear-to-r md:from-slate-950/85 md:via-slate-950/60 md:to-slate-950/20"
    },
    {
      image: "/banners/banner2.jpg",
      title: "High-Tech RGB Workstation",
      overlayGradient: "bg-slate-950/50 md:bg-linear-to-r md:from-slate-950/85 md:via-slate-950/65 md:to-slate-950/30"
    }
  ];

  useEffect(() => {
    if (isHeroHovered) return;
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroHovered, heroSlides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search?q=RTX%204060");
    }
  };

  const handleTrendingClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Hardware categories with verified real component photographs
  const categories = [
    {
      name: "Graphics Cards",
      q: "Graphics Cards",
      desc: "NVIDIA RTX 40-Series & AMD RX 7000",
      count: "1,420+ Items",
      starting: "৳11,500",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Processors / CPUs",
      q: "Processors",
      desc: "Intel 13th/14th Gen & AMD Zen 4/5",
      count: "650+ Items",
      starting: "৳9,200",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Motherboards",
      q: "Motherboards",
      desc: "B650, Z790, B760, and AM5 Platforms",
      count: "1,350+ Items",
      starting: "৳7,800",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "RAM & Memory",
      q: "RAM",
      desc: "DDR5 6000MHz & High-speed DDR4",
      count: "980+ Items",
      starting: "৳2,400",
      image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "SSDs & Storage",
      q: "SSD",
      desc: "PCIe Gen 4 NVMe & SATA Solid State",
      count: "1,590+ Items",
      starting: "৳2,900",
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Gaming Monitors",
      q: "Monitors",
      desc: "144Hz to 240Hz, IPS & QD-OLED Panels",
      count: "720+ Items",
      starting: "৳12,500",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Laptops & Ultrabooks",
      q: "Laptop",
      desc: "MacBooks, ROG, Legion & Thin Notebooks",
      count: "1,280+ Items",
      starting: "৳42,000",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Power Supplies & Cases",
      q: "Power Supply",
      desc: "80 Plus Gold PSUs, Airflow ATX Towers",
      count: "890+ Items",
      starting: "৳3,800",
      image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80"
    }
  ];

  const featuredDeals = [
    {
      id: "rtx4060",
      category: "GPUs",
      tag: "GRAPHICS CARD • 8GB GDDR6",
      badge: "⭐ BEST DEAL (SCORE 96/100)",
      badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      name: "Gigabyte GeForce RTX 4060 WINDFORCE OC 8GB",
      specs: "Boost Clock: 2475 MHz • Dual Fan • PCIe 4.0",
      wasPrice: 41500,
      saveAmount: 4600,
      savePercent: "11%",
      lowestStore: "PCB Store BD",
      lowestPrice: 36900,
      image: "https://www.startech.com.bd/image/cache/catalog/graphics-card/gigabyte/geforce-rtx-4060-windforce-oc-8gb/geforce-rtx-4060-windforce-oc-8gb-01-500x500.webp",
      trendPoints: "5,30 25,28 45,26 65,22 85,25 105,18 125,15 145,12 165,8 185,10 205,6 225,5",
      stores: [
        { name: "PCB Store BD", price: 36900, isLowest: true, url: "/search?q=RTX%204060" },
        { name: "Star Tech", price: 38200, isLowest: false, url: "/search?q=RTX%204060" },
        { name: "Ryans Computers", price: 39000, isLowest: false, url: "/search?q=RTX%204060" }
      ]
    },
    {
      id: "ryzen7600x",
      category: "CPUs",
      tag: "PROCESSOR • 6 CORES, 12 THREADS",
      badge: "🔥 12% PRICE DROP",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      name: "AMD Ryzen 5 7600X AM5 Processor",
      specs: "4.7GHz Base, 5.3GHz Boost • 32MB Cache • 105W TDP",
      wasPrice: 26500,
      saveAmount: 3100,
      savePercent: "12%",
      lowestStore: "Star Tech",
      lowestPrice: 23400,
      image: "https://www.startech.com.bd/image/cache/catalog/processor/AMD/ryzen-5-7600x/ryzen-5-7600x-01-500x500.webp",
      trendPoints: "5,28 25,27 45,25 65,26 85,20 105,19 125,14 145,16 165,11 185,9 205,7 225,6",
      stores: [
        { name: "Star Tech", price: 23400, isLowest: true, url: "/search?q=Ryzen%205%207600X" },
        { name: "PCB Store BD", price: 24200, isLowest: false, url: "/search?q=Ryzen%205%207600X" },
        { name: "Ryans Computers", price: 24500, isLowest: false, url: "/search?q=Ryzen%205%207600X" }
      ]
    },
    {
      id: "asrock-a520m",
      category: "Motherboards",
      tag: "MOTHERBOARD • AMD AM4 MATX",
      badge: "⭐ TOP SELLING MOBO",
      badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      name: "ASRock A520M-HVS AMD AM4 Micro ATX Motherboard",
      specs: "AM4 Socket • 2x DDR4 4733+ (OC) • Ultra M.2 • Realtek Gigabit LAN",
      wasPrice: 7200,
      saveAmount: 700,
      savePercent: "10%",
      lowestStore: "Star Tech",
      lowestPrice: 6500,
      image: "https://www.startech.com.bd/image/cache/catalog/motherboard/asrock/a520m-hvs/a520m-hvs-01-228x228.webp",
      trendPoints: "5,28 25,27 45,25 65,22 85,20 105,18 125,16 145,14 165,12 185,10 205,8 225,6",
      stores: [
        { name: "Star Tech", price: 6500, isLowest: true, url: "/search?q=Motherboards" },
        { name: "PCB Store BD", price: 6900, isLowest: false, url: "/search?q=Motherboards" },
        { name: "Ryans Computers", price: 7100, isLowest: false, url: "/search?q=Motherboards" }
      ]
    },
    {
      id: "netac-ddr4",
      category: "RAM",
      tag: "DESKTOP RAM • DDR4 HIGH SPEED",
      badge: "🔥 VALUE RAM DEAL",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      name: "Netac Basic 8GB DDR4 2666MHz Desktop RAM",
      specs: "8GB Capacity • DDR4 2666MHz • 1.2V Low Voltage • Unbuffered DIMM",
      wasPrice: 4500,
      saveAmount: 600,
      savePercent: "13%",
      lowestStore: "PCB Store BD",
      lowestPrice: 3900,
      image: "https://www.startech.com.bd/image/cache/catalog/ram/netac/basic-4gb-ddr4-2666mhz/basic-4gb-ddr4-2666mhz-01-228x228.webp",
      trendPoints: "5,30 25,28 45,26 65,24 85,22 105,19 125,17 145,15 165,13 185,10 205,8 225,7",
      stores: [
        { name: "PCB Store BD", price: 3900, isLowest: true, url: "/search?q=RAM" },
        { name: "Star Tech", price: 4100, isLowest: false, url: "/search?q=RAM" },
        { name: "Ryans Computers", price: 4250, isLowest: false, url: "/search?q=RAM" }
      ]
    },
    {
      id: "980pro",
      category: "Storage",
      tag: "STORAGE • PCIE 4.0 NVME M.2",
      badge: "⭐ POPULAR CHOICE",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
      name: "Samsung 980 Pro 1TB NVMe SSD",
      specs: "Up to 7,000 MB/s Read • 5,000 MB/s Write • V-NAND 3-bit MLC",
      wasPrice: 12500,
      saveAmount: 1700,
      savePercent: "14%",
      lowestStore: "Ryans Computers",
      lowestPrice: 10800,
      image: "https://www.startech.com.bd/image/cache/catalog/ssd/samsung/980-pro-1tb/980-pro-1tb-01-500x500.webp",
      trendPoints: "5,25 25,26 45,22 65,21 85,23 105,18 125,16 145,15 165,12 185,10 205,8 225,6",
      stores: [
        { name: "Ryans Computers", price: 10800, isLowest: true, url: "/search?q=Samsung%20980%20Pro" },
        { name: "PCB Store BD", price: 11500, isLowest: false, url: "/search?q=Samsung%20980%20Pro" },
        { name: "Star Tech", price: 11900, isLowest: false, url: "/search?q=Samsung%20980%20Pro" }
      ]
    },
    {
      id: "macbook-air-m3",
      category: "Laptops",
      tag: "LAPTOP • APPLE SILICON 13-INCH",
      badge: "⭐ PREMIUM ULTRABOOK",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
      name: "Apple MacBook Air 13-inch Liquid Retina Display",
      specs: "Apple Silicon • 8-Core CPU • Liquid Retina Display • MagSafe 3",
      wasPrice: 175000,
      saveAmount: 13500,
      savePercent: "8%",
      lowestStore: "Star Tech",
      lowestPrice: 161500,
      image: "https://www.startech.com.bd/image/cache/catalog/laptop/apple/macbook-air-13-m4/sky-blue/macbook-air-13-m4-sky-blue-01-228x228.webp",
      trendPoints: "5,32 25,30 45,28 65,25 85,22 105,20 125,17 145,15 165,13 185,11 205,9 225,8",
      stores: [
        { name: "Star Tech", price: 161500, isLowest: true, url: "/search?q=Laptop" },
        { name: "Ryans Computers", price: 165000, isLowest: false, url: "/search?q=Laptop" },
        { name: "PCB Store BD", price: 168000, isLowest: false, url: "/search?q=Laptop" }
      ]
    },
    {
      id: "msi-mag274",
      category: "Monitors",
      tag: "MONITOR • 27\" 2K 180HZ RAPID IPS",
      badge: "⭐ HIGH REFRESH 180Hz",
      badgeColor: "bg-purple-100 text-purple-700 border-purple-200",
      name: "MSI MAG 274QRF QD E2 2K WQHD Gaming Monitor",
      specs: "2560 x 1440 • 0.5ms (GtG) • Quantum Dot • HDR 400",
      wasPrice: 38000,
      saveAmount: 3500,
      savePercent: "9%",
      lowestStore: "Star Tech",
      lowestPrice: 34500,
      image: "https://www.startech.com.bd/image/cache/catalog/monitor/msi/mag-274qrf-qd-e2/mag-274qrf-qd-e2-01-500x500.webp",
      trendPoints: "5,30 25,29 45,28 65,24 85,22 105,20 125,17 145,14 165,12 185,11 205,8 225,7",
      stores: [
        { name: "Star Tech", price: 34500, isLowest: true, url: "/search?q=MSI%20Monitor" },
        { name: "PCB Store BD", price: 35900, isLowest: false, url: "/search?q=MSI%20Monitor" },
        { name: "Ryans Computers", price: 38200, isLowest: false, url: "/search?q=MSI%20Monitor" }
      ]
    },
    {
      id: "twolf-spector",
      category: "Power & Cases",
      tag: "CASING • ARGB CURVED ATX",
      badge: "🔥 HOT AIRFLOW CASE",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      name: "T-Wolf Spector ARGB Curved ATX Gaming Casing with Display",
      specs: "Integrated LCD Display • Curved Tempered Glass • 4x ARGB Fans",
      wasPrice: 8500,
      saveAmount: 1300,
      savePercent: "15%",
      lowestStore: "Star Tech",
      lowestPrice: 7200,
      image: "https://www.startech.com.bd/image/cache/catalog/casing/t-wolf/spector/spector-white-01-228x228.webp",
      trendPoints: "5,29 25,27 45,25 65,23 85,21 105,18 125,16 145,14 165,12 185,10 205,8 225,7",
      stores: [
        { name: "Star Tech", price: 7200, isLowest: true, url: "/search?q=Casing" },
        { name: "PCB Store BD", price: 7600, isLowest: false, url: "/search?q=Casing" },
        { name: "Ryans Computers", price: 7900, isLowest: false, url: "/search?q=Casing" }
      ]
    }
  ];

  const filteredDeals = featuredDeals.filter(
    (d) => activeDealFilter === "All Deals" || d.category === activeDealFilter
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* =========================================================================
          HERO SECTION: AUTO-SLIDING BACKGROUND CAROUSEL WITH OVERLAY
         ========================================================================= */}
      <section
        className="relative min-h-[580px] sm:min-h-[620px] md:min-h-[680px] flex items-center justify-center px-4 md:px-8 overflow-hidden border-b border-slate-200 group"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Background Slider Images */}
        {heroSlides.map((slide, index) => {
          const isActive = index === heroSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none z-0"
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-100"
              />
              {/* Individual Slide Gradient / Frosted Glass Overlay for Superior Contrast */}
              <div className={`absolute inset-0 ${slide.overlayGradient} backdrop-blur-[1.5px]`} />
            </div>
          );
        })}

        {/* Global ambient subtle vignette overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-slate-950/20 z-10 pointer-events-none" />

        {/* HTML/CSS Text & Search Bar Overlay (Absolute Center) */}
        <div className="relative z-20 max-w-4xl mx-auto text-center py-16 md:py-20 w-full">

          {/* Live Listings Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Over 14,000 Hardware Listings • Tracked Live Across Bangladesh</span>
          </div>

          {/* Bengali Headline - Large, bold, visually striking with Orange & Blue */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight mb-3 drop-shadow-lg text-white">
            <span className="text-amber-400">PC Build</span>{" "}
            <span className="text-white">থেকে</span>{" "}
            <span className="text-blue-400">Laptop</span>{" "}
            <span className="text-white">সব এক জায়গায়</span>
          </h1>

          {/* English Subheading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight mb-4 drop-shadow-md">
            Find the Best Tech Deals in <span className="text-blue-400">Bangladesh.</span>
          </h2>

          {/* Subtext */}
          <p className="text-xs sm:text-sm md:text-base text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-sm font-medium">
            Compare real-time prices across <strong className="text-white font-bold">Star Tech</strong>,{" "}
            <strong className="text-white font-bold">Ryans Computers</strong>, and{" "}
            <strong className="text-white font-bold">PCB Store</strong> simultaneously. Zero hidden merchant bias.
          </p>

          {/* Horizontally Centered Massive Search Bar Form */}
          <div className="relative max-w-3xl mx-auto w-full">
            <form
              onSubmit={handleSearch}
              className="flex items-center border-2 border-blue-500/80 rounded-2xl overflow-hidden bg-white shadow-2xl shadow-black/40 focus-within:ring-4 ring-blue-400/40 transition-all p-1"
            >
              <div className="pl-4 text-slate-400 text-lg">🔍</div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowInstantMatches(e.target.value.length > 1);
                }}
                onFocus={() => setShowInstantMatches(searchQuery.length > 1)}
                placeholder="Search RTX 4060, Ryzen 5 7600X, Samsung 980 Pro, Monitors..."
                className="flex-1 px-4 py-3.5 bg-transparent outline-none text-slate-800 font-semibold text-sm md:text-base placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => router.push("/search?q=Graphics%20Cards")}
                className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 mr-2 transition cursor-pointer"
              >
                <span>⚙️</span> Filters
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 md:px-8 py-3.5 rounded-xl font-bold text-sm md:text-base hover:bg-blue-700 transition flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                <span>Compare Prices</span>
                <span>→</span>
              </button>
            </form>

            {/* Instant Matches Dropdown Preview */}
            {showInstantMatches && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 text-left p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Instant Matches Across 3 Verified Retailers</span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 100% Stock Matched
                  </span>
                </div>

                <div className="space-y-2">
                  <div
                    onClick={() => router.push("/search?q=RTX%204060")}
                    className="p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer transition border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img
                          src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=150&q=80"
                          alt="GPU"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">ZOTAC Gaming GeForce RTX 4060 8GB GDDR6 Twin Edge</p>
                        <p className="text-[10px] text-slate-500">Graphics Cards • 3 Retailers Indexed • 8GB GDDR6</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Lowest @ PCB Store</span>
                      <p className="text-sm font-black text-blue-600 mt-0.5">৳36,900</p>
                    </div>
                  </div>

                  <div
                    onClick={() => router.push("/search?q=Ryzen%205%207600X")}
                    className="p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer transition border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center p-1">
                        <img
                          src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=150&q=80"
                          alt="CPU"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">AMD Ryzen 5 7600X AM5 6-Core 12-Thread Processor</p>
                        <p className="text-[10px] text-slate-500">Processors • 4.7GHz Base / 5.3GHz Boost • 32MB Cache</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Lowest @ Star Tech</span>
                      <p className="text-sm font-black text-blue-600 mt-0.5">৳23,400</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
                  <span>INDEX PARITY: Refreshed Every 2 Hours</span>
                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    View All Live Results →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Trending in BD Tags */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6 text-xs text-slate-200 font-medium">
            <span className="font-bold text-white drop-shadow-xs">Trending in BD:</span>
            {["RTX 4060", "GTX 1650 Super", "Ryzen 5 5600G", "144Hz Gaming Monitor", "1TB Gen4 NVMe", "B650 Motherboard"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTrendingClick(tag)}
                className="px-2.5 py-1 bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20 rounded-lg transition shadow-xs font-semibold cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Minimal Slider Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mt-8 z-30 relative">
            {heroSlides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setHeroSlide(dotIdx)}
                aria-label={`Jump to background slide ${dotIdx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${heroSlide === dotIdx ? "w-8 bg-amber-400 shadow-xs" : "w-2.5 bg-white/40 hover:bg-white/80"
                  }`}
              />
            ))}
          </div>

        </div>

        {/* Slider Arrow Navigation (Left/Right Chevrons) */}
        <button
          type="button"
          onClick={() => setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          aria-label="Previous Slide"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white flex items-center justify-center text-xl font-bold backdrop-blur-xs transition opacity-0 group-hover:opacity-100 cursor-pointer border border-white/20"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          aria-label="Next Slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white flex items-center justify-center text-xl font-bold backdrop-blur-xs transition opacity-0 group-hover:opacity-100 cursor-pointer border border-white/20"
        >
          ›
        </button>
      </section>

      {/* =========================================================================
          VERIFIED RETAILER SYNCHRONIZATION STATUS BAR
         ========================================================================= */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-700 mb-2 sm:mb-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Verified Retailer Synchronization</span>
              <span className="text-slate-400 font-normal hidden md:inline">(Real-time scrapers & direct catalog index)</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
              ● 3 Stores Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex items-center justify-between shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-slate-700 text-xs shadow-2xs">
                  ST
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Star Tech</h4>
                  <p className="text-[11px] text-slate-500">5,849 Active SKUs</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 14m ago
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex items-center justify-between shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-slate-700 text-xs shadow-2xs">
                  RC
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Ryans Computers</h4>
                  <p className="text-[11px] text-slate-500">5,410 Active SKUs</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 11m ago
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 flex items-center justify-between shadow-2xs hover:border-blue-300 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center font-black text-slate-700 text-xs shadow-2xs">
                  PCB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">PCB Store BD</h4>
                  <p className="text-[11px] text-slate-500">1,920 Active SKUs</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 8m ago
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXPLORE BY HARDWARE CATEGORY (With Real Component Photographs)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 font-extrabold text-[11px] uppercase tracking-wider mb-1">
              <span>📁</span> Browse by Component
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Explore by Hardware Category</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Catalog prices aggregated from official multi-store inventory. Select a category to isolate lowest historical dips.
            </p>
          </div>
          <button
            onClick={() => router.push("/search?q=Graphics%20Cards")}
            className="text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition"
          >
            <span>View All 24 Subcategories</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => router.push(`/search?q=${encodeURIComponent(cat.q)}`)}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Large Real Hardware Component Photograph */}
                <div className="w-full h-32 mb-3 bg-white rounded-xl overflow-hidden flex items-center justify-center p-1.5 border border-slate-100 group-hover:border-blue-200 transition">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                  />
                </div>

                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {cat.count}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-3 h-8 leading-relaxed line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                <span className="text-slate-400 font-medium">Starting from</span>
                <span className="font-extrabold text-slate-900 text-sm group-hover:text-blue-600 transition">
                  {cat.starting}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          ALGORITHMIC BEST DEALS OF THE DAY
         ========================================================================= */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-600 font-extrabold text-[11px] uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Algorithmic Detection</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Today&apos;s Biggest Price Drops & Best Deals
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Products with the widest price differential among Star Tech, Ryans, and PCB Store right now.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
              {["All Deals", "GPUs", "CPUs", "Motherboards", "RAM", "Storage", "Laptops", "Monitors", "Power & Cases"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDealFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeDealFilter === tab
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Deals 4-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="p-4 pb-0 flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${deal.badgeColor}`}>
                      {deal.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">● In Stock</span>
                  </div>

                  {/* Product Image & Title */}
                  <div className="p-4">
                    <div className="h-36 flex items-center justify-center p-2 mb-3 bg-slate-50 rounded-xl border border-slate-100">
                      <img src={deal.image} alt={deal.name} className="max-h-28 object-contain mix-blend-multiply" />
                    </div>

                    <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mb-1">
                      {deal.tag}
                    </p>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-blue-600 transition cursor-pointer mb-1 line-clamp-2">
                      {deal.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-3">{deal.specs}</p>

                    {/* Price & Savings Pill */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-slate-400 line-through">৳{deal.wasPrice.toLocaleString()}</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Save ৳{deal.saveAmount.toLocaleString()} ({deal.savePercent})
                      </span>
                    </div>

                    {/* 30-Day Trend Sparkline SVG */}
                    <div className="border border-slate-100 bg-slate-50/70 p-2.5 rounded-xl mb-4">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                        <span>30-Day Trend across 3 stores</span>
                        <span className="font-bold text-emerald-600">Lowest Dip</span>
                      </div>
                      <svg viewBox="0 0 230 35" className="w-full h-7 stroke-blue-600 fill-none stroke-2">
                        <polyline points={deal.trendPoints} />
                      </svg>
                    </div>

                    {/* Store Price Quotes Table */}
                    <div className="space-y-1.5 text-xs">
                      {deal.stores.map((st, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-lg ${st.isLowest ? "bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold" : "text-slate-600"
                            }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${st.isLowest ? "bg-emerald-500" : "bg-slate-300"}`}></span>
                            <span>{st.name}</span>
                            {st.isLowest && (
                              <span className="text-[9px] bg-emerald-200/60 text-emerald-800 px-1.5 py-0.2 rounded font-extrabold">
                                Lowest
                              </span>
                            )}
                          </span>
                          <span>৳{st.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-4 flex gap-2">
                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(deal.name)}`)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer text-center"
                  >
                    Compare Specs
                  </button>
                  <button
                    onClick={() => router.push(`/search?q=${encodeURIComponent(deal.name)}`)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer text-center shadow-xs"
                  >
                    View Deal ↗
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔍</span>
              <div>
                <p className="text-xs font-bold text-blue-900">Scanning 248 hardware retailers hourly</p>
                <p className="text-[11px] text-blue-700">Star Tech, Ryans, and PCB Store prices are verified via API & branch scrapers.</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/search?q=Graphics%20Cards")}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs whitespace-nowrap cursor-pointer"
            >
              Explore All 200+ Active Deals →
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          HOW SMARTPRICE BD SAVES MONEY ON ENTIRE PC BUILDS (Case Study)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16" id="pc-builder">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-xs">

          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              📊 Real-World Savings Analytics
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              How SmartPrice BD Saves Money on Entire PC Builds
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              No single retailer in Bangladesh has the lowest price across every component. Buying your processor from Store A, graphics card from Store B, and SSD from Store C routinely saves <strong className="text-slate-900">৳5,000 to ৳8,500</strong> off a typical mid-to-high-end build.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/pc-builder")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-2"
              >
                <span>Launch AI PC Builder</span>
                <span>✨</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 shadow-2xs">
            <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📋</span>
                <span className="text-xs font-extrabold text-slate-900">Case Study: 1080p Esports Gaming Rig (৳85K Tier)</span>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Total Saved: ৳4,250
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">Ryzen 5 7600X CPU</p>
                  <p className="text-[10px] text-slate-500">Official Star Tech Outlet</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 line-through text-[11px] mr-2">৳26,500</span>
                  <span className="font-extrabold text-blue-600">৳24,800</span>
                  <span className="block text-[10px] font-bold text-emerald-600">Save ৳1,700 @ Star Tech</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">ZOTAC RTX 4060 8GB GPU</p>
                  <p className="text-[10px] text-slate-500">Official PCB Store Outlet</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 line-through text-[11px] mr-2">৳39,500</span>
                  <span className="font-extrabold text-blue-600">৳36,800</span>
                  <span className="block text-[10px] font-bold text-emerald-600">Save ৳2,700 @ PCB Store</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-900">Kingston KC3000 1TB NVMe</p>
                  <p className="text-[10px] text-slate-500">Official Ryans Outlet</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 line-through text-[11px] mr-2">৳12,400</span>
                  <span className="font-extrabold text-blue-600">৳11,850</span>
                  <span className="block text-[10px] font-bold text-emerald-600">Save ৳550 @ Ryans</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
              <span>Single-vendor cost: <strong className="text-slate-800">৳78,400</strong></span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                SmartPrice BD Multi-Vendor Optimization: ৳74,150
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          HOW SMARTPRICE BD WORKS (3 Steps)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Simple & Transparent
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
            How SmartPrice BD Works
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Save thousands of Takas in 3 simple steps without opening twenty browser tabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-xs">
            <span className="text-4xl font-black text-blue-100 absolute top-4 right-5">01</span>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Search or Build Rig</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Input individual hardware parts or use our full PC Builder Matrix to configure processor, graphics, memory, and power modules.
            </p>
            <div className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
              <span>✓ Instant SKU Matching</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-xs">
            <span className="text-4xl font-black text-emerald-100 absolute top-4 right-5">02</span>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
              ⚖️
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Compare Across BD</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              View live pricing matrices with real-time stock markers, past price history graphs, warranty periods, and store ratings.
            </p>
            <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <span>✓ Real-time In-Stock Verification</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-xs">
            <span className="text-4xl font-black text-blue-100 absolute top-4 right-5">03</span>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
              🛒
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Buy Direct & Save</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Click &apos;View Deal&apos; to checkout directly on the retailer&apos;s official website or walk into their physical showroom. Zero markup.
            </p>
            <div className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
              <span>✓ 100% Free for Bangladeshi Buyers</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CERTIFIED TECH RETAILERS WE TRACK
         ========================================================================= */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Official Ecosystem Partners
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-2">
              Certified Tech Retailers We Track
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              We interface directly with the inventory feeds and public catalog of Bangladesh&apos;s premier computer component purveyors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-slate-800 text-sm">
                  ST
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Star Tech & Engineering Ltd</h3>
              <p className="text-xs text-amber-500 font-semibold mt-0.5 mb-2">★ 4.8 (10,400+ Buyer Ratings)</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Largest national tech distributor with branches in Dhaka, Chittagong, Rajshahi, Khulna, and Rangpur.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Indexed SKUs:</span>
                  <span className="font-bold">5,849 Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Update Interval:</span>
                  <span className="font-bold text-emerald-600">Every 2 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Policy:</span>
                  <span className="font-bold">Official BD Brand Warranty</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/search?q=Star%20Tech")}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold py-2 rounded-xl transition cursor-pointer"
              >
                Browse Star Tech Inventory →
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-slate-800 text-sm">
                  RC
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Ryans Computers Ltd</h3>
              <p className="text-xs text-amber-500 font-semibold mt-0.5 mb-2">★ 4.7 (8,900+ Buyer Ratings)</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Pioneering PC hardware chain with comprehensive physical showroom coverage across 64 districts.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Indexed SKUs:</span>
                  <span className="font-bold">5,410 Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Update Interval:</span>
                  <span className="font-bold text-emerald-600">Every 2 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Policy:</span>
                  <span className="font-bold">Official Distributor Seal</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/search?q=Ryans")}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold py-2 rounded-xl transition cursor-pointer"
              >
                Browse Ryans Inventory →
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-slate-800 text-sm">
                  PCB
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">PCB Store / Techland Hub</h3>
              <p className="text-xs text-amber-500 font-semibold mt-0.5 mb-2">★ 4.9 (5,400+ Enthusiast Ratings)</p>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Enthusiast destination renowned for competitive custom loop parts, graphics card drops, and specialty gaming gear.
              </p>
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Indexed SKUs:</span>
                  <span className="font-bold">1,920 Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Update Interval:</span>
                  <span className="font-bold text-emerald-600">Every 1 Hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Warranty Policy:</span>
                  <span className="font-bold">Official Replacement Guarantee</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/search?q=PCB%20Store")}
                className="w-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold py-2 rounded-xl transition cursor-pointer"
              >
                Browse PCB Store Inventory →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NEVER OVERPAY ON TECH COMPONENTS IN BD (CTA Banner)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16" id="alerts">
        <div className="bg-linear-to-r from-blue-700 to-blue-900 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-blue-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-extrabold text-blue-200 bg-blue-800/80 px-3 py-1 rounded-full uppercase tracking-wider">
                🛡️ Zero-Spam Hardware Radar
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Never Overpay on Tech Components in BD.
              </h2>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed max-w-xl">
                Set target alerts for your dream GPU or CPU. We&apos;ll ping your email or Telegram the moment Star Tech, Ryans, or PCB Store drops the price below your threshold.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Alert tracking activated for ${emailAlert}!`);
                  setEmailAlert("");
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-md pt-2"
              >
                <input
                  type="email"
                  required
                  value={emailAlert}
                  onChange={(e) => setEmailAlert(e.target.value)}
                  placeholder="Enter your email for price drops..."
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-800/80 border border-blue-500/50 text-white placeholder-blue-300 text-xs outline-none focus:ring-2 ring-white"
                />
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition shadow-md whitespace-nowrap cursor-pointer"
                >
                  Start Tracking 🔔
                </button>
              </form>

              <p className="text-[10px] text-blue-200">
                Transparency note: SmartPrice BD is 100% free. We respect your data and never share your contact details.
              </p>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>🛠️</span> Interactive PC Builder
                </span>
                <span className="text-[10px] font-bold bg-emerald-400 text-slate-900 px-2 py-0.5 rounded">NEW</span>
              </div>
              <p className="text-xs text-blue-100 mb-4">
                Assemble your custom build. Our multi-store router automatically assigns each component to the specific retailer offering the lowest price in Bangladesh.
              </p>

              <div className="bg-black/20 rounded-xl p-3 text-xs mb-4 space-y-1">
                <div className="flex justify-between text-blue-200">
                  <span>Sample 1080p Budget Rig:</span>
                  <span className="font-bold text-white">৳85,200</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Current Single-Store Purchase:</span>
                  <span>+৳4,250 savings</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/search?q=RTX%204060")}
                className="w-full bg-white hover:bg-slate-100 text-blue-900 font-extrabold py-3 rounded-xl text-xs transition cursor-pointer text-center"
              >
                Launch PC Build Configurator →
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}