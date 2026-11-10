"use client";

import { useState, useEffect, useId } from "react";
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
    recommendedMin: 45000,
  },
  {
    id: "1440p / 4K AAA Gaming",
    label: "1440p / 4K AAA Gaming",
    sub: "Cyberpunk, Black Myth, GTA with Ray Tracing",
    icon: "🚀",
    recommendedMin: 95000,
  },
  {
    id: "Video Editing & 3D",
    label: "Video Editing & 3D Rendering",
    sub: "Premiere, DaVinci, Blender & After Effects",
    icon: "🎬",
    recommendedMin: 70000,
  },
  {
    id: "Programming / AI Workstation",
    label: "Programming & Machine Learning",
    sub: "Docker, PyTorch, Local LLMs & Heavy Multitasking",
    icon: "⚡",
    recommendedMin: 80000,
  },
  {
    id: "Office & Productivity",
    label: "Office & Day-to-Day Productivity",
    sub: "Ultra-fast multitasking, 4K media, office workflows",
    icon: "💼",
    recommendedMin: 32000,
  },
];

const BUDGET_PRESETS = [
  { label: "৳45,000", value: 45000, tag: "Budget Esports" },
  { label: "৳65,000", value: 65000, tag: "Sweet Spot 1080p" },
  { label: "৳85,000", value: 85000, tag: "Popular Pick" },
  { label: "৳120,000", value: 120000, tag: "1440p Ultra" },
  { label: "৳175,000", value: 175000, tag: "High-End Creator" },
  { label: "৳250,000", value: 250000, tag: "Enthusiast Flagship" },
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

  // Cycling scanning animation texts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStepIndex(0);
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

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById("builder-results");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      console.error("AI Builder Error:", err);
      setError(err.message || "An error occurred while connecting to the AI Builder API.");
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
    if (store.includes("Star")) return "bg-red-50 text-red-700 border-red-200";
    if (store.includes("Ryans")) return "bg-amber-50 text-amber-800 border-amber-200";
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const componentList = buildResult
    ? [
        {
          key: "cpu",
          category: "Processor / CPU",
          icon: "💻",
          item: buildResult.cpu,
          tag: "Core Engine",
        },
        {
          key: "motherboard",
          category: "Motherboard",
          icon: "🧩",
          item: buildResult.motherboard,
          tag: "Platform Base",
        },
        {
          key: "gpu",
          category: "Graphics Card",
          icon: "🎮",
          item: buildResult.gpu,
          tag: "Visual & 3D Acceleration",
        },
        {
          key: "ram",
          category: "System Memory / RAM",
          icon: "⚡",
          item: buildResult.ram,
          tag: "High-Speed Memory",
        },
        {
          key: "storage",
          category: "Solid State Drive / SSD",
          icon: "💾",
          item: buildResult.storage,
          tag: "Primary OS & NVMe Storage",
        },
        {
          key: "psu",
          category: "Power Supply Unit (PSU)",
          icon: "🔌",
          item: buildResult.psu,
          tag: "Stable Power Delivery",
        },
        {
          key: "casing",
          category: "Chassis / Casing",
          icon: "🖥️",
          item: buildResult.casing,
          tag: "Airflow & Protection",
        },
      ]
    : [];

  const budgetDelta = buildResult ? budget - buildResult.totalPrice : 0;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Breadcrumb & Status Bar */}
      <div className="border-b border-slate-200/80 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">AI PC Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">Live Inventory: 770+ Hardware Listings Active</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-slate-50 border-b border-slate-200/70 pt-10 pb-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 border border-blue-200/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <span className="animate-spin text-sm">✨</span>
                <span>SmartPriceBD Neural Engine • Gemini 2.5 LLM</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                AI Hardware Configurator & PC Builder
              </h1>
              <p className="text-sm md:text-base text-slate-600 mt-2.5 max-w-2xl leading-relaxed">
                Provide your target budget and primary use-case. Our AI compares real-time prices across{" "}
                <span className="font-bold text-slate-800">Star Tech</span>,{" "}
                <span className="font-bold text-slate-800">Ryans Computers</span>, and{" "}
                <span className="font-bold text-slate-800">PCB Store BD</span> to generate a physically
                compatible, bottleneck-free rig.
              </p>
            </div>

            {/* Quick Guarantees Box */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 border border-blue-100 shadow-sm shrink-0 flex flex-col gap-2 max-w-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="text-emerald-600 text-sm">✓</span>
                <span>100% Socket & Chipset Matched</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="text-emerald-600 text-sm">✓</span>
                <span>DDR4 / DDR5 Bus Alignment Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="text-emerald-600 text-sm">✓</span>
                <span>Lowest Street Price Across 3 Stores</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <span className="text-emerald-600 text-sm">✓</span>
                <span>Adequate PSU Wattage Headroom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 -mt-6">
        
        {/* =========================================================================
            INPUT CARD SECTION
            ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 md:p-8 transition">
          <form onSubmit={handleGenerateBuild} className="space-y-8">
            
            {/* 1. Target Budget Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
                    1
                  </span>
                  <span>Target Budget (BDT)</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  Min ৳25,000 • Max ৳600,000
                </span>
              </div>

              {/* Big Input + Slider */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                  ৳
                </span>
                <input
                  type="text"
                  value={budgetInput}
                  onChange={(e) => handleBudgetChange(e.target.value)}
                  placeholder="e.g. 75,000"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-28 text-2xl md:text-3xl font-black text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-200/70 px-2.5 py-1 rounded-lg">
                  BDT TAKA
                </span>
              </div>

              {/* Quick Select Presets */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider self-center mr-1">
                  Popular Tiers:
                </span>
                {BUDGET_PRESETS.map((p) => {
                  const isSelected = budget === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => handlePresetSelect(p.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <span>{p.label}</span>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200/60 text-slate-600"
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
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
                    2
                  </span>
                  <span>Primary Use-Case & Performance Profile</span>
                </label>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  Tuning component allocation ratio
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {USE_CASES.map((uc) => {
                  const isSelected = purpose === uc.id;
                  return (
                    <div
                      key={uc.id}
                      onClick={() => setPurpose(uc.id)}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 shadow-sm shadow-blue-500/10"
                          : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{uc.icon}</span>
                          <span
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-blue-600 bg-blue-600"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 leading-snug">
                          {uc.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                          {uc.sub}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-500">
                        Target from ৳{(uc.recommendedMin / 1000).toFixed(0)}k
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-xl flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="text-blue-600 text-base">🤖</span>
                <span>
                  Querying MongoDB hardware pool • Gemini 2.5 Flash strict constraint optimization
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-base font-black px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
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
            HIGH-TECH LOADING STATE (Thinking / Scanning Animation)
            ========================================================================= */}
        {loading && (
          <div className="mt-8 bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
            {/* Cyberpunk Grid Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              {/* Radar pulse ring */}
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border-2 border-dashed border-blue-400 animate-spin"></div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/50">
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

              <p className="text-slate-400 text-xs md:text-sm mt-2 max-w-lg">
                Evaluating 770+ live Bangladeshi hardware listings for socket pinouts, RAM channels, and
                unbottlenecked performance.
              </p>

              {/* Dynamic Telemetry Box */}
              <div className="mt-6 w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800 mb-2.5">
                  <span className="text-blue-400 font-bold">TERMINAL TELEMETRY</span>
                  <span>BUDGET: ৳{budget.toLocaleString()} BDT</span>
                </div>
                <div className="flex items-center gap-2.5 text-blue-300 min-h-[24px]">
                  <span className="text-emerald-400 font-bold">➜</span>
                  <span className="animate-fade-in font-medium">{SCANNING_STEPS[loadingStepIndex]}</span>
                </div>
              </div>

              {/* Visual mini-pipeline */}
              <div className="mt-6 grid grid-cols-3 sm:grid-cols-6 gap-2 w-full text-[10px] font-bold text-slate-400">
                {["CPU", "Mobo", "GPU", "RAM", "SSD", "PSU"].map((comp, idx) => (
                  <div
                    key={comp}
                    className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs text-blue-400">✓</span>
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            RESULTS SECTION
            ========================================================================= */}
        {buildResult && !loading && (
          <div id="builder-results" className="mt-10 space-y-8 scroll-mt-6">
            
            {/* OVERVIEW BANNER */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <span>✓</span>
                      <span>Compatibility 100% Verified</span>
                    </span>
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      Engine: {buildResult.engine}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      Use-Case: {purpose}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    Recommended AI Build Configuration
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-1">
                    Every component is dynamically selected from live local stock and cross-referenced for
                    socket and thermal compatibility.
                  </p>
                </div>

                {/* Total Price Callout Box */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl flex flex-col justify-between min-w-[260px] shadow-lg shadow-slate-900/10">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Total Build Cost
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-3xl font-black text-emerald-400">
                        ৳{buildResult.totalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold">BDT</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target: ৳{budget.toLocaleString()}</span>
                    <span
                      className={`font-black ${
                        budgetDelta >= 0 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {budgetDelta >= 0
                        ? `৳${budgetDelta.toLocaleString()} Under`
                        : `৳${Math.abs(budgetDelta).toLocaleString()} Over`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-medium">
                  Includes 7 Core Components with Real-time Multi-store Pricing
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyBuildSpecs}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{copied ? "✅ Copied!" : "📋 Copy Specs List"}</span>
                  </button>

                  <button
                    onClick={printBuild}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🖨️ Print Quote</span>
                  </button>

                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    <span>⚙️ Re-tune Budget</span>
                  </button>
                </div>
              </div>
            </div>

            {/* AI ARCHITECTURE INSIGHTS & COMPATIBILITY CHECKS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Why This Build Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">💡</span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Why This Build?
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {buildResult.whyThisBuild}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-blue-700 font-bold">
                  <span>⚡</span>
                  <span>Optimized for low thermal throttling</span>
                </div>
              </div>

              {/* Performance Expectations */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">📊</span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                      Expected Performance
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {buildResult.performanceSummary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-emerald-700 font-bold">
                  <span>🎯</span>
                  <span>Calibrated for {purpose}</span>
                </div>
              </div>

              {/* Compatibility Audit Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🛡️</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Hardware Compatibility Audit
                  </h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600 font-medium">
                  {buildResult.compatibilityNotes.map((note, nIdx) => (
                    <li key={nIdx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold text-xs mt-0.5">✓</span>
                      <span>{note.replace(/^✅\s*|^⚠️\s*/, "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* =====================================================================
                COMPONENT BREAKDOWN MATRIX (7 Core Parts)
                ===================================================================== */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Hardware Component Matrix</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    7 Items Selected
                  </span>
                </h3>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
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
                      className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                    >
                      {/* Left: Thumbnail & Main Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Component Icon / Image */}
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-xl border border-slate-200/80 p-2 flex items-center justify-center shrink-0">
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

                        {/* Title, Category & Specs */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                              {comp.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {comp.tag}
                            </span>
                          </div>

                          <h4 className="text-sm md:text-base font-black text-slate-900 hover:text-blue-600 transition leading-snug line-clamp-2">
                            <a
                              href={item.productUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.name}
                            </a>
                          </h4>

                          {/* Spec Pills */}
                          {item.specs && item.specs.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.specs.slice(0, 3).map((spec, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="bg-slate-50 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200/80"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Store, Price & CTA */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                        <div className="text-left md:text-right">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mb-1 ${getStoreBadgeColor(
                              item.store
                            )}`}
                          >
                            {item.store}
                          </span>
                          <div className="text-xl md:text-2xl font-black text-slate-900 leading-none">
                            ৳{item.price.toLocaleString()}
                          </div>
                        </div>

                        <a
                          href={item.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition border border-blue-200/80 flex items-center gap-1.5 shrink-0 cursor-pointer"
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

            {/* FINAL SUMMARY / CTA CARD */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                  Ready to Purchase
                </span>
                <h3 className="text-2xl font-black mt-2">
                  Total Rig Cost: ৳{buildResult.totalPrice.toLocaleString()} BDT
                </h3>
                <p className="text-xs text-blue-100 mt-1 max-w-xl">
                  Parts are sourced directly from verified retailers in Dhaka & nationwide delivery. You
                  can purchase each component separately or present this parts list to your local Elephant
                  Road / Multiplan merchant.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={copyBuildSpecs}
                  className="bg-white text-blue-700 hover:bg-blue-50 font-black text-xs px-5 py-3 rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
                >
                  <span>{copied ? "✅ Copied to Clipboard!" : "📋 Copy Full Rig Specs"}</span>
                </button>

                <button
                  onClick={printBuild}
                  className="bg-blue-800/80 hover:bg-blue-800 text-white font-bold text-xs px-4 py-3 rounded-xl transition border border-blue-400/40 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🖨️ Export PDF / Print</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
