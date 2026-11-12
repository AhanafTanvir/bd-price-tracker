"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function RoboCatSvg({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="roboWhiteBody" x1="25" y1="20" x2="110" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="65%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        <linearGradient id="roboBlackVisor" x1="32" y1="36" x2="105" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="45%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id="electricBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#00e5ff" />
        </linearGradient>

        <filter id="electricGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft Electric Blue Ground Shadow / Hover Glow */}
      <ellipse cx="66" cy="130" rx="30" ry="5.5" fill="#2563eb" fillOpacity="0.22" />

      {/* Wagging Electric Robotic Tail */}
      <g className="animate-robo-tail">
        <path
          d="M95 110 C114 108, 122 93, 117 77 C114 68, 121 61, 127 57"
          stroke="#0f172a"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M95 110 C114 108, 122 93, 117 77 C114 68, 121 61, 127 57"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6 6"
        />
        {/* Electric Lightning Tip on Tail */}
        <path
          d="M126 48 L120 57 L126 57 L122 65 L133 54 L127 54 Z"
          fill="#00e5ff"
          stroke="#2563eb"
          strokeWidth="0.8"
          filter="url(#electricGlow)"
        />
      </g>

      {/* Electric Sparkle Bolts around Ears */}
      <g className="animate-electric-pulse" filter="url(#electricGlow)">
        <path d="M18 32 L13 38 L17 38 L14 44 L22 36 L18 36 Z" fill="#00e5ff" />
        <path d="M115 24 L111 29 L114 29 L112 34 L119 27 L115 27 Z" fill="#38bdf8" />
        <circle cx="24" cy="21" r="1.8" fill="#38bdf8" />
        <circle cx="112" cy="40" r="1.6" fill="#2563eb" />
      </g>

      {/* Left Robotic Cat Ear */}
      <path
        d="M32 45 L26 15 C25 11 30 9 34 12 L54 30 Z"
        fill="url(#roboWhiteBody)"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M35 39 L31 19 L48 31 Z" fill="#0f172a" />
      <path d="M37 36 L34 24 L44 31 Z" fill="url(#electricBlue)" filter="url(#electricGlow)" />

      {/* Right Robotic Cat Ear */}
      <path
        d="M100 45 L106 15 C107 11 102 9 98 12 L78 30 Z"
        fill="url(#roboWhiteBody)"
        stroke="#0f172a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M97 39 L101 19 L84 31 Z" fill="#0f172a" />
      <path d="M95 36 L98 24 L88 31 Z" fill="url(#electricBlue)" filter="url(#electricGlow)" />

      {/* Top Forehead Lightning Node */}
      <rect x="61" y="24" width="10" height="4" rx="2" fill="#2563eb" filter="url(#electricGlow)" />

      {/* Side Black Audio/Sensor Ear-Pods with Electric Blue Ring */}
      <rect x="20" y="50" width="9" height="22" rx="4.5" fill="#0f172a" />
      <rect x="22" y="55" width="3" height="12" rx="1.5" fill="#00e5ff" filter="url(#electricGlow)" />
      <rect x="103" y="50" width="9" height="22" rx="4.5" fill="#0f172a" />
      <rect x="107" y="55" width="3" height="12" rx="1.5" fill="#00e5ff" filter="url(#electricGlow)" />

      {/* Robot Body / Torso (White Armor + Black Joints + Blue Core) */}
      <path
        d="M42 86 C38 86 35 90 35 96 L35 117 C35 123 41 127 48 127 L84 127 C91 127 97 123 97 117 L97 96 C97 90 94 86 90 86 Z"
        fill="url(#roboWhiteBody)"
        stroke="#0f172a"
        strokeWidth="2.2"
      />

      {/* Black Neck Collar + Electric Blue Core Gem */}
      <rect x="44" y="83" width="44" height="7" rx="3.5" fill="#0f172a" />
      <circle cx="66" cy="86.5" r="4" fill="#2563eb" stroke="#00e5ff" strokeWidth="1.2" filter="url(#electricGlow)" />

      {/* Chest Power Core Circle + Electric Bolt */}
      <circle cx="66" cy="107" r="11" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <path
        d="M68 100 L61 108 H66 L64 114 L71 106 H66 Z"
        fill="#00e5ff"
        filter="url(#electricGlow)"
      />

      {/* Cute Left & Right Paws */}
      <rect x="30" y="96" width="11" height="20" rx="5.5" fill="url(#roboWhiteBody)" stroke="#0f172a" strokeWidth="2" />
      <circle cx="35.5" cy="111" r="2.2" fill="#2563eb" />
      <rect x="91" y="96" width="11" height="20" rx="5.5" fill="url(#roboWhiteBody)" stroke="#0f172a" strokeWidth="2" />
      <circle cx="96.5" cy="111" r="2.2" fill="#2563eb" />

      {/* Main White Robotic Cat Head Helmet */}
      <rect
        x="26"
        y="28"
        width="80"
        height="58"
        rx="26"
        fill="url(#roboWhiteBody)"
        stroke="#0f172a"
        strokeWidth="2.4"
      />

      {/* Jet-Black Glossy Digital Visor Faceplate */}
      <rect
        x="34"
        y="37"
        width="64"
        height="41"
        rx="18"
        fill="url(#roboBlackVisor)"
        stroke="#2563eb"
        strokeWidth="1.4"
      />

      {/* Visor Glass Highlight Reflection */}
      <path
        d="M42 42 H86 C89 42 91 44 92 47 C84 44 50 44 40 47 C40 44 41 42 42 42 Z"
        fill="#ffffff"
        fillOpacity="0.14"
      />

      {/* Electric Blue Glowing Digital Cat Eyes (with Blink Animation) */}
      <g className="animate-robo-blink" filter="url(#electricGlow)">
        {/* Left Eye */}
        <rect x="44" y="48" width="12" height="14" rx="6" fill="#00e5ff" />
        <circle cx="48" cy="52" r="2.2" fill="#ffffff" />

        {/* Right Eye */}
        <rect x="76" y="48" width="12" height="14" rx="6" fill="#00e5ff" />
        <circle cx="80" cy="52" r="2.2" fill="#ffffff" />
      </g>

      {/* Cute Glowing Cyan Cat Mouth (ω) & Digital Whiskers */}
      <path
        d="M61 66 Q63.5 70 66 66 Q68.5 70 71 66"
        stroke="#38bdf8"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        filter="url(#electricGlow)"
      />
      <line x1="37" y1="57" x2="42" y2="58" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="37" y1="62" x2="42" y2="62" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="90" y1="58" x2="95" y2="57" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="90" y1="62" x2="95" y2="62" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function RoboCatHelper() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    setQuickQuery("");
  };

  const goAndClose = (path: string) => {
    setIsOpen(false);
    if (path.startsWith("#")) {
      const el = document.getElementById(path.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
      router.push(`/${path}`);
      return;
    }
    router.push(path);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end select-none">
      
      {/* Interactive Quick-Help Panel when Robo-Cat is clicked */}
      {isOpen && (
        <div className="neu-card rounded-3xl p-4 w-[calc(100vw-1.5rem)] max-w-[320px] mb-3 border border-[#2563eb]/30 animate-neu-pop">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#d1d9e6]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0f172a] border border-[#2563eb]/50 flex items-center justify-center shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                <span className="text-[#00e5ff] text-sm">⚡</span>
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0f172a] leading-tight">
                  VoltCat <span className="text-[#2563eb]">AI Assistant</span>
                </h4>
                <p className="text-[10px] font-bold text-[#18634b] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                  Online • Hardware Helper
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="neu-btn w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-[#44476a] hover:text-[#a91e2c] cursor-pointer"
              aria-label="Close helper"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-[#31344b] font-semibold mb-3 leading-relaxed">
            Meow! ⚡ Need any help finding the lowest tech price in BD or building a custom PC?
          </p>

          <div className="space-y-2 mb-3">
            <button
              type="button"
              onClick={() => goAndClose("/pc-builder")}
              className="neu-btn-primary w-full py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-between cursor-pointer"
            >
              <span>✨ Build a PC with AI</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => goAndClose("/search?q=RTX%204060")}
              className="neu-btn w-full py-2 px-3 rounded-xl text-xs font-extrabold text-[#2563eb] flex items-center justify-between cursor-pointer"
            >
              <span>🎮 Compare RTX 4060 Prices</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => goAndClose("/search?q=Laptop")}
              className="neu-btn w-full py-2 px-3 rounded-xl text-xs font-extrabold text-[#0f172a] flex items-center justify-between cursor-pointer"
            >
              <span>💻 Browse Best Laptop Deals</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => goAndClose("#alerts")}
              className="neu-btn w-full py-2 px-3 rounded-xl text-xs font-extrabold text-[#18634b] flex items-center justify-between cursor-pointer"
            >
              <span>🔔 Set Price Drop Alert</span>
              <span>→</span>
            </button>
          </div>

          <form onSubmit={handleQuickSearch} className="neu-inset rounded-xl p-1 flex items-center gap-1.5">
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Search any CPU, GPU, Monitor..."
              className="flex-1 bg-transparent px-2.5 py-1.5 text-xs font-bold text-[#0f172a] placeholder-[#66799e] outline-none"
            />
            <button
              type="submit"
              className="bg-[#0f172a] hover:bg-[#2563eb] text-[#00e5ff] hover:text-white px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer"
            >
              Go ⚡
            </button>
          </form>
        </div>
      )}

      {/* Floating Robo-Cat Widget + Speech Bubble */}
      <div className="flex flex-col items-end">
        {/* Speech Bubble ("Need any help?") */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="neu-card mb-1 mr-1.5 sm:mb-1.5 sm:mr-3 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl rounded-br-sm border border-[#2563eb]/40 flex items-center gap-1.5 sm:gap-2 cursor-pointer group hover:-translate-y-0.5 transition relative"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff] animate-pulse shrink-0"></span>
            <span className="text-[11px] sm:text-xs font-black text-[#0f172a] group-hover:text-[#2563eb] transition whitespace-nowrap">
              Need any help?
            </span>
            <span className="text-[11px] sm:text-xs text-[#2563eb] font-black animate-bounce">⚡</span>
          </button>
        )}

        {/* Electric White/Blue/Black Robo-Cat Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Open Robo-Cat AI Assistant"
          className="relative group cursor-pointer focus:outline-none"
        >
          {/* Subtle Electric Ring Halo */}
          <span className="absolute inset-2 rounded-full bg-[#2563eb]/15 blur-xl group-hover:bg-[#00e5ff]/25 transition pointer-events-none"></span>

          <div className="animate-neu-float relative transition-transform duration-300 group-hover:scale-105">
            <RoboCatSvg className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-[0_10px_14px_rgba(15,23,42,0.22)]" />
          </div>
        </button>
      </div>
    </div>
  );
}

