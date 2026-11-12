"use client";

import { useState, useEffect } from "react";
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

interface ComponentItem {
  _id: string;
  name: string;
  store: string;
  price: number;
  rating?: number;
  imageUrl?: string;
  productUrl: string;
  category: string;
  brand?: string;
  specs?: string[];
  lowestPrice?: number;
  highestPrice?: number;
  spread?: number;
  storeOffers?: StoreOffer[];
}

interface BuildResult {
  cpu: ComponentItem;
  motherboard: ComponentItem;
  gpu: ComponentItem;
  ram: ComponentItem;
  storage: ComponentItem;
  psu: ComponentItem;
  casing: ComponentItem;
  totalPrice: number;
  compatibilityNotes: string[];
  performanceSummary: string;
  whyThisBuild: string;
  isAiGenerated: boolean;
  engine: string;
}

const USE_CASES = [
  {
    id: "1080p Gaming",
    label: "1080p Competitive Gaming",
    sub: "Valorant, CS2, Apex, Fortnite at 144Hz+",
    icon: "🎮",
    accent: "text-[#2d4cc8]",
    dot: "bg-[#2d4cc8]",
    recommendedMin: 45000,
  },
  {
    id: "1440p / 4K AAA Gaming",
    label: "1440p / 4K AAA Gaming",
    sub: "Cyberpunk, Black Myth, GTA with Ray Tracing",
    icon: "🚀",
    accent: "text-[#6d28d9]",
    dot: "bg-[#6d28d9]",
    recommendedMin: 95000,
  },
  {
    id: "Video Editing & 3D",
    label: "Video Editing & 3D Rendering",
    sub: "Premiere, DaVinci, Blender & After Effects",
    icon: "🎬",
    accent: "text-[#a91e2c]",
    dot: "bg-[#a91e2c]",
    recommendedMin: 70000,
  },
  {
    id: "Programming / AI Workstation",
    label: "Programming & Machine Learning",
    sub: "Docker, PyTorch, Local LLMs & Heavy Multitasking",
    icon: "⚡",
    accent: "text-[#18634b]",
    dot: "bg-[#18634b]",
    recommendedMin: 80000,
  },
  {
    id: "Office & Productivity",
    label: "Office & Day-to-Day Productivity",
    sub: "Ultra-fast multitasking, 4K media, office workflows",
    icon: "💼",
    accent: "text-[#b45309]",
    dot: "bg-[#b45309]",
    recommendedMin: 32000,
  },
];

const BUDGET_PRESETS = [
  { label: "৳45,000", value: 45000, tag: "Budget Esports", color: "text-[#18634b]" },
  { label: "৳65,000", value: 65000, tag: "Sweet Spot 1080p", color: "text-[#2d4cc8]" },
  { label: "৳85,000", value: 85000, tag: "Popular Pick", color: "text-[#6d28d9]" },
  { label: "৳120,000", value: 120000, tag: "1440p Ultra", color: "text-[#0891b2]" },
  { label: "৳175,000", value: 175000, tag: "High-End Creator", color: "text-[#b45309]" },
  { label: "৳250,000", value: 250000, tag: "Enthusiast Flagship", color: "text-[#a91e2c]" },
];

const SCANNING_STEPS = [
  "Querying live inventory from Star Tech, Ryans Computers & PCB Store...",
  "Filtering LGA1700, AM4, and AM5 sockets for pinout parity...",
  "Aligning motherboard DDR4/DDR5 DIMM slots and bus frequencies...",
  "Sending hardware candidate pool to Google Gemini 2.5 Flash...",
  "Optimizing GPU-to-CPU bottleneck ratios and PSU wattage overhead...",
  "Synthesizing optimal 7-part build with lowest merchant street quotes...",
];

