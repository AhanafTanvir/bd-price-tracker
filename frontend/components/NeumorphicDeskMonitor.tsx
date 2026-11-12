"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export interface ShowcaseSlide {
  shortLabel: string;
  category: string;
  title: string;
  subtitle: string;
  price: string;
  store: string;
  discount: string;
  rating: string;
  accentText: string;
  accentBorder: string;
  glowBg: string;
  progressBg: string;
  image: string;
  searchQuery: string;
}

interface NeumorphicDeskMonitorProps {
  slides: ShowcaseSlide[];
  activeSlideIndex: number;
  onSelectSlide: (idx: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

interface KeyboardKey {
  id: string;
  label: string;
  w: string;
  color: string;
  target?: number;
  action?: "ai" | "pause" | "up" | "down";
}

const MINI_CATEGORIES = [
  { name: "Graphics Cards", q: "Graphics Cards", price: "৳11,500", img: "/categories/gpu.jpg", color: "text-[#2d4cc8]" },
  { name: "Processors / CPUs", q: "Processors", price: "৳9,200", img: "/categories/cpu.jpg", color: "text-[#6d28d9]" },
  { name: "Motherboards", q: "Motherboards", price: "৳7,800", img: "/categories/motherboard.jpg", color: "text-[#18634b]" },
  { name: "RAM & Memory", q: "RAM", price: "৳2,400", img: "/categories/ram.jpg", color: "text-[#0891b2]" },
  { name: "SSDs & Storage", q: "SSD", price: "৳2,900", img: "/categories/ssd.jpg", color: "text-[#b45309]" },
  { name: "Gaming Monitors", q: "Monitors", price: "৳12,500", img: "/categories/monitor.jpg", color: "text-[#a91e2c]" },
  { name: "Laptops", q: "Laptop", price: "৳42,000", img: "/categories/laptop.jpg", color: "text-[#4f46e5]" },
  { name: "Power & Cases", q: "Power Supply", price: "৳3,800", img: "/categories/psu-case.jpg", color: "text-[#0d9488]" },
];

const MINI_DEALS = [
  {
    name: "Gigabyte RTX 4060 WINDFORCE OC 8GB",
    q: "RTX 4060",
    store: "PCB Store BD",
    was: "৳41,500",
    price: "৳36,900",
    save: "-11%",
    img: "/categories/gpu.jpg",
  },
  {
    name: "AMD Ryzen 5 7600X AM5 Processor",
    q: "Ryzen 5 7600X",
    store: "Star Tech",
    was: "৳26,500",
    price: "৳23,400",
    save: "-12%",
    img: "/categories/cpu.jpg",
  },
  {
    name: "Samsung 980 Pro 1TB NVMe M.2 SSD",
    q: "Samsung 980 Pro",
    store: "Ryans Computers",
    was: "৳12,500",
    price: "৳10,800",
    save: "-14%",
    img: "/categories/ssd.jpg",
  },
  {
    name: "MSI MAG 274QRF QD 180Hz Monitor",
    q: "MSI Monitor",
    store: "Star Tech",
    was: "৳38,000",
    price: "৳34,500",
    save: "-9%",
    img: "/categories/monitor.jpg",
  },
];

export default function NeumorphicDeskMonitor({
  slides,
  activeSlideIndex,
  onSelectSlide,
  isPaused,
  onTogglePause,
}: NeumorphicDeskMonitorProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAccRef = useRef<number>(0);
  const isResettingRef = useRef<boolean>(false);
  const resetPauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isHoveringScreen, setIsHoveringScreen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSectionLabel, setActiveSectionLabel] = useState("Hero & Live Search");
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [mouseClicked, setMouseClicked] = useState(false);

  const active = slides[activeSlideIndex];

  // Auto-scroll engine inside the Neumorphic Monitor Viewport
  useEffect(() => {
    let rafId: number;
    let isWaitingAtBottom = false;

    const step = () => {
      const el = scrollContainerRef.current;
      if (el && !isPaused && !isHoveringScreen && !isWaitingAtBottom && !isResettingRef.current) {
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll > 0) {
          if (scrollAccRef.current >= maxScroll - 1) {
            isWaitingAtBottom = true;
            resetPauseTimeoutRef.current = setTimeout(() => {
              if (scrollContainerRef.current) {
                isResettingRef.current = true;
                scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
                scrollAccRef.current = 0;
              }
              setTimeout(() => {
                isResettingRef.current = false;
                isWaitingAtBottom = false;
              }, 850);
            }, 1200);
          } else {
            scrollAccRef.current += 0.65;
            el.scrollTop = scrollAccRef.current;
          }
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId);
      if (resetPauseTimeoutRef.current) clearTimeout(resetPauseTimeoutRef.current);
    };
  }, [isPaused, isHoveringScreen]);

  const handleContainerScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (!isResettingRef.current && Math.abs(el.scrollTop - scrollAccRef.current) > 4) {
      scrollAccRef.current = el.scrollTop;
    }
    const maxScroll = el.scrollHeight - el.clientHeight;
    const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (el.scrollTop / maxScroll) * 100)) : 0;
    setScrollPercent(pct);

    if (pct < 16) setActiveSectionLabel("Hero & Live Search");
    else if (pct < 32) setActiveSectionLabel("Verified Store Sync");
    else if (pct < 56) setActiveSectionLabel("Hardware Categories");
    else if (pct < 76) setActiveSectionLabel("Today's Best Deals");
    else if (pct < 90) setActiveSectionLabel("AI PC Builder");
    else setActiveSectionLabel("Price Drop Radar");
  };

  const scrollToPercent = (pct: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const targetTop = (pct / 100) * maxScroll;
    scrollAccRef.current = targetTop;
    el.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const scrollByDelta = (delta: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const nextTop = Math.min(maxScroll, Math.max(0, el.scrollTop + delta));
    scrollAccRef.current = nextTop;
    el.scrollTo({ top: nextTop, behavior: "smooth" });
  };

  const triggerKeyVisual = (keyLabel: string, slideTargetIdx?: number) => {
    setPressedKey(keyLabel);
    setTimeout(() => setPressedKey(null), 220);
    if (typeof slideTargetIdx === "number") {
      onSelectSlide(slideTargetIdx % slides.length);
      scrollToPercent(42);
    }
  };

  const handleMouseClick = () => {
    setMouseClicked(true);
    setTimeout(() => setMouseClicked(false), 240);
    const el = scrollContainerRef.current;
    if (el) {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (el.scrollTop >= maxScroll - 25) {
        scrollToPercent(0);
      } else {
        scrollByDelta(140);
      }
    }
  };

  const navigateTo = (href: string) => {
    if (href.startsWith("#")) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    router.push(href);
  };

  const keyboardRows: KeyboardKey[][] = [
    [
      { id: "ESC", label: "ESC", w: "w-7", color: "text-[#a91e2c]", target: 0 },
      { id: "1", label: "GPU", w: "w-8", color: "text-[#2d4cc8]", target: 0 },
      { id: "2", label: "RAM", w: "w-8", color: "text-[#0891b2]", target: 1 },
      { id: "3", label: "MON", w: "w-8", color: "text-[#a91e2c]", target: 2 },
      { id: "4", label: "CPU", w: "w-8", color: "text-[#6d28d9]", target: 3 },
      { id: "5", label: "SSD", w: "w-8", color: "text-[#b45309]", target: 4 },
      { id: "6", label: "LAP", w: "w-8", color: "text-[#4f46e5]", target: 5 },
      { id: "7", label: "MB", w: "w-7", color: "text-[#18634b]", target: 6 },
      { id: "8", label: "PSU", w: "w-7", color: "text-[#0d9488]", target: 7 },
      { id: "DEL", label: "⌫", w: "w-9", color: "text-[#44476a]" },
    ],
    [
      { id: "TAB", label: "⇥", w: "w-9", color: "text-[#66799e]" },
      { id: "Q", label: "Q", w: "w-7", color: "text-[#44476a]" },
      { id: "W", label: "W", w: "w-7", color: "text-[#2d4cc8]", action: "up" },
      { id: "E", label: "E", w: "w-7", color: "text-[#44476a]" },
      { id: "R", label: "R", w: "w-7", color: "text-[#44476a]" },
      { id: "T", label: "T", w: "w-7", color: "text-[#44476a]" },
      { id: "Y", label: "Y", w: "w-7", color: "text-[#44476a]" },
      { id: "U", label: "U", w: "w-7", color: "text-[#44476a]" },
      { id: "I", label: "I", w: "w-7", color: "text-[#44476a]" },
      { id: "P", label: "P", w: "w-8", color: "text-[#44476a]" },
    ],
    [
      { id: "CAPS", label: "⇪", w: "w-10", color: "text-[#66799e]" },
      { id: "A", label: "A", w: "w-7", color: "text-[#2d4cc8]" },
      { id: "S", label: "S", w: "w-7", color: "text-[#2d4cc8]", action: "down" },
      { id: "D", label: "D", w: "w-7", color: "text-[#2d4cc8]" },
      { id: "F", label: "F", w: "w-7", color: "text-[#44476a]" },
      { id: "G", label: "G", w: "w-7", color: "text-[#44476a]" },
      { id: "H", label: "H", w: "w-7", color: "text-[#44476a]" },
      { id: "J", label: "J", w: "w-7", color: "text-[#44476a]" },
      { id: "ENT", label: "↵", w: "w-11", color: "text-[#2d4cc8]" },
    ],
    [
      { id: "CTRL", label: "CTRL", w: "w-9", color: "text-[#66799e]" },
      { id: "FN", label: "AI", w: "w-8", color: "text-[#6d28d9]", action: "ai" },
      { id: "SPACE", label: "SMARTPRICEBD", w: "flex-1", color: "text-[#2d4cc8]", action: "pause" },
      { id: "UP", label: "▲", w: "w-7", color: "text-[#44476a]", action: "up" },
      { id: "DOWN", label: "▼", w: "w-7", color: "text-[#44476a]", action: "down" },
    ],
  ];

  return (
    <div className="w-full max-w-[600px] mx-auto select-none">
      {/* =========================================================================
          1. NEUMORPHIC MONITOR CHASSIS & AUTO-SCROLLING LIVE WEBSITE
         ========================================================================= */}
      <div className="neu-card rounded-[28px] p-3.5 sm:p-4 relative">
        
        {/* Top Bezel Webcam & Sensors */}
        <div className="flex items-center justify-center gap-2 mb-2.5">
          <span className="w-1 h-1 rounded-full bg-[#93a0b8]"></span>
          <span className="neu-inset w-2.5 h-2.5 rounded-full flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-[#2d4cc8]/80"></span>
          </span>
          <span className="w-1 h-1 rounded-full bg-[#93a0b8]"></span>
        </div>

        {/* Recessed Widescreen Monitor Display */}
        <div
          className="neu-inset-deep rounded-[18px] p-1.5 bg-[#dfe2eb]"
          onMouseEnter={() => setIsHoveringScreen(true)}
          onMouseLeave={() => setIsHoveringScreen(false)}
        >
          <div className="relative rounded-[14px] overflow-hidden bg-[#e6e7ee] border border-[#c8d0e0] h-[290px] sm:h-[325px] flex flex-col">
            
            {/* Mini Browser Top Chrome */}
            <div className="bg-[#e6e7ee] border-b border-[#d1d9e6] px-3 py-1.5 flex items-center justify-between gap-2 shrink-0 z-30">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span>
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              </div>

              <div className="neu-inset px-2.5 py-0.5 rounded-full text-[9px] font-extrabold text-[#44476a] flex items-center gap-1.5 truncate max-w-[220px]">
                <span className="text-[#18634b]">🔒</span>
                <span>smartpricebd.com</span>
                <span className="text-[#2d4cc8]">• {activeSectionLabel}</span>
              </div>

              <button
                type="button"
                onClick={onTogglePause}
                className="neu-pill px-2 py-0.5 rounded-full text-[8px] font-black text-[#18634b] flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isPaused || isHoveringScreen ? "bg-[#f59e0b]" : "bg-[#10b981] animate-pulse"}`}></span>
                <span>{isPaused ? "PAUSED" : isHoveringScreen ? "INTERACT" : "AUTO-SCROLL"}</span>
              </button>
            </div>

            {/* =================================================================
                SCROLLABLE MINIATURE SMARTPRICEBD WEBSITE RUNNING INSIDE MONITOR
               ================================================================= */}
            <div
              ref={scrollContainerRef}
              onScroll={handleContainerScroll}
              className="relative flex-1 overflow-y-auto overflow-x-hidden bg-[#e6e7ee]"
            >
              {/* Animated Demo Cursor (Visible while auto-scrolling) */}
              {!isHoveringScreen && !isPaused && (
                <div className="pointer-events-none sticky top-12 left-0 z-30 h-0 w-full">
                  <div className="relative w-full">
                    <div className="absolute animate-monitor-cursor">
                      <svg className="w-4 h-4 drop-shadow-md" viewBox="0 0 24 24" fill="#31344b" stroke="#ffffff" strokeWidth="1.5">
                        <path d="M5 3l14 9-6.5 1.5L9 20z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Sticky Mini Website Navbar inside the Monitor */}
              <div className="sticky top-0 z-20 bg-[#e6e7ee]/95 backdrop-blur-sm border-b border-[#d1d9e6] px-3 py-1.5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => scrollToPercent(0)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <span className="w-4 h-4 rounded bg-gradient-to-br from-[#2d4cc8] to-[#6d28d9] text-white text-[8px] font-black flex items-center justify-center">S</span>
                  <span className="text-[9px] font-black text-[#31344b]">SmartPrice<span className="text-[#2d4cc8]">BD</span></span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => navigateTo("/search?q=RTX%204060")}
                    className="neu-pill px-2 py-0.5 rounded-md text-[8px] font-extrabold text-[#2d4cc8] cursor-pointer hover:underline"
                  >
                    Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo("/pc-builder")}
                    className="bg-gradient-to-r from-[#6d28d9] to-[#2d4cc8] text-white px-2 py-0.5 rounded-md text-[8px] font-black cursor-pointer"
                  >
                    ✨ AI Builder
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo("#alerts")}
                    className="neu-pill px-2 py-0.5 rounded-md text-[8px] font-extrabold text-[#18634b] cursor-pointer"
                  >
                    🔔 Alerts
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-4">
                
                {/* MINI SECTION 1: Hero Feature + Clickable Sliding Product Spotlight */}
                <div className="neu-card-sm rounded-2xl p-3 bg-[#e6e7ee]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="neu-pill-inset px-2 py-0.5 rounded-full text-[8px] font-black text-[#18634b]">
                      ● 14,000+ Live Listings
                    </span>
                    <span className="text-[8px] font-black text-[#6d28d9]">Click any feature to open ↗</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2.5 items-center">
                    <div className="col-span-7 space-y-1.5">
                      <h4 className="text-[11px] font-black text-[#31344b] leading-tight">
                        <span className="text-[#2d4cc8]">PC Build</span> থেকে <span className="text-[#6d28d9]">Laptop</span> সব এক জায়গায়
                      </h4>
                      <div key={`mini-pop-${activeSlideIndex}`} className="animate-neu-pop">
                        <span className={`text-[9px] font-black ${active.accentText} block`}>
                          Featured: {active.category} ({active.price})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => navigateTo(`/search?q=${encodeURIComponent(active.searchQuery)}`)}
                          className="neu-btn-primary px-2.5 py-1 rounded-lg text-[8px] font-black cursor-pointer"
                        >
                          Search {active.shortLabel} →
                        </button>
                        <button
                          type="button"
                          onClick={() => navigateTo("/pc-builder")}
                          className="neu-btn px-2 py-1 rounded-lg text-[8px] font-extrabold text-[#6d28d9] cursor-pointer"
                        >
                          AI Rig
                        </button>
                      </div>
                    </div>

                    <div
                      onClick={() => navigateTo(`/search?q=${encodeURIComponent(active.searchQuery)}`)}
                      className="col-span-5 h-20 flex items-center justify-center cursor-pointer"
                    >
                      <img
                        key={`mini-img-${activeSlideIndex}`}
                        src={active.image}
                        alt={active.category}
                        className="max-h-18 w-auto object-contain mix-blend-multiply animate-neu-slide-right"
                      />
                    </div>
                  </div>
                </div>

                {/* MINI SECTION 2: Verified Retailer Sync */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 px-1">
                    <span className="text-[8px] font-black uppercase tracking-wider text-[#66799e]">
                      Verified BD Retailers
                    </span>
                    <span className="text-[8px] font-extrabold text-[#18634b]">● 3 Stores Synced</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "Star Tech", skus: "5,849 SKUs", q: "Star Tech", color: "text-[#a91e2c]" },
                      { name: "Ryans", skus: "5,410 SKUs", q: "Ryans", color: "text-[#b45309]" },
                      { name: "PCB Store", skus: "1,920 SKUs", q: "PCB Store", color: "text-[#2d4cc8]" },
                    ].map((st) => (
                      <button
                        key={st.name}
                        type="button"
                        onClick={() => navigateTo(`/search?q=${encodeURIComponent(st.q)}`)}
                        className="neu-btn rounded-xl p-2 text-left cursor-pointer"
                      >
                        <span className={`text-[9px] font-black block ${st.color}`}>{st.name}</span>
                        <span className="text-[7.5px] font-bold text-[#66799e] block">{st.skus}</span>
                        <span className="text-[7px] font-black text-[#18634b] mt-0.5 block">Browse →</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* MINI SECTION 3: Clickable Hardware Categories Grid */}
                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[9px] font-black text-[#31344b]">
                      Explore <span className="text-[#2d4cc8]">Hardware Categories</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateTo("/search?q=Graphics%20Cards")}
                      className="text-[8px] font-black text-[#2d4cc8] cursor-pointer hover:underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {MINI_CATEGORIES.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => navigateTo(`/search?q=${encodeURIComponent(cat.q)}`)}
                        className="neu-card-sm hover:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] rounded-xl p-2 flex items-center gap-2 text-left transition cursor-pointer bg-[#e6e7ee]"
                      >
                        <div className="w-9 h-9 flex items-center justify-center shrink-0">
                          <img
                            src={cat.img}
                            alt={cat.name}
                            className="max-h-8 max-w-8 object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[8.5px] font-black text-[#31344b] truncate">{cat.name}</p>
                          <p className={`text-[8px] font-black ${cat.color}`}>{cat.price}+</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* MINI SECTION 4: Today's Biggest Price Drops (Clickable Products) */}
                <div>
                  <div className="flex justify-between items-center mb-2 px-1">
                    <span className="text-[9px] font-black text-[#31344b]">
                      Today&apos;s <span className="text-[#a91e2c]">Price Drops</span> & <span className="text-[#18634b]">Best Deals</span>
                    </span>
                    <span className="neu-pill-inset px-1.5 py-0.5 rounded-full text-[7px] font-black text-[#18634b]">
                      LIVE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {MINI_DEALS.map((deal) => (
                      <div
                        key={deal.name}
                        onClick={() => navigateTo(`/search?q=${encodeURIComponent(deal.q)}`)}
                        className="neu-card-sm rounded-xl p-2 flex flex-col justify-between cursor-pointer hover:border-[#2d4cc8]/50 transition bg-[#e6e7ee]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[7px] font-black text-[#a91e2c]">{deal.save}</span>
                          <span className="text-[7px] font-bold text-[#18634b]">{deal.store}</span>
                        </div>
                        <div className="h-14 flex items-center justify-center my-1">
                          <img
                            src={deal.img}
                            alt={deal.name}
                            className="max-h-12 w-auto object-contain mix-blend-multiply"
                          />
                        </div>
                        <p className="text-[8px] font-extrabold text-[#31344b] line-clamp-1">{deal.name}</p>
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#d1d9e6]">
                          <span className="text-[7px] line-through text-[#66799e]">{deal.was}</span>
                          <span className="text-[9px] font-black text-[#a91e2c]">{deal.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MINI SECTION 5: AI PC Builder Feature Showcase */}
                <div
                  onClick={() => navigateTo("/pc-builder")}
                  className="neu-card-sm rounded-2xl p-3 cursor-pointer border-l-4 border-l-[#6d28d9] bg-[#e6e7ee]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9px] font-black text-[#6d28d9]">✨ AI PC BUILDER • GEMINI 2.5</span>
                    <span className="neu-pill-inset px-2 py-0.5 rounded-full text-[7.5px] font-black text-[#18634b]">
                      Save ৳4,250+
                    </span>
                  </div>
                  <p className="text-[8px] text-[#44476a] font-semibold mb-2">
                    Enter your BDT budget and generate a 100% socket & DDR5 verified PC build routed to the cheapest BD stores.
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="neu-inset px-2 py-1 rounded-lg text-[8px] font-black text-[#31344b]">
                      Target Rig: ৳75,000 BDT
                    </span>
                    <span className="neu-btn-purple px-2.5 py-1 rounded-lg text-[8px] font-black">
                      Launch AI Builder →
                    </span>
                  </div>
                </div>

                {/* MINI SECTION 6: Price Drop Radar */}
                <div
                  onClick={() => navigateTo("#alerts")}
                  className="neu-inset rounded-2xl p-3 flex items-center justify-between gap-2 cursor-pointer"
                >
                  <div>
                    <p className="text-[9px] font-black text-[#2d4cc8]">🔔 Zero-Spam Hardware Radar</p>
                    <p className="text-[7.5px] text-[#44476a] font-semibold">
                      Get instant alerts when GPUs or CPUs hit record lows.
                    </p>
                  </div>
                  <span className="neu-btn-emerald px-2.5 py-1 rounded-lg text-[8px] font-black shrink-0">
                    Set Alert →
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Monitor Video / Scroll Progress Scrubber Bar */}
            <div className="bg-[#e6e7ee] border-t border-[#d1d9e6] px-3 py-1.5 flex items-center gap-2.5 z-30 shrink-0">
              <button
                type="button"
                onClick={onTogglePause}
                title={isPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
                className="neu-btn w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-[#2d4cc8] font-black cursor-pointer shrink-0"
              >
                {isPaused ? "▶" : "❚❚"}
              </button>

              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickPct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
                  scrollToPercent(clickPct);
                }}
                title="Click to jump to any section of the website"
                className="flex-1 h-2 bg-[#d1d9e6] rounded-full overflow-hidden cursor-pointer relative"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#2d4cc8] via-[#6d28d9] to-[#10b981] transition-all duration-100"
                  style={{ width: `${scrollPercent}%` }}
                />
              </div>

              <span className="text-[9px] font-extrabold text-[#44476a] font-mono shrink-0">
                {Math.round(scrollPercent)}%
              </span>
            </div>

          </div>
        </div>

        {/* Bottom Monitor Chin: Brand Logo, Power LED, Tactile OSD Scroll/Play Controls */}
        <div className="mt-3 px-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_6px_#10b981]"></span>
            <span className="text-[10px] font-black tracking-widest uppercase text-[#66799e]">
              SmartPriceBD Display
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollByDelta(-120)}
              title="Scroll Up"
              className="neu-btn w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-[#44476a] hover:text-[#2d4cc8] cursor-pointer"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={onTogglePause}
              title={isPaused ? "Auto-Scroll" : "Pause"}
              className="neu-btn w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-[#2d4cc8] cursor-pointer"
            >
              {isPaused ? "▶" : "❚❚"}
            </button>
            <button
              type="button"
              onClick={() => scrollByDelta(120)}
              title="Scroll Down"
              className="neu-btn w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-[#44476a] hover:text-[#2d4cc8] cursor-pointer"
            >
              ▼
            </button>
            <button
              type="button"
              onClick={() => navigateTo(`/search?q=${encodeURIComponent(active.searchQuery)}`)}
              className="neu-btn-primary text-[10px] font-extrabold px-2.5 py-1 rounded-full ml-1 cursor-pointer"
            >
              Open {active.shortLabel} ↗
            </button>
          </div>
        </div>
      </div>

      {/* Sculpted Neumorphic Monitor Stand (Neck & Base) */}
      <div className="flex flex-col items-center -mt-0.5 relative z-0">
        <div className="w-14 h-7 bg-[#e6e7ee] border-x border-[#d1d9e6] shadow-[5px_2px_10px_#b8b9be,-5px_2px_10px_#ffffff]"></div>
        <div className="neu-card w-44 sm:w-52 h-3.5 rounded-full flex items-center justify-center">
          <div className="w-24 h-1 rounded-full bg-gradient-to-r from-[#2d4cc8]/40 via-[#6d28d9]/40 to-[#10b981]/40"></div>
        </div>
      </div>

      {/* =========================================================================
          2. NEUMORPHIC KEYBOARD & MOUSE DESK SETUP
         ========================================================================= */}
      <div className="mt-4 flex items-end justify-center gap-3 sm:gap-4 px-1">
        
        {/* Neumorphic Mechanical Keyboard */}
        <div className="neu-card rounded-2xl p-2 sm:p-2.5 flex-1 max-w-[430px]">
          <div className="space-y-1.5">
            {keyboardRows.map((row, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1 sm:gap-1.5">
                {row.map((key) => {
                  const isActiveTarget =
                    typeof key.target === "number" && key.target === activeSlideIndex;
                  const isKeyPressed = pressedKey === key.id || isActiveTarget;

                  return (
                    <button
                      key={key.id}
                      type="button"
                      onClick={() => {
                        if (key.action === "pause") {
                          triggerKeyVisual(key.id);
                          onTogglePause();
                        } else if (key.action === "up") {
                          triggerKeyVisual(key.id);
                          scrollByDelta(-130);
                        } else if (key.action === "down") {
                          triggerKeyVisual(key.id);
                          scrollByDelta(130);
                        } else if (key.action === "ai") {
                          triggerKeyVisual(key.id);
                          navigateTo("/pc-builder");
                        } else {
                          triggerKeyVisual(key.id, key.target);
                        }
                      }}
                      className={`${key.w} h-5 sm:h-6 rounded-md text-[7px] sm:text-[8px] font-black flex items-center justify-center transition cursor-pointer shrink-0 ${
                        isKeyPressed
                          ? `neu-inset ${key.color}`
                          : `neu-btn ${key.color}`
                      }`}
                    >
                      {key.id === "SPACE" ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-10 sm:w-14 h-0.5 rounded-full bg-gradient-to-r from-[#2d4cc8] via-[#6d28d9] to-[#10b981]" />
                        </span>
                      ) : (
                        key.label
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Neumorphic Ergonomic Wireless Mouse */}
        <button
          type="button"
          onClick={handleMouseClick}
          title="Click mouse to scroll through website sections"
          className={`neu-card w-14 sm:w-16 h-[106px] sm:h-[116px] rounded-[28px] p-2 flex flex-col items-center justify-between cursor-pointer transition shrink-0 ${
            mouseClicked ? "scale-[0.97]" : "hover:-translate-y-0.5"
          }`}
        >
          <div className="w-full h-11 border-b border-[#d1d9e6] flex items-center justify-center relative pb-1">
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-[#d1d9e6]" />
            {/* Scroll Wheel animates subtly while monitor scrolls */}
            <div className="neu-inset w-3 h-6 rounded-full relative z-10 flex items-center justify-center overflow-hidden">
              <span
                className={`w-1.5 h-2 rounded-full bg-[#2d4cc8] transition-transform duration-300 ${
                  !isPaused && !isHoveringScreen ? "animate-bounce" : ""
                }`}
              ></span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 pb-1">
            <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#2d4cc8] to-[#10b981] opacity-80"></span>
            <span className="text-[6px] font-black tracking-widest text-[#66799e] uppercase">DPI</span>
          </div>
        </button>

      </div>

    </div>
  );
}
