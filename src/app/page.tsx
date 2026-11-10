"use client";

import { useState, useEffect } from "react";

interface Deal {
  _id: string;
  name: string;
  store: string;
  price: number;
  rating: number;
  imageUrl: string;
  productUrl: string;
  recommendationScore: number;
  isBestDeal: boolean;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("monitor");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDeals = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setDeals(data.results || []);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals("monitor");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeals(searchTerm);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          BD Tech <span className="text-emerald-400">Price Aggregator</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Compare live prices across Star Tech, Ryans & PCB Store in one click.
        </p>

        <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto mt-6 gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search monitor, RTX 3060, Ryzen 7..."
            className="w-full px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-5xl mx-auto mt-10 space-y-4">
        {loading ? (
          <p className="text-center text-slate-400 py-12">Scanning stores for the lowest price...</p>
        ) : deals.length === 0 ? (
          <p className="text-center text-slate-400 py-12">No products found. Try another keyword!</p>
        ) : (
          deals.map((deal, index) => (
            <div
              key={deal._id || index}
              className={`flex flex-col md:flex-row items-center justify-between p-5 rounded-2xl border transition ${
                deal.isBestDeal
                  ? "bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900/50 border-slate-800"
              }`}
            >
              <div className="flex items-center gap-5 w-full md:w-auto">
                <span className="text-lg font-bold text-slate-500 w-6">#{index + 1}</span>
                {deal.imageUrl && (
                  <img
                    src={deal.imageUrl}
                    alt={deal.name}
                    className="w-20 h-20 object-contain rounded-lg bg-white p-1"
                  />
                )}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-800 text-slate-300">
                      {deal.store}
                    </span>
                    {deal.isBestDeal && (
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-500 text-slate-950">
                        ★ BEST DEAL & RECOMMENDED
                      </span>
                    )}
                    <span className="text-xs text-amber-400 font-medium">
                      ★ {deal.rating} / 5.0
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white">{deal.name}</h2>
                  <p className="text-xs text-slate-400">
                    Deal Score: {(deal.recommendationScore * 100).toFixed(0)}% Match
                  </p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-3">
                <div className="text-2xl font-extrabold text-emerald-400">
                  ৳{deal.price.toLocaleString()}
                </div>
                <a
                  href={deal.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm transition"
                >
                  View Deal →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}