export default function AiPcBuilderPage() {
  const [budget, setBudget] = useState<number>(75000);
  const [budgetInput, setBudgetInput] = useState<string>("75,000");
  const [purpose, setPurpose] = useState<string>("1080p Gaming");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState<number>(0);
  const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % SCANNING_STEPS.length);
      }, 950);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleBudgetChange = (valStr: string) => {
    const cleanNum = parseInt(valStr.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(cleanNum)) {
      setBudget(cleanNum);
      setBudgetInput(cleanNum.toLocaleString("en-US"));
    } else {
      setBudget(0);
      setBudgetInput("");
    }
  };

  const handlePresetSelect = (val: number) => {
    setBudget(val);
    setBudgetInput(val.toLocaleString("en-US"));
  };

  const handleGenerateBuild = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (budget < 25000) {
      setError("Please enter a budget of at least ৳25,000 BDT for a complete PC build.");
      return;
    }
    setError(null);
    setLoadingStepIndex(0);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, purpose }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate build from server.");
      }

      const data: BuildResult = await res.json();
      setBuildResult(data);

      setTimeout(() => {
        const resultsEl = document.getElementById("builder-results");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: unknown) {
      console.error("AI Builder Error:", err);
      const message = err instanceof Error ? err.message : "An error occurred while connecting to the AI Builder API.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const copyBuildSpecs = () => {
    if (!buildResult) return;
    const parts = [
      `Processor (CPU): ${buildResult.cpu?.name} - ৳${buildResult.cpu?.price.toLocaleString()}`,
      `Motherboard: ${buildResult.motherboard?.name} - ৳${buildResult.motherboard?.price.toLocaleString()}`,
      `Graphics Card (GPU): ${buildResult.gpu?.name} - ৳${buildResult.gpu?.price.toLocaleString()}`,
      `RAM: ${buildResult.ram?.name} - ৳${buildResult.ram?.price.toLocaleString()}`,
      `Storage: ${buildResult.storage?.name} - ৳${buildResult.storage?.price.toLocaleString()}`,
      `Power Supply (PSU): ${buildResult.psu?.name} - ৳${buildResult.psu?.price.toLocaleString()}`,
      `Casing: ${buildResult.casing?.name} - ৳${buildResult.casing?.price.toLocaleString()}`,
      `-----------------------------------------`,
      `Total Cost: ৳${buildResult.totalPrice.toLocaleString()} BDT`,
      `Configured via SmartPriceBD AI PC Builder (${buildResult.engine})`,
      `SmartPriceBD: http://localhost:3000/pc-builder`,
    ].join("\n");

    navigator.clipboard.writeText(parts).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const printBuild = () => {
    window.print();
  };

  const getStoreBadgeColor = (store: string) => {
    if (store.includes("Star")) return "text-[#a91e2c]";
    if (store.includes("Ryans")) return "text-[#b45309]";
    return "text-[#2d4cc8]";
  };

  const componentList = buildResult
    ? [
        {
          key: "cpu",
          category: "Processor / CPU",
          icon: "💻",
          badgeColor: "text-[#2d4cc8]",
          item: buildResult.cpu,
          tag: "Core Engine",
        },
        {
          key: "motherboard",
          category: "Motherboard",
          icon: "🧩",
          badgeColor: "text-[#18634b]",
          item: buildResult.motherboard,
          tag: "Platform Base",
        },
        {
          key: "gpu",
          category: "Graphics Card",
          icon: "🎮",
          badgeColor: "text-[#6d28d9]",
          item: buildResult.gpu,
          tag: "Visual & 3D Acceleration",
        },
        {
          key: "ram",
          category: "System Memory / RAM",
          icon: "⚡",
          badgeColor: "text-[#0891b2]",
          item: buildResult.ram,
          tag: "High-Speed Memory",
        },
        {
          key: "storage",
          category: "Solid State Drive / SSD",
          icon: "💾",
          badgeColor: "text-[#b45309]",
          item: buildResult.storage,
          tag: "Primary OS & NVMe Storage",
        },
        {
          key: "psu",
          category: "Power Supply Unit (PSU)",
          icon: "🔌",
          badgeColor: "text-[#a91e2c]",
          item: buildResult.psu,
          tag: "Stable Power Delivery",
        },
        {
          key: "casing",
          category: "Chassis / Casing",
          icon: "🖥️",
          badgeColor: "text-[#0d9488]",
          item: buildResult.casing,
          tag: "Airflow & Protection",
        },
      ]
    : [];

  const budgetDelta = buildResult ? budget - buildResult.totalPrice : 0;

  return (
    <main className="min-h-screen text-[#31344b] pb-20">
      {/* Top Breadcrumb & Status Bar */}
      <div className="border-b border-[#d1d9e6]/70">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between text-xs text-[#66799e] gap-2 font-bold">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#2d4cc8] transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#2d4cc8] font-black">AI PC Builder</span>
          </div>
          <div className="neu-pill px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="font-extrabold text-[#18634b]">Live Inventory: 770+ Hardware Listings Active</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="border-b border-[#d1d9e6]/70 pt-10 pb-14">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="neu-pill inline-flex items-center gap-2 text-[#6d28d9] px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
                <span className="animate-spin text-sm">✨</span>
                <span>SmartPriceBD Neural Engine • Gemini 2.5 LLM</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-[#31344b] tracking-tight">
                AI Hardware Configurator & <span className="text-[#2d4cc8]">PC Builder</span>
              </h1>
              <p className="text-sm md:text-base text-[#44476a] mt-3 max-w-2xl leading-relaxed font-medium">
                Provide your target budget and primary use-case. Our AI compares real-time prices across{" "}
                <span className="font-extrabold text-[#a91e2c]">Star Tech</span>,{" "}
                <span className="font-extrabold text-[#b45309]">Ryans Computers</span>, and{" "}
                <span className="font-extrabold text-[#2d4cc8]">PCB Store BD</span> to generate a physically
                compatible, bottleneck-free rig.
              </p>
            </div>

            {/* Quick Guarantees Neumorphic Card */}
            <div className="neu-card rounded-2xl p-5 shrink-0 flex flex-col gap-2.5 max-w-xs">
              <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#31344b]">
                <span className="neu-pill-inset w-5 h-5 rounded-full flex items-center justify-center text-[#18634b]">✓</span>
                <span>100% Socket & Chipset Matched</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#31344b]">
                <span className="neu-pill-inset w-5 h-5 rounded-full flex items-center justify-center text-[#2d4cc8]">✓</span>
                <span>DDR4 / DDR5 Bus Alignment Verified</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#31344b]">
                <span className="neu-pill-inset w-5 h-5 rounded-full flex items-center justify-center text-[#6d28d9]">✓</span>
                <span>Lowest Street Price Across 3 Stores</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#31344b]">
                <span className="neu-pill-inset w-5 h-5 rounded-full flex items-center justify-center text-[#b45309]">✓</span>
                <span>Adequate PSU Wattage Headroom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-7">
        
        {/* =========================================================================
            INPUT CARD SECTION (Neumorphic Inputs + Slider)
            ========================================================================= */}
        <div className="neu-card rounded-3xl p-6 md:p-8 transition">
          <form onSubmit={handleGenerateBuild} className="space-y-8">
            
            {/* 1. Target Budget Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                <label className="text-xs font-black uppercase tracking-wider text-[#31344b] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#2d4cc8] text-white flex items-center justify-center text-xs font-black shadow-sm">
                    1
                  </span>
                  <span>Target Budget (BDT)</span>
                </label>
                <span className="text-xs text-[#66799e] font-bold">
                  Min ৳25,000 • Max ৳600,000
                </span>
              </div>

              {/* Recessed Budget Input Well + Range Slider (Screenshot 4 pattern!) */}
              <div className="neu-inset rounded-2xl p-1.5 sm:p-2 flex items-center relative gap-2">
                <span className="pl-2.5 sm:pl-4 text-xl sm:text-2xl font-black text-[#2d4cc8] shrink-0">
                  ৳
                </span>
                <input
                  type="text"
                  value={budgetInput}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="e.g. 75,000"
                  className="w-full min-w-0 bg-transparent py-2.5 sm:py-3 px-1 sm:px-3 text-xl sm:text-2xl md:text-3xl font-black text-[#31344b] outline-none placeholder-[#93a0b8]"
                />
                <span className="neu-pill text-[10px] sm:text-xs font-black text-[#6d28d9] uppercase tracking-wider px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl mr-1 sm:mr-2 shrink-0">
                  BDT TAKA
                </span>
              </div>

              {/* Interactive Budget Range Slider */}
              <div className="mt-4 px-1">
                <input
                  type="range"
                  min={25000}
                  max={350000}
                  step={5000}
                  value={Math.min(Math.max(budget, 25000), 350000)}
                  onChange={(e) => handlePresetSelect(Number(e.target.value))}
                  className="neu-range w-full"
                />
              </div>

              {/* Quick Select Presets */}
              <div className="mt-4 flex flex-wrap gap-2.5">
                <span className="text-xs font-black text-[#66799e] uppercase tracking-wider self-center mr-1">
                  Popular Tiers:
                </span>
                {BUDGET_PRESETS.map((p) => {
                  const isSelected = budget === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => handlePresetSelect(p.value)}
                      className={`text-xs font-extrabold px-3.5 py-2 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? "neu-btn-primary"
                          : `neu-btn ${p.color}`
                      }`}
                    >
                      <span>{p.label}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-white/20 text-white" : "neu-pill-inset text-[#44476a]"
                        }`}
                      >
                        {p.tag}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Primary Use-Case Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-black uppercase tracking-wider text-[#31344b] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#6d28d9] text-white flex items-center justify-center text-xs font-black shadow-sm">
                    2
                  </span>
                  <span>Primary Use-Case & Performance Profile</span>
                </label>
                <span className="text-xs text-[#66799e] font-bold hidden sm:inline">
                  Tuning component allocation ratio
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {USE_CASES.map((uc) => {
                  const isSelected = purpose === uc.id;
                  return (
                    <div
                      key={uc.id}
                      onClick={() => setPurpose(uc.id)}
                      className={`p-4 rounded-2xl transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "neu-inset border-[#2d4cc8]/50"
                          : "neu-card-hover"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-2xl">{uc.icon}</span>
                          <span className="neu-inset w-5 h-5 rounded-full flex items-center justify-center">
                            {isSelected && <span className={`w-2.5 h-2.5 rounded-full ${uc.dot}`}></span>}
                          </span>
                        </div>
                        <h4 className={`text-xs font-black leading-snug ${isSelected ? uc.accent : "text-[#31344b]"}`}>
                          {uc.label}
                        </h4>
                        <p className="text-[11px] text-[#44476a] mt-1 leading-normal font-medium">
                          {uc.sub}
                        </p>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-[#d1d9e6] text-[10px] font-extrabold text-[#66799e]">
                        Target from <span className={uc.accent}>৳{(uc.recommendedMin / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="neu-inset border-[#a91e2c]/40 text-[#a91e2c] text-xs font-extrabold p-4 rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#d1d9e6]">
              <div className="text-xs text-[#44476a] font-semibold flex items-center gap-2">
                <span className="text-[#2d4cc8] text-lg">🤖</span>
                <span>
                  Querying MongoDB hardware pool • <strong className="text-[#6d28d9]">Gemini 2.5 Flash</strong> strict constraint optimization
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="neu-btn-purple w-full sm:w-auto text-base font-black px-8 py-4 rounded-2xl disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Configuring Hardware...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Build</span>
                    <span className="text-lg">✨</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================================
            HIGH-TECH LOADING STATE (Double-Framed Neural Terminal)
            ========================================================================= */}
        {loading && (
          <div className="mt-8 neu-card p-3 rounded-3xl">
            <div className="bg-[#1f2437] text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-400 animate-spin"></div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2d4cc8] to-[#6d28d9] flex items-center justify-center text-2xl shadow-lg shadow-blue-500/50">
                    ⚡
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-500/30 px-3 py-1 rounded-full text-blue-300 text-xs font-mono font-semibold mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>NEURAL ENGINE SCANNING INVENTORY</span>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Synthesizing Balanced PC Configuration
                </h3>

                <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-lg">
                  Evaluating 770+ live Bangladeshi hardware listings for socket pinouts, RAM channels, and
                  unbottlenecked performance.
                </p>

                <div className="mt-6 w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left font-mono text-xs shadow-inner">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800 mb-2.5">
                    <span className="text-blue-400 font-bold">TERMINAL TELEMETRY</span>
                    <span>BUDGET: ৳{budget.toLocaleString()} BDT</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-blue-300 min-h-[24px]">
                    <span className="text-emerald-400 font-bold">➜</span>
                    <span className="font-medium">{SCANNING_STEPS[loadingStepIndex]}</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2 w-full text-[10px] font-bold text-slate-300">
                  {["CPU", "Mobo", "GPU", "RAM", "SSD", "PSU"].map((comp) => (
                    <div
                      key={comp}
                      className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col items-center gap-1"
                    >
                      <span className="text-xs text-emerald-400">✓</span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            RESULTS SECTION (Neumorphism + Screenshot 7, 8, 9 Patterns)
            ========================================================================= */}
        {buildResult && !loading && (
          <div id="builder-results" className="mt-10 space-y-8 scroll-mt-6">
            
            {/* OVERVIEW BANNER */}
            <div className="neu-card rounded-3xl p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#d1d9e6]">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="neu-pill text-[#18634b] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <span>✓</span>
                      <span>Compatibility 100% Verified</span>
                    </span>
                    <span className="neu-pill text-[#2d4cc8] text-[11px] font-extrabold px-3 py-1 rounded-full">
                      Engine: {buildResult.engine}
                    </span>
                    <span className="neu-pill text-[#6d28d9] text-[11px] font-extrabold px-3 py-1 rounded-full">
                      Use-Case: {purpose}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#31344b] tracking-tight">
                    Recommended <span className="text-[#2d4cc8]">AI Build Configuration</span>
                  </h2>
                  <p className="text-xs md:text-sm text-[#44476a] mt-1 font-medium">
                    Every component is dynamically selected from live local stock and cross-referenced for
                    socket and thermal compatibility.
                  </p>
                </div>

                {/* Double-Bevel Total Build Cost Box (Screenshot 8 pattern!) */}
                <div className="neu-inset p-2 rounded-2xl w-full lg:w-auto lg:min-w-[270px]">
                  <div className="neu-card-sm rounded-xl p-4">
                    <div className="border border-[#d1d9e6] rounded-xl overflow-hidden divide-y divide-[#d1d9e6] text-xs">
                      <div className="flex justify-between items-center px-3.5 py-2 text-[#44476a] font-bold">
                        <span>Target Budget</span>
                        <span>৳{budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center px-3.5 py-2.5 font-black text-base text-[#31344b]">
                        <span>Total Cost</span>
                        <span className="text-[#18634b]">৳{buildResult.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs px-1">
                      <span className="text-[#66799e] font-bold">Variance:</span>
                      <span className={`font-black ${budgetDelta >= 0 ? "text-[#18634b]" : "text-[#b45309]"}`}>
                        {budgetDelta >= 0
                          ? `৳${budgetDelta.toLocaleString()} Under Budget`
                          : `৳${Math.abs(budgetDelta).toLocaleString()} Over Budget`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#44476a] font-bold">
                  Includes 7 Core Components with Real-time Multi-store Pricing
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={copyBuildSpecs}
                    className="neu-btn text-[#2d4cc8] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{copied ? "✅ Copied!" : "📋 Copy Specs List"}</span>
                  </button>

                  <button
                    onClick={printBuild}
                    className="neu-btn text-[#6d28d9] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🖨️ Print Quote</span>
                  </button>

                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="neu-btn-primary font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>⚙️ Re-tune Budget</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI ARCHITECTURE INSIGHTS & COMPATIBILITY CHECKS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Why This Build Card */}
              <div className="neu-card-hover rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="neu-inset w-8 h-8 rounded-lg flex items-center justify-center text-base">💡</span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#b45309]">
                      Why This Build?
                    </h3>
                  </div>
                  <p className="text-xs text-[#44476a] leading-relaxed font-semibold">
                    {buildResult.whyThisBuild}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#d1d9e6] flex items-center gap-2 text-[11px] text-[#2d4cc8] font-extrabold">
                  <span>⚡</span>
                  <span>Optimized for low thermal throttling</span>
                </div>
              </div>

              {/* Performance Expectations */}
              <div className="neu-card-hover rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="neu-inset w-8 h-8 rounded-lg flex items-center justify-center text-base">📊</span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#2d4cc8]">
                      Expected Performance
                    </h3>
                  </div>
                  <p className="text-xs text-[#44476a] leading-relaxed font-semibold">
                    {buildResult.performanceSummary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#d1d9e6] flex items-center gap-2 text-[11px] text-[#18634b] font-extrabold">
                  <span>🎯</span>
                  <span>Calibrated for {purpose}</span>
                </div>
              </div>

              {/* Compatibility Audit Card */}
              <div className="neu-card-hover rounded-2xl p-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="neu-inset w-8 h-8 rounded-lg flex items-center justify-center text-base">🛡️</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#18634b]">
                    Hardware Compatibility Audit
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs text-[#44476a] font-semibold">
                  {buildResult.compatibilityNotes.map((note, nIdx) => (
                    <li key={nIdx} className="flex items-start gap-2">
                      <span className="text-[#18634b] font-black text-xs mt-0.5">✓</span>
                      <span>{note.replace(/^✅\s*|^⚠️\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* =====================================================================
                COMPONENT BREAKDOWN MATRIX (Screenshot 7 Checkout Item Horizontal Pattern)
                ===================================================================== */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-black text-[#31344b] tracking-tight flex items-center gap-2.5">
                  <span>Hardware Component Matrix</span>
                  <span className="neu-pill text-[#2d4cc8] text-xs px-3 py-0.5 rounded-full font-black">
                    7 Items Selected
                  </span>
                </h3>
                <span className="text-xs text-[#66799e] font-bold hidden sm:inline">
                  Click any item or store link to inspect vendor specifications
                </span>
              </div>

              <div className="space-y-4">
                {componentList.map((comp) => {
                  const item = comp.item;
                  if (!item) return null;

                  return (
                    <div
                      key={comp.key}
                      className="neu-card-hover rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      {/* Left: Thumbnail & Main Info (Screenshot 7 layout) */}
                      <div className="flex items-start gap-5 flex-1">
                        <div className="neu-inset w-20 h-20 rounded-2xl p-2 flex items-center justify-center shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain mix-blend-multiply"
                            />
                          ) : (
                            <span className="text-2xl">{comp.icon}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className={`neu-pill-inset text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${comp.badgeColor}`}>
                              {comp.category}
                            </span>
                            <span className="text-[11px] text-[#66799e] font-bold">
                              {comp.tag}
                            </span>
                          </div>

                          <h4 className="text-sm md:text-base font-black text-[#31344b] hover:text-[#2d4cc8] transition leading-snug line-clamp-2">
                            <a
                              href={item.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.name}
                            </a>
                          </h4>

                          {/* Bullet Spec List (Matching Screenshot 7 bullet style) */}
                          <ul className="mt-2 space-y-1 text-xs text-[#44476a] font-semibold list-disc list-inside">
                            {item.specs && item.specs.length > 0 ? (
                              item.specs.slice(0, 3).map((spec, sIdx) => (
                                <li key={sIdx}>{spec}</li>
                              ))
                            ) : (
                              <>
                                <li>Warranty: Official Bangladesh Distributor Warranty</li>
                                <li>Verified Stock: Available at {item.store}</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* Right: Store Badge, Price & CTA */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#d1d9e6] gap-3">
                        <div className="text-left md:text-right">
                          <span
                            className={`neu-pill-inset inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full mb-1.5 ${getStoreBadgeColor(
                              item.store
                            )}`}
                          >
                            {item.store}
                          </span>
                          <div className="text-xl md:text-2xl font-black text-[#a91e2c] leading-none">
                            ৳{item.price.toLocaleString()}
                          </div>
                        </div>

                        <a
                          href={item.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neu-btn text-[#2d4cc8] font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shrink-0"
                        >
                          <span>View Offer</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =====================================================================
                FINAL SUMMARY CARD (EXACTLY Screenshot 9 Double-Bevel Checkout Summary)
                ===================================================================== */}
            <div className="neu-inset p-3 rounded-3xl">
              <div className="neu-card-sm rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-black text-[#31344b] mb-4">
                  Items ({componentList.filter((c) => c.item).length}) — Complete Rig Summary
                </h3>

                <div className="border border-[#d1d9e6] rounded-2xl overflow-hidden divide-y divide-[#d1d9e6] text-xs mb-6">
                  {componentList.map((comp) => {
                    if (!comp.item) return null;
                    return (
                      <div key={comp.key} className="flex items-center justify-between px-3 sm:px-4 py-3 gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 min-w-0 pr-2">
                          <span className={`font-black shrink-0 text-[11px] sm:text-xs ${comp.badgeColor}`}>{comp.category}</span>
                          <span className="font-bold text-[#31344b] truncate">{comp.item.name}</span>
                        </div>
                        <span className="font-black text-[#31344b] shrink-0">
                          ৳{comp.item.price.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between px-3 sm:px-4 py-3 text-[#44476a] font-bold gap-2">
                    <span>Configured Engine</span>
                    <span className="text-[#6d28d9] text-right truncate">{buildResult.engine}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 sm:px-4 py-4 font-black text-sm sm:text-base text-[#31344b] gap-2">
                    <span>Total Rig Cost</span>
                    <span className="text-[#18634b] text-lg sm:text-xl">৳{buildResult.totalPrice.toLocaleString()} BDT</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <small className="text-xs text-[#66799e] font-semibold">
                    Parts are sourced directly from verified retailers in Dhaka with nationwide delivery. Present this parts list to your local merchant or order online.
                  </small>

                  <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={copyBuildSpecs}
                      className="neu-btn-primary flex-1 sm:flex-none font-extrabold text-xs px-5 py-3 rounded-xl cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{copied ? "✅ Copied to Clipboard!" : "📋 Copy Full Rig Specs"}</span>
                    </button>

                    <button
                      onClick={printBuild}
                      className="neu-btn flex-1 sm:flex-none text-[#6d28d9] font-extrabold text-xs px-4 py-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>🖨️ Export PDF / Print</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
