"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#e6e7ee]/80 backdrop-blur-sm border-t border-[#d1d9e6] mt-12 md:mt-20 pt-10 md:pt-16 pb-20 sm:pb-12 text-[#44476a]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-10 md:pb-12 border-b border-[#d1d9e6]">
          
          {/* Col 1: Brand & Integrity */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-[#2d4cc8] via-[#4f46e5] to-[#6d28d9] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff]">
                S
              </div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-[#31344b] leading-none">SmartPrice</span>
                <span className="text-xl font-black tracking-tight text-[#2d4cc8] leading-none">BD</span>
              </div>
            </Link>

            <p className="text-xs text-[#44476a] leading-relaxed">
              Bangladesh&apos;s authoritative independent technology price comparison engine. We aggregate verified market prices across certified retail partners so you never overpay for hardware.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-[#31344b]">
              <span className="text-[#2d4cc8]">🛡️ Zero bias</span>
              <span className="text-[#93a0b8]">•</span>
              <span className="text-[#18634b]">Real-time catalog parity</span>
            </div>

            <div className="neu-pill inline-flex items-center gap-2 text-[11px] font-extrabold text-[#18634b] px-3.5 py-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              API STATUS: 3 OF 3 RETAILERS SYNCED
            </div>
          </div>

          {/* Col 2: Retailers (Screenshot 6/8 clean bordered list) */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#31344b] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2d4cc8]"></span>
              Retailers
            </h3>
            <div className="neu-card-sm rounded-2xl overflow-hidden">
              <ul className="divide-y divide-[#d1d9e6] text-xs font-semibold">
                <li className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#a91e2c] font-bold hover:underline cursor-pointer">Star Tech</span>
                  <span className="neu-pill-inset text-[10px] font-extrabold text-[#18634b] px-2.5 py-0.5 rounded-full">Live API</span>
                </li>
                <li className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#b45309] font-bold hover:underline cursor-pointer">Ryans Computers</span>
                  <span className="neu-pill-inset text-[10px] font-extrabold text-[#18634b] px-2.5 py-0.5 rounded-full">Live API</span>
                </li>
                <li className="flex items-center justify-between px-4 py-3">
                  <span className="text-[#2d4cc8] font-bold hover:underline cursor-pointer">PCB Store BD</span>
                  <span className="neu-pill-inset text-[10px] font-extrabold text-[#18634b] px-2.5 py-0.5 rounded-full">Live API</span>
                </li>
              </ul>
            </div>
            <p className="text-[#66799e] text-[11px] font-medium">
              Next-day catalog updates every morning at 04:00 AM BST
            </p>
          </div>

          {/* Col 3: Discovery & Tools */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#31344b] uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6d28d9]"></span>
              Discovery & Tools
            </h3>
            <ul className="space-y-2.5 text-xs text-[#44476a] font-semibold">
              <li>
                <Link href="/pc-builder" className="neu-btn inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-extrabold text-[#6d28d9]">
                  <span>✨ AI PC Builder</span>
                  <span className="bg-[#6d28d9] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">NEW</span>
                </Link>
              </li>
              <li>
                <Link href="/#alerts" className="hover:text-[#2d4cc8] transition flex items-center gap-1.5">
                  <span className="text-[#d97706]">●</span> Price Drop Alerts
                </Link>
              </li>
              <li>
                <span className="hover:text-[#2d4cc8] cursor-pointer transition flex items-center gap-1.5">
                  <span className="text-[#059669]">●</span> Data Freshness Guarantee
                </span>
              </li>
              <li>
                <span className="hover:text-[#2d4cc8] cursor-pointer transition flex items-center gap-1.5">
                  <span className="text-[#2d4cc8]">●</span> Affiliate Disclosure
                </span>
              </li>
              <li>
                <span className="hover:text-[#2d4cc8] cursor-pointer transition flex items-center gap-1.5">
                  <span className="text-[#6d28d9]">●</span> How Aggregation Works
                </span>
              </li>
              <li>
                <span className="hover:text-[#2d4cc8] cursor-pointer transition flex items-center gap-1.5">
                  <span className="text-[#a91e2c]">●</span> BD Hardware Market Blog
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Market Intelligence (Double Bevel Card) */}
          <div className="neu-card rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-[#31344b] uppercase tracking-wider flex items-center gap-2">
              <span className="text-[#2d4cc8]">📩</span> Market Intelligence
            </h3>
            <p className="text-xs text-[#44476a] leading-relaxed">
              Receive instant alerts when GPU or CPU street prices hit record lows in Bangladesh.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to SmartPrice BD alerts!"); }} className="neu-inset flex rounded-xl overflow-hidden p-1">
              <input
                type="email"
                required
                placeholder="Your email address..."
                className="px-3 py-2 text-xs w-full outline-none bg-transparent text-[#31344b] font-semibold placeholder-[#66799e]"
              />
              <button
                type="submit"
                className="neu-btn-primary px-4 py-2 rounded-lg font-bold text-xs cursor-pointer flex items-center justify-center shrink-0"
              >
                ▶
              </button>
            </form>

            <p className="text-[10px] text-[#66799e] font-semibold">
              Zero spam. Unsubscribe at any time with 1 click.
            </p>
          </div>
        </div>

        {/* Disclaimer & Legal Notice */}
        <div className="pt-8 pb-5 text-[11px] text-[#66799e] leading-relaxed border-b border-[#d1d9e6]">
          <p>
            <strong className="text-[#31344b] font-bold">Price Accuracy Disclaimer:</strong> Prices, stock status, and promo vouchers are refreshed regularly from third-party retailer listings (<span className="text-[#a91e2c] font-semibold">Star Tech</span>, <span className="text-[#b45309] font-semibold">Ryans Computers</span>, <span className="text-[#2d4cc8] font-semibold">PCB Store</span>). Verified checkout rates on merchant sites supersede indexed SmartPrice BD values. SmartPrice BD is an independent observer; trademarks belong to their respective owners.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-[11px] text-[#66799e] gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 font-semibold">
            <span className="hover:text-[#2d4cc8] cursor-pointer transition">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#2d4cc8] cursor-pointer transition">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#2d4cc8] cursor-pointer transition">Price Accuracy Disclaimer</span>
            <span>•</span>
            <span className="hover:text-[#2d4cc8] cursor-pointer transition">Affiliate Disclosure</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-semibold text-[#44476a]">Copyright © 2026 SmartPrice BD. Dhaka, Bangladesh.</span>
            <span className="neu-pill hidden sm:inline-flex text-[#18634b] font-bold px-2.5 py-1 rounded-full items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
              Retailer Feeds Active (3/3 Synced)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
