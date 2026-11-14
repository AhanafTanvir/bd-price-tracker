import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-2xl text-center">
        
        {/* Neumorphic 404 Card */}
        <div className="neu-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#2d4cc8] via-[#6d28d9] to-[#059669]" />

          {/* 404 Soft Inset Badge */}
          <div className="inline-flex items-center justify-center neu-inset px-6 py-3 rounded-2xl mb-6">
            <span className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-[#2d4cc8] via-[#4f46e5] to-[#6d28d9] bg-clip-text text-transparent tracking-tight">
              404
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#31344b] tracking-tight mb-2">
            Page Not Found <span className="text-[#6d28d9]">•</span> পৃষ্ঠাটি পাওয়া যায়নি
          </h1>

          <p className="text-sm sm:text-base font-semibold text-[#44476a] max-w-lg mx-auto mb-6">
            The page you requested is not available in <span className="text-[#2d4cc8] font-black">SmartPriceBD</span> hardware aggregator.
          </p>

          {/* Port / Conflict Hint Box */}
          <div className="neu-inset-deep rounded-2xl p-4 mb-8 text-left bg-[#e6e7ee]/60 border border-[#d1d9e6]">
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">💡</span>
              <div className="text-xs sm:text-sm text-[#44476a] space-y-1">
                <p className="font-bold text-[#31344b]">
                  Looking for another app (like MediConnect / Receptionist portal)?
                </p>
                <p className="text-[#66799e] text-xs">
                  Port <code className="bg-[#d1d9e6]/70 px-1.5 py-0.5 rounded text-[#2d4cc8] font-mono font-bold">3000</code> is currently serving the <strong>SmartPriceBD Tech Price Tracker</strong>. If you are developing multiple projects, one can run on another port (e.g. 3001).
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
            <Link
              href="/"
              className="neu-btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
            >
              <span>🏠</span>
              <span>Back to Home</span>
            </Link>

            <Link
              href="/pc-builder"
              className="neu-btn-purple px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer transition hover:scale-[1.02]"
            >
              <span>✨</span>
              <span>AI PC Builder</span>
            </Link>

            <Link
              href="/search?q=RTX%204060"
              className="neu-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#2d4cc8] flex items-center gap-2 cursor-pointer transition"
            >
              <span>🔍</span>
              <span>Browse Tech Deals</span>
            </Link>
          </div>

          {/* Popular BD Hardware Tags */}
          <div className="pt-6 border-t border-[#d1d9e6] flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-extrabold text-[#66799e] text-[10px] tracking-wider uppercase mr-1">
              Popular Searches:
            </span>
            <Link
              href="/search?q=RTX%204060"
              className="neu-pill px-2.5 py-1 rounded-lg font-bold text-[#2d4cc8] hover:text-[#1e3a8a]"
            >
              RTX 4060
            </Link>
            <Link
              href="/search?q=Ryzen%205%207600X"
              className="neu-pill px-2.5 py-1 rounded-lg font-bold text-[#e11d48] hover:text-[#be123c]"
            >
              Ryzen 5 7600X
            </Link>
            <Link
              href="/search?q=DDR5%20RAM"
              className="neu-pill px-2.5 py-1 rounded-lg font-bold text-[#059669] hover:text-[#047857]"
            >
              DDR5 RAM
            </Link>
            <Link
              href="/search?q=144Hz%20Gaming%20Monitor"
              className="neu-pill px-2.5 py-1 rounded-lg font-bold text-[#6d28d9] hover:text-[#5b21b6]"
            >
              144Hz Monitors
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}
