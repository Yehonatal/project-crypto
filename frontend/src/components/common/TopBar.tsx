import { useEffect, useMemo, useRef, useState } from "react";
import { Github, User, KeyRound, X, Sparkles } from "lucide-react";

interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

function formatNumber(num: number) {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

const TopBar = () => {
  const [global, setGlobal] = useState<GlobalData | null>(null);
  const [paused, setPaused] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [cgKey, setCgKey] = useState<string | null>(null);
  const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:4000";

  // One-time reset so next load prompts the user (user request)
  useEffect(() => {
    try {
      const resetMarker = localStorage.getItem("pc_cg_key_reset_once");
      if (!resetMarker) {
        localStorage.removeItem("pc_coingecko_api_key");
        localStorage.setItem("pc_cg_key_reset_once", "done");
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pc_coingecko_api_key");
      if (stored) {
        setCgKey(stored);
      } else {
        setShowKeyModal(true);
      }
    } catch {}
  }, []);

  const fetchGlobal = async () => {
    try {
      const key = localStorage.getItem("pc_coingecko_api_key") || "";
      const res = await fetch(`${baseUrl}/api/coingecko/global`, {
        headers: key ? { "x-cg-api-key": key } : undefined,
      });
      const json = await res.json();
      setGlobal(json);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchGlobal();
    const id = setInterval(fetchGlobal, 60_000);
    return () => clearInterval(id);
  }, [baseUrl, cgKey]);

  const isUp = (global?.data?.market_cap_change_percentage_24h_usd || 0) >= 0;
  const change = (global?.data?.market_cap_change_percentage_24h_usd || 0).toFixed(1);

  const items = useMemo(() => {
    return [
      { label: "Coins", value: global?.data?.active_cryptocurrencies?.toLocaleString() || "17,662" },
      { label: "Exchanges", value: global?.data?.markets?.toLocaleString() || "1,316" },
      { label: "Market Cap", value: `${formatNumber(global?.data?.total_market_cap?.usd || 3.76e12)} ${isUp ? "▲" : "▼"} ${change}%`, color: isUp ? "text-green-600" : "text-red-500" },
      { label: "24h Vol", value: formatNumber(global?.data?.total_volume?.usd || 2.14746e11) },
      { label: "Dominance", value: `BTC ${(global?.data?.market_cap_percentage?.btc ?? 61.9).toFixed(1)}%  ETH ${(global?.data?.market_cap_percentage?.eth ?? 9.8).toFixed(1)}%` },
      { label: "Gas", value: `3.654 GWEI`, color: "text-indigo-600" },
    ];
  }, [global, isUp, change]);

  const containerRef = useRef<HTMLDivElement>(null);

  const saveCgKey = () => {
    if (!cgKey || cgKey.trim().length < 10) return;
    localStorage.setItem("pc_coingecko_api_key", cgKey.trim());
    setShowKeyModal(false);
    fetchGlobal();
  };

  const clearCgKey = () => {
    localStorage.removeItem("pc_coingecko_api_key");
    setCgKey("");
    setShowKeyModal(true);
  };

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="px-6 py-2 text-sm text-gray-700 flex justify-between items-center">
        {/* Marquee area */}
        <div
          className={`relative overflow-hidden flex-1 mr-4`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={containerRef}
            className={`flex gap-8 whitespace-nowrap will-change-transform animate-[marquee_24s_linear_infinite] ${paused ? "[animation-play-state:paused]" : ""}`}
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-8">
                {items.map((it, idx) => (
                  <span key={`${i}-${idx}`} className="flex items-center gap-1 text-xs sm:text-sm">
                    <span className="text-gray-500">{it.label}:</span>
                    <span className={`font-semibold ${it.color || ""}`}>{it.value}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md border-2 border-b-4 border-gray-200 hover:bg-gray-100 transition" title="GitHub">
            <Github className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-md border-2 border-b-4 border-gray-200 hover:bg-gray-100 transition" title="Account">
            <User className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setShowKeyModal(true)}
            className="bg-green-500 border-green-600 border-2 border-b-4 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition"
            title="Set CoinGecko API Key"
          >
            API Key
          </button>
        </div>
      </div>

      {/* Keyframes for marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          50% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>

      {/* CoinGecko API Key Modal (same pattern as Education) */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Enter CoinGecko API Key</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
            Your key is stored locally in this browser and never sent to our servers. You can get a free key from CoinGecko.
            </p>
            <input
              value={cgKey ?? ""}
              onChange={(e) => setCgKey(e.target.value)}
              placeholder="Paste your CoinGecko API key"
              className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            <div className="flex items-center justify-between mt-3">
              <a
                href="https://www.coingecko.com/en/api/pricing"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" /> Get an API Key
              </a>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCgKey}
                  className="px-3 py-2 text-sm rounded-lg border-2 border-gray-200"
                >
                  Clear
                </button>
                <button
                  onClick={saveCgKey}
                  className="px-3 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopBar;
