"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import NeumorphicDeskMonitor, { ShowcaseSlide } from "../components/NeumorphicDeskMonitor";

const HEADLINE_SEGMENTS = [
  { text: "PC Build", colorClass: "text-[#2d4cc8]" },
  { text: " থেকে ", colorClass: "text-[#31344b]" },
  { text: "Laptop", colorClass: "text-[#6d28d9]" },
  { text: " সব এক জায়গায়", colorClass: "text-[#31344b]" },
];

function TypingHeadline() {
  const tokens = useMemo(() => {
    const result: { char: string; colorClass: string }[] = [];
    const SegmenterCtor =
      typeof Intl !== "undefined" && "Segmenter" in Intl
        ? (Intl as unknown as { Segmenter: new (locale: string, opts: { granularity: string }) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter
        : null;
    const segmenter = SegmenterCtor ? new SegmenterCtor("bn", { granularity: "grapheme" }) : null;

    for (const seg of HEADLINE_SEGMENTS) {
      const graphemes = segmenter
        ? Array.from(segmenter.segment(seg.text), (s) => s.segment)
        : Array.from(seg.text);
      for (const g of graphemes) {
        result.push({ char: g, colorClass: seg.colorClass });
      }
    }
    return result;
  }, []);

  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "typing") {
      if (visibleCount < tokens.length) {
        timer = setTimeout(() => {
          setVisibleCount((prev) => prev + 1);
        }, 65);
      } else {
        timer = setTimeout(() => {
          setPhase("holding");
        }, 50);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => {
        setPhase("erasing");
      }, 3200);
    } else if (phase === "erasing") {
      if (visibleCount > 0) {
        timer = setTimeout(() => {
          setVisibleCount((prev) => prev - 1);
        }, 30);
      } else {
        timer = setTimeout(() => {
          setPhase("typing");
        }, 350);
      }
    }

    return () => clearTimeout(timer);
  }, [phase, visibleCount, tokens.length]);

  const visibleTokens = tokens.slice(0, visibleCount);

  return (
    <h1
      aria-label="PC Build থেকে Laptop সব এক জায়গায়"
      className="text-[28px] sm:text-5xl xl:text-[54px] font-black tracking-tight leading-[1.2] text-[#31344b] min-h-[76px] sm:min-h-[120px] xl:min-h-[132px]"
    >
      {visibleTokens.map((t, idx) => (
        <span key={idx} className={t.colorClass}>
          {t.char}
        </span>
      ))}
      <span
        aria-hidden="true"
        className="inline-block w-[3px] sm:w-[4px] h-[0.88em] bg-gradient-to-b from-[#2d4cc8] to-[#6d28d9] rounded-full ml-2.5 sm:ml-3.5 align-middle animate-caret-blink"
      />
    </h1>
  );
}

