"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-16 pb-12 font-sans text-slate-700">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-slate-200">
          
          {/* Col 1: Brand & Integrity */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                S
              </div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-slate-900 leading-none">SmartPrice</span>
                <span className="text-xl font-black tracking-tight text-blue-600 leading-none">BD</span>
              </div>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed">
              Bangladesh&apos;s authoritative independent technology price comparison engine. We aggregate verified market prices across certified retail partners so you never overpay for hardware. We are not an e-commerce shop; orders execute directly with verified merchants.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>🛡️ Zero bias</span>
              <span className="text-slate-300">•</span>
              <span>Real-time catalog parity</span>
            </div>

            <div className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API STATUS: 3 OF 3 RETAILERS SYNCHRONIZED
            </div>
          </div>

          {/* Col 2: Retailers */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Retailers</h3>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              <li className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="hover:text-blue-600 cursor-pointer">Star Tech</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Live API</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="hover:text-blue-600 cursor-pointer">Ryans Computers</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Live API</span>
              </li>
              <li className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="hover:text-blue-600 cursor-pointer">PCB Store BD</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Live API</span>
              </li>
              <li className="pt-1 text-slate-400 text-[11px]">
                Next-day catalog updates every morning at 04:00 AM BST
              </li>
            </ul>
          </div>

          {/* Col 3: Discovery & Tools */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Discovery & Tools</h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/pc-builder" className="hover:text-blue-600 transition flex items-center gap-1.5 font-bold text-blue-700">
                  <span>✨ AI PC Builder</span>
                  <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.2 rounded font-black">NEW</span>
                </Link>
              </li>
              <li>
                <Link href="/#alerts" className="hover:text-blue-600 transition">Price Drop Alerts</Link>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition">Data Freshness Guarantee</span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition">Affiliate Disclosure</span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition">How Aggregation Works</span>
              </li>
              <li>
                <span className="hover:text-blue-600 cursor-pointer transition">BD Hardware Market Blog</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Market Intelligence */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Market Intelligence</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Receive instant Telegram and Email alerts when GPU or CPU street prices hit record lows in Bangladesh.
            </p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to SmartPrice BD alerts!'); }} className="flex border border-slate-300 rounded-xl overflow-hidden shadow-xs focus-within:ring-2 ring-blue-500">
              <input
                type="email"
                required
                placeholder="Your email address..."
                className="px-3.5 py-2.5 text-xs w-full outline-none bg-slate-50 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 hover:bg-blue-700 transition font-bold text-sm cursor-pointer flex items-center justify-center"
              >
                ▶
              </button>
            </form>

            <p className="text-[10px] text-slate-400">
              Zero spam. Unsubscribe at any time with 1 click.
            </p>
          </div>
        </div>

        {/* Disclaimer & Legal Notice */}
        <div className="pt-8 pb-4 text-[11px] text-slate-500 leading-relaxed border-b border-slate-100">
          <p>
            <strong className="text-slate-700 font-semibold">Price Accuracy Disclaimer:</strong> Prices, stock status, and promo vouchers are refreshed regularly from third-party retailer listings (Star Tech, Ryans Computers, PCB Store). Verified checkout rates on merchant sites supersede indexed SmartPrice BD values. SmartPrice BD is an independent observer; trademarks belong to their respective owners.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 gap-4">
          <div className="flex flex-wrap gap-4 font-medium">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Price Accuracy Disclaimer</span>
            <span>•</span>
            <span className="hover:text-slate-600 cursor-pointer">Affiliate Disclosure</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Copyright © 2026 SmartPrice BD. Dhaka, Bangladesh.</span>
            <span className="hidden sm:inline text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Retailer Feeds Active (3/3 Synced)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
