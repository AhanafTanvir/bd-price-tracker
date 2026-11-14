"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-xl text-center">
        <div className="neu-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#e11d48] to-[#f59e0b]" />

          <div className="inline-flex items-center justify-center neu-inset px-6 py-3 rounded-2xl mb-6">
            <span className="text-3xl sm:text-4xl">⚠️</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#31344b] tracking-tight mb-2">
            Something went wrong • একটি ত্রুটি ঘটেছে
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-[#44476a] max-w-md mx-auto mb-6">
            An unexpected error occurred while loading this section.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="neu-btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer"
            >
              <span>🔄</span>
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="neu-btn px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#2d4cc8] flex items-center gap-2 cursor-pointer"
            >
              <span>🏠</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