function StarRating({ rating = "4.8" }: { rating?: string }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-3.5 h-3.5 text-[#f0b400] fill-current drop-shadow-[0_1px_1px_rgba(240,180,0,0.3)]"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="neu-pill-inset text-[10px] font-extrabold text-[#31344b] px-2 py-0.5 rounded-full ml-1.5">
        {rating}
      </span>
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDealFilter, setActiveDealFilter] = useState("All Deals");
  const [emailAlert, setEmailAlert] = useState("");
  const [showInstantMatches, setShowInstantMatches] = useState(false);
  const router = useRouter();

  const [heroSlide, setHeroSlide] = useState(0);
  const [isMonitorPaused, setIsMonitorPaused] = useState(false);

  const heroShowcaseSlides: ShowcaseSlide[] = [
    {
      shortLabel: "GPU",
      category: "Graphics Cards",
      title: "RTX 4060 & Radeon RX Series",
      subtitle: "Compare GPU street drops across Star Tech, Ryans & PCB Store",
      price: "৳36,900",
      store: "Lowest @ PCB Store BD",
      discount: "-11% Price Drop",
      rating: "4.9",
      accentText: "text-[#2d4cc8]",
      accentBorder: "border-l-[#2d4cc8]",
      glowBg: "bg-[#2d4cc8]/10",
      progressBg: "bg-[#2d4cc8]",
      image: "/categories/gpu.jpg",
      searchQuery: "Graphics Cards",
    },
    {
      shortLabel: "RAM",
      category: "RAM & Memory",
      title: "DDR5 6000MHz & DDR4 Kits",
      subtitle: "Track dual-channel high-speed desktop memory deals live",
      price: "৳2,400",
      store: "Lowest @ PCB Store BD",
      discount: "-13% Best Value",
      rating: "4.8",
      accentText: "text-[#0891b2]",
      accentBorder: "border-l-[#0891b2]",
      glowBg: "bg-[#0891b2]/10",
      progressBg: "bg-[#0891b2]",
      image: "/categories/ram.jpg",
      searchQuery: "RAM",
    },
    {
      shortLabel: "Monitor",
      category: "Gaming Monitors",
      title: "180Hz IPS & 2K QD-OLED Panels",
      subtitle: "Find zero-dead-pixel gaming monitors at the lowest BD price",
      price: "৳12,500",
      store: "Lowest @ Star Tech",
      discount: "-9% Deal",
      rating: "4.8",
      accentText: "text-[#a91e2c]",
      accentBorder: "border-l-[#a91e2c]",
      glowBg: "bg-[#a91e2c]/10",
      progressBg: "bg-[#a91e2c]",
      image: "/categories/monitor.jpg",
      searchQuery: "Monitors",
    },
    {
      shortLabel: "CPU",
      category: "Processors / CPUs",
      title: "AMD Ryzen 7000 & Intel 14th Gen",
      subtitle: "Unlock multi-store processor savings for your custom rig",
      price: "৳9,200",
      store: "Lowest @ Star Tech",
      discount: "-12% Price Drop",
      rating: "4.9",
      accentText: "text-[#6d28d9]",
      accentBorder: "border-l-[#6d28d9]",
      glowBg: "bg-[#6d28d9]/10",
      progressBg: "bg-[#6d28d9]",
      image: "/categories/cpu.jpg",
      searchQuery: "Processors",
    },
    {
      shortLabel: "SSD",
      category: "SSDs & Storage",
      title: "PCIe Gen4 NVMe M.2 Drives",
      subtitle: "7,000 MB/s read speeds synced hourly across verified shops",
      price: "৳2,900",
      store: "Lowest @ Ryans Computers",
      discount: "-14% Hot Deal",
      rating: "4.9",
      accentText: "text-[#b45309]",
      accentBorder: "border-l-[#b45309]",
      glowBg: "bg-[#b45309]/10",
      progressBg: "bg-[#b45309]",
      image: "/categories/ssd.jpg",
      searchQuery: "SSD",
    },
    {
      shortLabel: "Laptop",
      category: "Laptops & Ultrabooks",
      title: "MacBook Air, ROG & Legion",
      subtitle: "Compare official warranty laptop prices across 64 districts",
      price: "৳42,000",
      store: "Lowest @ Star Tech",
      discount: "-8% Ultrabook",
      rating: "4.9",
      accentText: "text-[#4f46e5]",
      accentBorder: "border-l-[#4f46e5]",
      glowBg: "bg-[#4f46e5]/10",
      progressBg: "bg-[#4f46e5]",
      image: "/categories/laptop.jpg",
      searchQuery: "Laptop",
    },
    {
      shortLabel: "Mobo",
      category: "Motherboards",
      title: "AM5 B650 & Intel Z790 Boards",
      subtitle: "Verified socket & DDR5 compatibility checked automatically",
      price: "৳6,500",
      store: "Lowest @ Star Tech",
      discount: "Top Seller",
      rating: "4.7",
      accentText: "text-[#18634b]",
      accentBorder: "border-l-[#18634b]",
      glowBg: "bg-[#18634b]/10",
      progressBg: "bg-[#18634b]",
      image: "/categories/motherboard.jpg",
      searchQuery: "Motherboards",
    },
    {
      shortLabel: "Case",
      category: "Power & Cases",
      title: "80+ Gold PSUs & Airflow Cases",
      subtitle: "Keep your build cool with verified modular power supplies",
      price: "৳3,800",
      store: "Lowest @ Star Tech",
      discount: "-15% Airflow",
      rating: "4.7",
      accentText: "text-[#0d9488]",
      accentBorder: "border-l-[#0d9488]",
      glowBg: "bg-[#0d9488]/10",
      progressBg: "bg-[#0d9488]",
      image: "/categories/psu-case.jpg",
      searchQuery: "Power Supply",
    },
  ];

  const activeShowcase = heroShowcaseSlides[heroSlide];

  useEffect(() => {
    if (isMonitorPaused) return;
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroShowcaseSlides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isMonitorPaused, heroShowcaseSlides.length]);

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

  const categories = [
    {
      name: "Graphics Cards",
      q: "Graphics Cards",
      desc: "NVIDIA RTX 40-Series & AMD RX 7000",
      count: "1,420+",
      tags: ["RTX 4060", "GDDR6", "GPU"],
      accentText: "text-[#2d4cc8]",
      accentHover: "group-hover:text-[#2d4cc8]",
      starting: "৳11,500",
      image: "/categories/gpu.jpg"
    },
    {
      name: "Processors / CPUs",
      q: "Processors",
      desc: "Intel 13th/14th Gen & AMD Zen 4/5",
      count: "650+",
      tags: ["AM5", "LGA1700", "CPU"],
      accentText: "text-[#6d28d9]",
      accentHover: "group-hover:text-[#6d28d9]",
      starting: "৳9,200",
      image: "/categories/cpu.jpg"
    },
    {
      name: "Motherboards",
      q: "Motherboards",
      desc: "B650, Z790, B760, and AM5 Platforms",
      count: "1,350+",
      tags: ["B650", "DDR5", "ATX"],
      accentText: "text-[#18634b]",
      accentHover: "group-hover:text-[#18634b]",
      starting: "৳7,800",
      image: "/categories/motherboard.jpg"
    },
    {
      name: "RAM & Memory",
      q: "RAM",
      desc: "DDR5 6000MHz & High-speed DDR4",
      count: "980+",
      tags: ["DDR5", "RGB", "XMP"],
      accentText: "text-[#0891b2]",
      accentHover: "group-hover:text-[#0891b2]",
      starting: "৳2,400",
      image: "/categories/ram.jpg"
    },
    {
      name: "SSDs & Storage",
      q: "SSD",
      desc: "PCIe Gen 4 NVMe & SATA Solid State",
      count: "1,590+",
      tags: ["NVMe", "Gen4", "1TB"],
      accentText: "text-[#b45309]",
      accentHover: "group-hover:text-[#b45309]",
      starting: "৳2,900",
      image: "/categories/ssd.jpg"
    },
    {
      name: "Gaming Monitors",
      q: "Monitors",
      desc: "144Hz to 240Hz, IPS & QD-OLED Panels",
      count: "720+",
      tags: ["180Hz", "IPS", "2K"],
      accentText: "text-[#a91e2c]",
      accentHover: "group-hover:text-[#a91e2c]",
      starting: "৳12,500",
      image: "/categories/monitor.jpg"
    },
    {
      name: "Laptops & Ultrabooks",
      q: "Laptop",
      desc: "MacBooks, ROG, Legion & Thin Notebooks",
      count: "1,280+",
      tags: ["MacBook", "Gaming", "M4"],
      accentText: "text-[#4f46e5]",
      accentHover: "group-hover:text-[#4f46e5]",
      starting: "৳42,000",
      image: "/categories/laptop.jpg"
    },
    {
      name: "Power Supplies & Cases",
      q: "Power Supply",
      desc: "80 Plus Gold PSUs, Airflow ATX Towers",
      count: "890+",
      tags: ["80+ Gold", "ATX", "ARGB"],
      accentText: "text-[#0d9488]",
      accentHover: "group-hover:text-[#0d9488]",
      starting: "৳3,800",
      image: "/categories/psu-case.jpg"
    }
  ];

  const featuredDeals = [
    {
      id: "rtx4060",
      category: "GPUs",
      tag: "GRAPHICS CARD • 8GB GDDR6",
      badge: "⭐ BEST DEAL (96/100)",
      badgeText: "text-[#18634b]",
      rating: "4.9",
      name: "Gigabyte GeForce RTX 4060 WINDFORCE OC 8GB",
      specs: "Boost Clock: 2475 MHz • Dual Fan • PCIe 4.0",
      wasPrice: 41500,
      saveAmount: 4600,
      savePercent: "11%",
      lowestStore: "PCB Store BD",
      lowestPrice: 36900,
      image: "/categories/gpu.jpg",
      trendPoints: "5,30 25,28 45,26 65,22 85,25 105,18 125,15 145,12 165,8 185,10 205,6 225,5",
      sparkColor: "#059669",
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
      badgeText: "text-[#a91e2c]",
      rating: "4.8",
      name: "AMD Ryzen 5 7600X AM5 Processor",
      specs: "4.7GHz Base, 5.3GHz Boost • 32MB Cache • 105W TDP",
      wasPrice: 26500,
      saveAmount: 3100,
      savePercent: "12%",
      lowestStore: "Star Tech",
      lowestPrice: 23400,
      image: "https://www.startech.com.bd/image/cache/catalog/processor/amd/ryzen-5-7600x/ryzen-5-7600x-01-228x228.webp",
      trendPoints: "5,28 25,27 45,25 65,26 85,20 105,19 125,14 145,16 165,11 185,9 205,7 225,6",
      sparkColor: "#2d4cc8",
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
      badgeText: "text-[#2d4cc8]",
      rating: "4.7",
      name: "ASRock A520M-HVS AMD AM4 Micro ATX Motherboard",
      specs: "AM4 Socket • 2x DDR4 4733+ (OC) • Ultra M.2 • Gigabit LAN",
      wasPrice: 7200,
      saveAmount: 700,
      savePercent: "10%",
      lowestStore: "Star Tech",
      lowestPrice: 6500,
      image: "https://www.startech.com.bd/image/cache/catalog/motherboard/asrock/a520m-hvs/a520m-hvs-01-228x228.webp",
      trendPoints: "5,28 25,27 45,25 65,22 85,20 105,18 125,16 145,14 165,12 185,10 205,8 225,6",
      sparkColor: "#6d28d9",
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
      badgeText: "text-[#0891b2]",
      rating: "4.7",
      name: "Netac Basic 8GB DDR4 2666MHz Desktop RAM",
      specs: "8GB Capacity • DDR4 2666MHz • 1.2V Low Voltage • UDIMM",
      wasPrice: 4500,
      saveAmount: 600,
      savePercent: "13%",
      lowestStore: "PCB Store BD",
      lowestPrice: 3900,
      image: "https://www.startech.com.bd/image/cache/catalog/ram/netac/basic-4gb-ddr4-2666mhz/basic-4gb-ddr4-2666mhz-01-228x228.webp",
      trendPoints: "5,30 25,28 45,26 65,24 85,22 105,19 125,17 145,15 165,13 185,10 205,8 225,7",
      sparkColor: "#0891b2",
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
      badgeText: "text-[#b45309]",
      rating: "4.9",
      name: "Samsung 980 Pro 1TB NVMe SSD",
      specs: "7,000 MB/s Read • 5,000 MB/s Write • V-NAND 3-bit MLC",
      wasPrice: 12500,
      saveAmount: 1700,
      savePercent: "14%",
      lowestStore: "Ryans Computers",
      lowestPrice: 10800,
      image: "/categories/ssd.jpg",
      trendPoints: "5,25 25,26 45,22 65,21 85,23 105,18 125,16 145,15 165,12 185,10 205,8 225,6",
      sparkColor: "#d97706",
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
      badgeText: "text-[#4f46e5]",
      rating: "4.9",
      name: "Apple MacBook Air 13-inch Liquid Retina Display",
      specs: "Apple Silicon • 8-Core CPU • Liquid Retina • MagSafe 3",
      wasPrice: 175000,
      saveAmount: 13500,
      savePercent: "8%",
      lowestStore: "Star Tech",
      lowestPrice: 161500,
      image: "https://www.startech.com.bd/image/cache/catalog/laptop/apple/macbook-air-13-m4/sky-blue/macbook-air-13-m4-sky-blue-01-228x228.webp",
      trendPoints: "5,32 25,30 45,28 65,25 85,22 105,20 125,17 145,15 165,13 185,11 205,9 225,8",
      sparkColor: "#4f46e5",
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
      badgeText: "text-[#6d28d9]",
      rating: "4.8",
      name: "MSI MAG 274QRF QD E2 2K WQHD Gaming Monitor",
      specs: "2560 x 1440 • 0.5ms (GtG) • Quantum Dot • HDR 400",
      wasPrice: 38000,
      saveAmount: 3500,
      savePercent: "9%",
      lowestStore: "Star Tech",
      lowestPrice: 34500,
      image: "https://www.startech.com.bd/image/cache/catalog/monitor/msi/mag-274qrf-qd-e2/mag-274qrf-qd-e2-01-500x500.webp",
      trendPoints: "5,30 25,29 45,28 65,24 85,22 105,20 125,17 145,14 165,12 185,11 205,8 225,7",
      sparkColor: "#7c3aed",
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
      badgeText: "text-[#a91e2c]",
      rating: "4.7",
      name: "T-Wolf Spector ARGB Curved ATX Gaming Casing with Display",
      specs: "Integrated LCD Display • Curved Glass • 4x ARGB Fans",
      wasPrice: 8500,
      saveAmount: 1300,
      savePercent: "15%",
      lowestStore: "Star Tech",
      lowestPrice: 7200,
      image: "https://www.startech.com.bd/image/cache/catalog/casing/t-wolf/spector/spector-white-01-228x228.webp",
      trendPoints: "5,29 25,27 45,25 65,23 85,21 105,18 125,16 145,14 165,12 185,10 205,8 225,7",
      sparkColor: "#e11d48",
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
    <div className="min-h-screen text-[#31344b]">

      {/* =========================================================================
          HERO SECTION: SYNCHRONIZED WHITE/NEUMORPHISM KINETIC SHOWCASE BANNER
         ========================================================================= */}
      <section
        className="border-b border-[#d1d9e6]/70 py-6 sm:py-10 md:py-14 px-3.5 sm:px-4 md:px-8 overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">

          {/* LEFT COLUMN: Synchronized Pop-Up Typography + Neumorphic Search */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 min-w-0">

            <div className="neu-pill inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold text-[#18634b] max-w-full">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shrink-0"></span>
              <span className="truncate">14,000+ Hardware Listings • Live BD Prices</span>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <TypingHeadline />

              {/* Synchronized Kinetic Pop-Up Headline (Ordered with right-side slide!) */}
              <div className="min-h-[104px] sm:min-h-[76px] flex items-center">
                <div
                  key={`hero-text-${heroSlide}`}
                  className="animate-neu-pop w-full"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <span className="text-base sm:text-2xl font-extrabold text-[#44476a]">
                      Best BD Deals on
                    </span>
                    <span className={`neu-card-sm px-3 sm:px-4 py-1 rounded-2xl text-base sm:text-2xl font-black ${activeShowcase.accentText} border-l-4 ${activeShowcase.accentBorder}`}>
                      {activeShowcase.category}
                    </span>
                    <span className="neu-pill-inset px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-black text-[#18634b]">
                      From {activeShowcase.price}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#44476a] font-semibold mt-2 leading-relaxed">
                    {activeShowcase.subtitle} — comparing{" "}
                    <strong className="text-[#a91e2c]">Star Tech</strong>,{" "}
                    <strong className="text-[#b45309]">Ryans Computers</strong> &{" "}
                    <strong className="text-[#2d4cc8]">PCB Store</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Neumorphic Elevated Search Shell */}
            <div className="relative max-w-3xl w-full">
              <form
                onSubmit={handleSearch}
                className="neu-card rounded-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <div className="neu-inset flex-1 flex items-center rounded-xl px-3 sm:px-3.5 py-1 min-w-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#2d4cc8] mr-2 sm:mr-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowInstantMatches(e.target.value.length > 1);
                    }}
                    onFocus={() => setShowInstantMatches(searchQuery.length > 1)}
                    placeholder="Search RTX 4060, Ryzen 5 7600X, RAM..."
                    className="w-full py-2 sm:py-2.5 bg-transparent outline-none text-[#31344b] font-bold text-xs sm:text-sm md:text-base placeholder-[#66799e] min-w-0"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/search?q=Graphics%20Cards")}
                  className="neu-btn hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-[#44476a] hover:text-[#2d4cc8] px-3.5 py-3 rounded-xl cursor-pointer shrink-0"
                >
                  <span>⚙️</span> Filters
                </button>

                <button
                  type="submit"
                  className="neu-btn-primary px-5 md:px-7 py-2.5 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>Compare Prices</span>
                  <span>→</span>
                </button>
              </form>

              {/* Instant Matches Neumorphic Dropdown */}
              {showInstantMatches && (
                <div className="neu-card absolute top-full left-0 right-0 mt-3 rounded-2xl text-left p-4 z-50">
                  <div className="flex justify-between items-center pb-2.5 mb-3 border-b border-[#d1d9e6] text-[11px] font-extrabold text-[#66799e] uppercase tracking-wider">
                    <span>Instant Matches Across 3 Verified Retailers</span>
                    <span className="text-[#18634b] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10b981]"></span> 100% Stock Matched
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div
                      onClick={() => router.push("/search?q=RTX%204060")}
                      className="neu-btn p-3 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="neu-inset w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center p-1">
                          <img
                            src="/categories/gpu.jpg"
                            alt="GPU"
                            className="w-full h-full object-contain mix-blend-multiply rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[#31344b]">ZOTAC Gaming GeForce RTX 4060 8GB GDDR6 Twin Edge</p>
                          <p className="text-[10px] text-[#66799e] font-semibold">Graphics Cards • 3 Retailers Indexed • 8GB GDDR6</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="neu-pill-inset text-[10px] font-extrabold text-[#18634b] px-2.5 py-0.5 rounded-full">Lowest @ PCB Store</span>
                        <p className="text-sm font-black text-[#a91e2c] mt-1">৳36,900</p>
                      </div>
                    </div>

                    <div
                      onClick={() => router.push("/search?q=Ryzen%205%207600X")}
                      className="neu-btn p-3 rounded-xl flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="neu-inset w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center p-1">
                          <img
                            src="/categories/cpu.jpg"
                            alt="CPU"
                            className="w-full h-full object-contain mix-blend-multiply rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[#31344b]">AMD Ryzen 5 7600X AM5 6-Core 12-Thread Processor</p>
                          <p className="text-[10px] text-[#66799e] font-semibold">Processors • 4.7GHz Base / 5.3GHz Boost • 32MB Cache</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="neu-pill-inset text-[10px] font-extrabold text-[#18634b] px-2.5 py-0.5 rounded-full">Lowest @ Star Tech</span>
                        <p className="text-sm font-black text-[#a91e2c] mt-1">৳23,400</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#d1d9e6] flex justify-between items-center text-[11px] text-[#66799e] font-semibold">
                    <span>INDEX PARITY: Refreshed Every 2 Hours</span>
                    <button
                      onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                      className="text-[#2d4cc8] font-extrabold hover:underline cursor-pointer"
                    >
                      View All Live Results →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Trending in BD Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
              <span className="text-[#44476a] font-black mr-1">Trending in BD:</span>
              {[
                { tag: "RTX 4060", color: "text-[#2d4cc8]" },
                { tag: "GTX 1650 Super", color: "text-[#6d28d9]" },
                { tag: "Ryzen 5 5600G", color: "text-[#a91e2c]" },
                { tag: "144Hz Gaming Monitor", color: "text-[#18634b]" },
                { tag: "1TB Gen4 NVMe", color: "text-[#b45309]" },
                { tag: "B650 Motherboard", color: "text-[#0891b2]" },
              ].map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => handleTrendingClick(item.tag)}
                  className={`neu-btn px-3 py-1.5 ${item.color} rounded-xl font-extrabold cursor-pointer`}
                >
                  {item.tag}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Neumorphic Monitor (Playing Website Video) + Keyboard & Mouse */}
          <div className="lg:col-span-5">
            <NeumorphicDeskMonitor
              slides={heroShowcaseSlides}
              activeSlideIndex={heroSlide}
              onSelectSlide={setHeroSlide}
              isPaused={isMonitorPaused}
              onTogglePause={() => setIsMonitorPaused((prev) => !prev)}
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          VERIFIED RETAILER SYNCHRONIZATION STATUS BAR
         ========================================================================= */}
      <section className="border-b border-[#d1d9e6]/70 py-8 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-5 text-xs">
            <div className="flex items-center gap-2 font-extrabold text-[#31344b] mb-2 sm:mb-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
              <span>Verified Retailer Synchronization</span>
              <span className="text-[#66799e] font-semibold hidden md:inline">(Real-time scrapers & direct catalog index)</span>
            </div>
            <span className="neu-pill text-[#18634b] font-extrabold px-3 py-1 rounded-full text-[11px]">
              ● 3 Stores Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="neu-card-hover rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="neu-inset w-11 h-11 rounded-xl flex items-center justify-center font-black text-[#a91e2c] text-xs">
                  ST
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#a91e2c]">Star Tech</h4>
                  <p className="text-[11px] text-[#44476a] font-semibold">5,849 Active SKUs</p>
                </div>
              </div>
              <span className="neu-pill-inset text-[11px] font-extrabold text-[#18634b] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> 14m ago
              </span>
            </div>

            <div className="neu-card-hover rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="neu-inset w-11 h-11 rounded-xl flex items-center justify-center font-black text-[#b45309] text-xs">
                  RC
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#b45309]">Ryans Computers</h4>
                  <p className="text-[11px] text-[#44476a] font-semibold">5,410 Active SKUs</p>
                </div>
              </div>
              <span className="neu-pill-inset text-[11px] font-extrabold text-[#18634b] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> 11m ago
              </span>
            </div>

            <div className="neu-card-hover rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="neu-inset w-11 h-11 rounded-xl flex items-center justify-center font-black text-[#2d4cc8] text-xs">
                  PCB
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#2d4cc8]">PCB Store BD</h4>
                  <p className="text-[11px] text-[#44476a] font-semibold">1,920 Active SKUs</p>
                </div>
              </div>
              <span className="neu-pill-inset text-[11px] font-extrabold text-[#18634b] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> 8m ago
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          EXPLORE BY HARDWARE CATEGORY (Screenshot 1 Card Pattern)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-9 gap-4">
          <div>
            <div className="neu-pill inline-flex items-center gap-1.5 text-[#2d4cc8] font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-2.5">
              <span>📁</span> Browse by Component
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-[#31344b] tracking-tight">
              Explore by <span className="text-[#2d4cc8]">Hardware Category</span>
            </h2>
            <p className="text-xs md:text-sm text-[#44476a] mt-1 font-medium">
              Catalog prices aggregated from official multi-store inventory. Select a category to isolate lowest historical dips.
            </p>
          </div>
          <button
            onClick={() => router.push("/search?q=Graphics%20Cards")}
            className="neu-btn text-xs md:text-sm font-extrabold text-[#2d4cc8] px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All 24 Subcategories</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => router.push(`/search?q=${encodeURIComponent(cat.q)}`)}
              className="neu-card-hover rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              {/* Clean Image Header (Screenshot 1 & 2 pattern) */}
              <div className="p-5 pb-4 flex items-center justify-center h-44 bg-[#e6e7ee]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="max-h-36 w-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply rounded-xl"
                />
              </div>

              {/* Card Footer separated by subtle border-top border-[#d1d9e6] */}
              <div className="border-t border-[#d1d9e6] p-5 flex-1 flex flex-col justify-between bg-[#e6e7ee]">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className={`text-base font-extrabold text-[#31344b] ${cat.accentHover} transition`}>
                      {cat.name}
                    </h3>
                    <span className={`neu-pill-inset text-[10px] font-black ${cat.accentText} px-2.5 py-0.5 rounded-full shrink-0`}>
                      {cat.count}
                    </span>
                  </div>

                  {/* Raised Mini Tag Pills (Screenshot 1 style) */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cat.tags.map((t) => (
                      <span
                        key={t}
                        className={`neu-pill text-[10px] font-bold ${cat.accentText} px-2.5 py-0.5 rounded-full`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#44476a] mb-4 leading-relaxed line-clamp-2 font-medium">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-[#d1d9e6]">
                  <div>
                    <span className="text-[10px] text-[#66799e] font-bold block uppercase tracking-wider">Starting from</span>
                    <span className={`font-black text-base ${cat.accentText}`}>
                      {cat.starting}
                    </span>
                  </div>
                  <span className={`neu-btn px-3 py-1.5 rounded-xl text-xs font-extrabold ${cat.accentText} flex items-center gap-1`}>
                    <span>Browse</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          ALGORITHMIC BEST DEALS OF THE DAY (Screenshot 2 Card Pattern + Colors)
         ========================================================================= */}
      <section className="border-y border-[#d1d9e6]/70 py-16 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-9 gap-4">
            <div>
              <div className="neu-pill inline-flex items-center gap-2 text-[#18634b] font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                <span>Live Algorithmic Detection</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-[#31344b] tracking-tight">
                Today&apos;s Biggest <span className="text-[#a91e2c]">Price Drops</span> & <span className="text-[#18634b]">Best Deals</span>
              </h2>
              <p className="text-xs md:text-sm text-[#44476a] mt-1 font-medium">
                Products with the widest price differential among Star Tech, Ryans, and PCB Store right now.
              </p>
            </div>

            {/* Recessed Neumorphic Filter Pill Tray (Horizontal Scroll on Mobile) */}
            <div className="neu-inset flex items-center gap-1.5 p-1.5 rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-none sm:flex-wrap max-w-full w-full md:w-auto">
              {["All Deals", "GPUs", "CPUs", "Motherboards", "RAM", "Storage", "Laptops", "Monitors", "Power & Cases"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDealFilter(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shrink-0 ${
                    activeDealFilter === tab
                      ? "neu-btn-primary"
                      : "text-[#44476a] hover:text-[#2d4cc8]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Deals 4-Card Grid (Screenshot 2 Structure) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDeals.map((deal) => (
              <div
                key={deal.id}
                className="neu-card-hover rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Badges + Image */}
                  <div className="p-4 pb-0 flex items-center justify-between gap-2">
                    <span className={`neu-pill text-[10px] font-black px-2.5 py-1 rounded-full ${deal.badgeText}`}>
                      {deal.badge}
                    </span>
                    <span className="text-[10px] font-extrabold text-[#18634b] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> In Stock
                    </span>
                  </div>

                  <div className="p-5 h-44 flex items-center justify-center">
                    <img src={deal.image} alt={deal.name} className="max-h-36 object-contain mix-blend-multiply" />
                  </div>

                  {/* Card Body separated by border-top border-[#d1d9e6] */}
                  <div className="border-t border-[#d1d9e6] p-5">
                    <p className="text-[10px] font-extrabold text-[#6d28d9] tracking-wider uppercase mb-1">
                      {deal.tag}
                    </p>
                    <h3
                      onClick={() => router.push(`/search?q=${encodeURIComponent(deal.name)}`)}
                      className="text-sm font-extrabold text-[#31344b] leading-snug hover:text-[#2d4cc8] transition cursor-pointer mb-1 line-clamp-2"
                    >
                      {deal.name}
                    </h3>
                    <p className="text-[11px] text-[#44476a] font-medium mb-1">{deal.specs}</p>

                    {/* Golden Star Rating + Neumorphic Rating Badge (Screenshot 2) */}
                    <StarRating rating={deal.rating} />

                    {/* 30-Day Trend Sparkline SVG inside Recessed Inset Container */}
                    <div className="neu-inset p-2.5 rounded-xl my-4">
                      <div className="flex justify-between items-center text-[10px] text-[#44476a] font-semibold mb-1">
                        <span>30-Day Price Trend</span>
                        <span className="font-extrabold text-[#18634b]">Save {deal.savePercent}</span>
                      </div>
                      <svg viewBox="0 0 230 35" className="w-full h-7 fill-none stroke-2" style={{ stroke: deal.sparkColor }}>
                        <polyline points={deal.trendPoints} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Store Price Quotes List (Screenshot 6/8 clean bordered list) */}
                    <div className="border border-[#d1d9e6] rounded-xl overflow-hidden divide-y divide-[#d1d9e6] text-xs">
                      {deal.stores.map((st, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-3 py-2 ${
                            st.isLowest ? "bg-[#10b981]/10 text-[#18634b] font-extrabold" : "text-[#44476a] font-semibold"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${st.isLowest ? "bg-[#10b981]" : "bg-[#93a0b8]"}`}></span>
                            <span>{st.name}</span>
                          </span>
                          <span className={st.isLowest ? "text-[#18634b] font-black" : "text-[#31344b] font-bold"}>
                            ৳{st.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Strikethrough + Crimson Sale Price + Cart/View Button (Screenshot 2) */}
                <div className="border-t border-[#d1d9e6] p-4 flex items-center justify-between gap-2 bg-[#e6e7ee]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#66799e] line-through font-semibold">
                        ৳{deal.wasPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-[#18634b]">
                        -৳{deal.saveAmount.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-lg font-black text-[#a91e2c]">
                      ৳{deal.lowestPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/search?q=${encodeURIComponent(deal.name)}`)}
                      title="Compare Specs"
                      className="neu-btn text-[#2d4cc8] text-xs font-extrabold px-3 py-2 rounded-xl cursor-pointer"
                    >
                      Specs
                    </button>
                    <button
                      onClick={() => router.push(`/search?q=${encodeURIComponent(deal.name)}`)}
                      className="neu-btn-primary text-xs font-extrabold px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <span>Deal</span>
                      <span>↗</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Banner */}
          <div className="neu-card mt-10 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="neu-inset w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0">
                🔍
              </div>
              <div>
                <p className="text-sm font-black text-[#2d4cc8]">Scanning 248 hardware retailers hourly</p>
                <p className="text-xs text-[#44476a] font-medium">Star Tech, Ryans, and PCB Store prices are verified via API & branch scrapers.</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/search?q=Graphics%20Cards")}
              className="neu-btn-primary text-xs font-extrabold px-5 py-3 rounded-xl whitespace-nowrap cursor-pointer"
            >
              Explore All 200+ Active Deals →
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          HOW SMARTPRICE BD SAVES MONEY (Double-Bevel Summary Pattern - Screenshot 8/9)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16" id="pc-builder">
        <div className="neu-card rounded-3xl p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <div className="lg:col-span-5 space-y-4">
            <span className="neu-pill inline-block text-[11px] font-extrabold text-[#6d28d9] uppercase tracking-wider px-3.5 py-1 rounded-full">
              📊 Real-World Savings Analytics
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#31344b] tracking-tight">
              How SmartPrice BD <span className="text-[#2d4cc8]">Saves Money</span> on Entire PC Builds
            </h2>
            <p className="text-xs md:text-sm text-[#44476a] leading-relaxed font-medium">
              No single retailer in Bangladesh has the lowest price across every component. Buying your processor from Store A, graphics card from Store B, and SSD from Store C routinely saves{" "}
              <strong className="text-[#18634b] font-black">৳5,000 to ৳8,500</strong> off a typical mid-to-high-end build.
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/pc-builder")}
                className="neu-btn-purple text-xs font-extrabold px-6 py-3.5 rounded-xl cursor-pointer inline-flex items-center gap-2"
              >
                <span>Launch AI PC Builder</span>
                <span>✨</span>
              </button>
            </div>
          </div>

          {/* Double-Frame Beveled Neumorphic Card (Screenshots 6 & 8 & 9) */}
          <div className="lg:col-span-7 neu-inset p-3 rounded-3xl">
            <div className="neu-card-sm rounded-2xl p-5 md:p-6">
              <div className="flex flex-wrap justify-between items-center mb-4 pb-3 border-b border-[#d1d9e6] gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">📋</span>
                  <span className="text-sm font-black text-[#31344b]">Case Study: 1080p Esports Rig (৳85K Tier)</span>
                </div>
                <span className="neu-pill text-xs font-black text-[#18634b] px-3 py-1 rounded-full">
                  Total Saved: ৳4,250
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="neu-card-sm rounded-xl p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-[#31344b]">Ryzen 5 7600X CPU</p>
                    <p className="text-[11px] text-[#a91e2c] font-bold">Official Star Tech Outlet</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#66799e] line-through text-[11px] mr-2">৳26,500</span>
                    <span className="font-black text-[#2d4cc8] text-sm">৳24,800</span>
                    <span className="block text-[10px] font-extrabold text-[#18634b]">Save ৳1,700 @ Star Tech</span>
                  </div>
                </div>

                <div className="neu-card-sm rounded-xl p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-[#31344b]">ZOTAC RTX 4060 8GB GPU</p>
                    <p className="text-[11px] text-[#2d4cc8] font-bold">Official PCB Store Outlet</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#66799e] line-through text-[11px] mr-2">৳39,500</span>
                    <span className="font-black text-[#2d4cc8] text-sm">৳36,800</span>
                    <span className="block text-[10px] font-extrabold text-[#18634b]">Save ৳2,700 @ PCB Store</span>
                  </div>
                </div>

                <div className="neu-card-sm rounded-xl p-3.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-extrabold text-[#31344b]">Kingston KC3000 1TB NVMe</p>
                    <p className="text-[11px] text-[#b45309] font-bold">Official Ryans Outlet</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#66799e] line-through text-[11px] mr-2">৳12,400</span>
                    <span className="font-black text-[#2d4cc8] text-sm">৳11,850</span>
                    <span className="block text-[10px] font-extrabold text-[#18634b]">Save ৳550 @ Ryans</span>
                  </div>
                </div>
              </div>

              {/* Screenshot 8 Subtotal / Total List Group */}
              <div className="border border-[#d1d9e6] rounded-xl overflow-hidden divide-y divide-[#d1d9e6] text-xs">
                <div className="flex justify-between items-center px-4 py-2.5 text-[#44476a] font-semibold">
                  <span>Single-Vendor Cost</span>
                  <span className="line-through font-bold">৳78,400</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 font-black text-sm text-[#31344b]">
                  <span>SmartPrice BD Multi-Vendor Total</span>
                  <span className="text-[#18634b] text-base">৳74,150</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          HOW SMARTPRICE BD WORKS (3 Steps)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16 border-t border-[#d1d9e6]">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="neu-pill inline-block text-[11px] font-extrabold text-[#2d4cc8] uppercase tracking-wider px-3.5 py-1 rounded-full">
            Simple & Transparent
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#31344b] mt-3">
            How <span className="text-[#2d4cc8]">SmartPrice BD</span> Works
          </h2>
          <p className="text-xs md:text-sm text-[#44476a] mt-1 font-medium">
            Save thousands of Takas in 3 simple steps without opening twenty browser tabs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="neu-card-hover rounded-2xl p-6 relative">
            <span className="text-4xl font-black text-[#2d4cc8]/20 absolute top-4 right-5">01</span>
            <div className="neu-inset w-12 h-12 text-[#2d4cc8] rounded-xl flex items-center justify-center font-bold text-xl mb-4">
              🔍
            </div>
            <h3 className="text-base font-extrabold text-[#31344b] mb-2">Search or Build Rig</h3>
            <p className="text-xs text-[#44476a] leading-relaxed mb-4 font-medium">
              Input individual hardware parts or use our full AI PC Builder Matrix to configure processor, graphics, memory, and power modules.
            </p>
            <div className="text-[11px] font-extrabold text-[#2d4cc8] flex items-center gap-1">
              <span>✓ Instant SKU Matching</span>
            </div>
          </div>

          <div className="neu-card-hover rounded-2xl p-6 relative">
            <span className="text-4xl font-black text-[#18634b]/20 absolute top-4 right-5">02</span>
            <div className="neu-inset w-12 h-12 text-[#18634b] rounded-xl flex items-center justify-center font-bold text-xl mb-4">
              ⚖️
            </div>
            <h3 className="text-base font-extrabold text-[#31344b] mb-2">Compare Across BD</h3>
            <p className="text-xs text-[#44476a] leading-relaxed mb-4 font-medium">
              View live pricing matrices with real-time stock markers, past price history graphs, warranty periods, and store ratings.
            </p>
            <div className="text-[11px] font-extrabold text-[#18634b] flex items-center gap-1">
              <span>✓ Real-time In-Stock Verification</span>
            </div>
          </div>

          <div className="neu-card-hover rounded-2xl p-6 relative">
            <span className="text-4xl font-black text-[#6d28d9]/20 absolute top-4 right-5">03</span>
            <div className="neu-inset w-12 h-12 text-[#6d28d9] rounded-xl flex items-center justify-center font-bold text-xl mb-4">
              🛒
            </div>
            <h3 className="text-base font-extrabold text-[#31344b] mb-2">Buy Direct & Save</h3>
            <p className="text-xs text-[#44476a] leading-relaxed mb-4 font-medium">
              Click &apos;Deal&apos; to checkout directly on the retailer&apos;s official website or walk into their physical showroom. Zero markup.
            </p>
            <div className="text-[11px] font-extrabold text-[#6d28d9] flex items-center gap-1">
              <span>✓ 100% Free for Bangladeshi Buyers</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CERTIFIED TECH RETAILERS WE TRACK
         ========================================================================= */}
      <section className="border-y border-[#d1d9e6]/70 py-16 px-4 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="neu-pill inline-block text-[11px] font-extrabold text-[#18634b] uppercase tracking-wider px-3.5 py-1 rounded-full">
              Official Ecosystem Partners
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-[#31344b] mt-3">
              Certified Tech Retailers We <span className="text-[#18634b]">Track</span>
            </h2>
            <p className="text-xs md:text-sm text-[#44476a] mt-1 font-medium">
              We interface directly with the inventory feeds and public catalog of Bangladesh&apos;s premier computer component purveyors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="neu-card-hover rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="neu-inset w-12 h-12 rounded-xl flex items-center justify-center font-black text-[#a91e2c] text-sm">
                  ST
                </div>
                <span className="neu-pill text-[10px] font-extrabold text-[#18634b] px-2.5 py-1 rounded-full">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#a91e2c]">Star Tech & Engineering Ltd</h3>
              <p className="text-xs text-[#f0b400] font-bold mt-0.5 mb-2">★★★★★ <span className="text-[#44476a]">4.8 (10,400+ Ratings)</span></p>
              <p className="text-xs text-[#44476a] mb-4 leading-relaxed font-medium">
                Largest national tech distributor with branches in Dhaka, Chittagong, Rajshahi, Khulna, and Rangpur.
              </p>
              <div className="space-y-2 text-xs text-[#44476a] border-t border-[#d1d9e6] pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Indexed SKUs:</span>
                  <span className="font-extrabold text-[#31344b]">5,849 Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Update Interval:</span>
                  <span className="font-extrabold text-[#18634b]">Every 2 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Warranty Policy:</span>
                  <span className="font-extrabold text-[#31344b]">Official BD Brand Warranty</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/search?q=Star%20Tech")}
                className="neu-btn w-full text-[#a91e2c] text-xs font-extrabold py-2.5 rounded-xl cursor-pointer"
              >
                Browse Star Tech Inventory →
              </button>
            </div>

            <div className="neu-card-hover rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="neu-inset w-12 h-12 rounded-xl flex items-center justify-center font-black text-[#b45309] text-sm">
                  RC
                </div>
                <span className="neu-pill text-[10px] font-extrabold text-[#18634b] px-2.5 py-1 rounded-full">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#b45309]">Ryans Computers Ltd</h3>
              <p className="text-xs text-[#f0b400] font-bold mt-0.5 mb-2">★★★★★ <span className="text-[#44476a]">4.7 (8,900+ Ratings)</span></p>
              <p className="text-xs text-[#44476a] mb-4 leading-relaxed font-medium">
                Pioneering PC hardware chain with comprehensive physical showroom coverage across 64 districts.
              </p>
              <div className="space-y-2 text-xs text-[#44476a] border-t border-[#d1d9e6] pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Indexed SKUs:</span>
                  <span className="font-extrabold text-[#31344b]">5,410 Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Update Interval:</span>
                  <span className="font-extrabold text-[#18634b]">Every 2 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Warranty Policy:</span>
                  <span className="font-extrabold text-[#31344b]">Official Distributor Seal</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/search?q=Ryans")}
                className="neu-btn w-full text-[#b45309] text-xs font-extrabold py-2.5 rounded-xl cursor-pointer"
              >
                Browse Ryans Inventory →
              </button>
            </div>

            <div className="neu-card-hover rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="neu-inset w-12 h-12 rounded-xl flex items-center justify-center font-black text-[#2d4cc8] text-sm">
                  PCB
                </div>
                <span className="neu-pill text-[10px] font-extrabold text-[#18634b] px-2.5 py-1 rounded-full">
                  Verified Partner
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[#2d4cc8]">PCB Store / Techland Hub</h3>
              <p className="text-xs text-[#f0b400] font-bold mt-0.5 mb-2">★★★★★ <span className="text-[#44476a]">4.9 (5,400+ Ratings)</span></p>
              <p className="text-xs text-[#44476a] mb-4 leading-relaxed font-medium">
                Enthusiast destination renowned for competitive custom loop parts, graphics card drops, and specialty gear.
              </p>
              <div className="space-y-2 text-xs text-[#44476a] border-t border-[#d1d9e6] pt-3 mb-5">
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Indexed SKUs:</span>
                  <span className="font-extrabold text-[#31344b]">1,920 Items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Update Interval:</span>
                  <span className="font-extrabold text-[#18634b]">Every 1 Hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66799e] font-semibold">Warranty Policy:</span>
                  <span className="font-extrabold text-[#31344b]">Official Replacement Guarantee</span>
                </div>
              </div>
              <button
                onClick={() => router.push("/search?q=PCB%20Store")}
                className="neu-btn w-full text-[#2d4cc8] text-xs font-extrabold py-2.5 rounded-xl cursor-pointer"
              >
                Browse PCB Store Inventory →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          NEVER OVERPAY ON TECH COMPONENTS IN BD (Neumorphic Feature Panel)
         ========================================================================= */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-16" id="alerts">
        <div className="neu-card rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-7 space-y-4">
              <span className="neu-pill inline-block text-[10px] font-black text-[#2d4cc8] px-3.5 py-1 rounded-full uppercase tracking-wider">
                🛡️ Zero-Spam Hardware Radar
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#31344b]">
                Never Overpay on <span className="text-[#2d4cc8]">Tech Components</span> in BD.
              </h2>
              <p className="text-xs md:text-sm text-[#44476a] leading-relaxed max-w-xl font-medium">
                Set target alerts for your dream GPU or CPU. We&apos;ll ping your email or Telegram the moment{" "}
                <strong className="text-[#a91e2c]">Star Tech</strong>,{" "}
                <strong className="text-[#b45309]">Ryans</strong>, or{" "}
                <strong className="text-[#2d4cc8]">PCB Store</strong> drops the price below your threshold.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(`Alert tracking activated for ${emailAlert}!`);
                  setEmailAlert("");
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-lg pt-2"
              >
                <div className="neu-inset flex-1 rounded-xl px-4 py-2.5 flex items-center">
                  <input
                    type="email"
                    required
                    value={emailAlert}
                    onChange={(e) => setEmailAlert(e.target.value)}
                    placeholder="Enter your email for price drops..."
                    className="w-full bg-transparent text-[#31344b] placeholder-[#66799e] text-xs font-bold outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="neu-btn-emerald font-black px-6 py-3 rounded-xl text-xs whitespace-nowrap cursor-pointer"
                >
                  Start Tracking 🔔
                </button>
              </form>

              <p className="text-[11px] text-[#66799e] font-semibold">
                Transparency note: SmartPrice BD is 100% free. We respect your data and never share your contact details.
              </p>
            </div>

            <div className="lg:col-span-5 neu-inset p-3 rounded-3xl">
              <div className="neu-card-sm rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-extrabold text-[#31344b] flex items-center gap-1.5">
                    <span>🛠️</span> Interactive PC Builder
                  </span>
                  <span className="bg-gradient-to-r from-[#059669] to-[#0d9488] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                    NEW
                  </span>
                </div>
                <p className="text-xs text-[#44476a] mb-4 font-medium leading-relaxed">
                  Assemble your custom build. Our multi-store router automatically assigns each component to the specific retailer offering the lowest price in Bangladesh.
                </p>

                <div className="border border-[#d1d9e6] rounded-xl overflow-hidden divide-y divide-[#d1d9e6] text-xs mb-5">
                  <div className="flex justify-between px-3.5 py-2.5 text-[#44476a] font-semibold">
                    <span>Sample 1080p Budget Rig:</span>
                    <span className="font-black text-[#31344b]">৳85,200</span>
                  </div>
                  <div className="flex justify-between px-3.5 py-2.5 text-[#18634b] font-extrabold">
                    <span>Multi-Store Savings:</span>
                    <span>+৳4,250 saved</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/pc-builder")}
                  className="neu-btn-primary w-full font-extrabold py-3 rounded-xl text-xs cursor-pointer text-center"
                >
                  Launch PC Build Configurator →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
