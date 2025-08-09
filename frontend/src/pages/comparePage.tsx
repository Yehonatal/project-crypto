import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Gauge,
} from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import StatusMessage from "../ui/StatusMessage";

type CoinSearchItem = {
  id: string;
  name: string;
  api_symbol?: string;
  symbol: string;
  market_cap_rank?: number;
  thumb: string;
  large: string;
};

type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
};

type ChartPoint = { timestamp: number; [coinId: string]: number };

const MAX_SELECTED = 5;

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]; // green, blue, amber, red, violet

function formatCurrency(num: number) {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPrice(price: number) {
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const Compare = () => {
  const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:4000";

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 300);
  const [searchResults, setSearchResults] = useState<CoinSearchItem[]>([]);
  const [selected, setSelected] = useState<CoinSearchItem[]>([
    { id: "bitcoin", name: "Bitcoin", symbol: "btc", thumb: "", large: "" },
    { id: "ethereum", name: "Ethereum", symbol: "eth", thumb: "", large: "" },
  ]);

  const [marketData, setMarketData] = useState<Record<string, MarketCoin>>({});
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const didMountRef = useRef(false);

  // Search coins
  useEffect(() => {
    const run = async () => {
      if (!debouncedQuery) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await fetch(`${baseUrl}/api/coingecko/search?query=${encodeURIComponent(debouncedQuery)}`);
        const json = await res.json();
        setSearchResults(json?.coins?.slice(0, 8) || []);
      } catch (e) {
        // ignore search errors
      }
    };
    run();
  }, [debouncedQuery, baseUrl]);

  const selectedIds = useMemo(() => selected.map((c) => c.id).join(","), [selected]);

  // Fetch markets for selected
  useEffect(() => {
    const run = async () => {
      if (!selected.length) {
        setMarketData({});
        setChartData([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const marketRes = await fetch(
          `${baseUrl}/api/coingecko/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
            selectedIds
          )}&price_change_percentage=7d,30d&sparkline=false`
        );
        if (!marketRes.ok) throw new Error("Failed to fetch market data");
        const marketJson: MarketCoin[] = await marketRes.json();
        const byId: Record<string, MarketCoin> = {};
        for (const coin of marketJson) byId[coin.id] = coin;
        setMarketData(byId);

        // Fetch charts in parallel (7d)
        const charts = await Promise.all(
          selected.map(async (c) => {
            const r = await fetch(
              `${baseUrl}/api/coingecko/coins/${c.id}/market_chart?vs_currency=usd&days=7`
            );
            const j = await r.json();
            return { id: c.id, prices: (j?.prices || []) as [number, number][] };
          })
        );

        // Merge to common dataset
        const map = new Map<number, ChartPoint>();
        for (const ch of charts) {
          for (const [ts, price] of ch.prices) {
            const key = Math.floor(ts / 3600000) * 3600000; // hour bucket
            const existing = map.get(key) || { timestamp: key } as ChartPoint;
            existing[ch.id] = price;
            map.set(key, existing);
          }
        }
        const merged = Array.from(map.values()).sort((a, b) => a.timestamp - b.timestamp);
        setChartData(merged);
      } catch (e: any) {
        setError(e.message || "Failed to fetch comparison data");
      } finally {
        setLoading(false);
      }
    };

    // Skip first mount if selections are default
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
    run();
  }, [selectedIds, baseUrl]);

  const addSelection = (coin: CoinSearchItem) => {
    if (selected.find((c) => c.id === coin.id)) return;
    if (selected.length >= MAX_SELECTED) return;
    setSelected((s) => [...s, coin]);
    setQuery("");
    setSearchResults([]);
  };

  const removeSelection = (id: string) => setSelected((s) => s.filter((c) => c.id !== id));

  // Normalize metrics for radar
  const radarData = useMemo(() => {
    if (!selected.length) return [] as any[];
    const metrics = ["market_cap", "total_volume", "current_price"] as const;
    const rows: any[] = [];

    // compute max for normalization
    const max: Record<string, number> = {};
    for (const m of metrics) {
      max[m] = Math.max(
        1,
        ...selected.map((c) => (marketData[c.id] ? (marketData[c.id] as any)[m] || 0 : 0))
      );
    }

    for (const m of metrics) {
      const row: any = { metric: m.replace(/_/g, " ") };
      for (let i = 0; i < selected.length; i++) {
        const id = selected[i].id;
        const val = marketData[id] ? (marketData[id] as any)[m] || 0 : 0;
        row[id] = Number(((val / max[m]) * 100).toFixed(2));
      }
      rows.push(row);
    }
    return rows;
  }, [selected, marketData]);

  return (
    <div className="max-w-[1224px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Gauge className="w-6 h-6 text-green-600" /> Compare Cryptocurrencies
        </h1>
        <p className="text-gray-600 mt-1">
          Select up to {MAX_SELECTED} coins to compare prices, changes, market cap, and more. Data powered by CoinGecko.
        </p>
      </div>

      {/* Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {selected.map((c, i) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-b-4 border-gray-200 bg-white text-sm font-medium"
              style={{ borderColor: "#e5e7eb" }}
            >
              <img src={c.thumb || c.large || marketData[c.id]?.image} className="w-5 h-5 rounded-full" alt={c.name} />
              <span>{c.name}</span>
              <button
                onClick={() => removeSelection(c.id)}
                className="text-gray-500 hover:text-red-600"
                aria-label={`Remove ${c.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}

          {selected.length < MAX_SELECTED && (
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 border-2 border-b-4 border-gray-200 rounded-lg bg-white">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search coins (e.g. solana)"
                  className="outline-none text-sm w-56"
                />
              </div>
              {!!searchResults.length && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-64 overflow-y-auto">
                  {searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => addSelection(r)}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left"
                    >
                      <img src={r.thumb} className="w-5 h-5 rounded-full" alt={r.name} />
                      <span className="text-sm font-medium text-gray-900">{r.name}</span>
                      <span className="text-xs text-gray-500 uppercase">{r.symbol}</span>
                      {typeof r.market_cap_rank === "number" && (
                        <span className="ml-auto text-xs text-gray-500">#{r.market_cap_rank}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setSelected([])}
            className="ml-auto text-sm text-gray-600 hover:text-gray-900"
          >
            Clear all
          </button>
        </div>
      </div>

      {loading && <StatusMessage type="loading" message="Loading comparison data..." />}
      {error && <StatusMessage type="error" message={error} />}

      {!loading && !error && selected.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {selected.map((c, idx) => {
              const coin = marketData[c.id];
              if (!coin) return null;
              const up = (coin.price_change_percentage_24h || 0) >= 0;
              return (
                <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden">
                      <img src={coin.image} alt={coin.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{coin.name}</div>
                      <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">#{coin.market_cap_rank}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xl font-bold text-gray-900">{formatPrice(coin.current_price)}</div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        up ? "text-green-600" : "text-red-600"
                      }`}>
                        {up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {(up ? "+" : "") + (coin.price_change_percentage_24h || 0).toFixed(2)}%
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>Market Cap</div>
                      <div className="font-semibold text-gray-900">{formatCurrency(coin.market_cap)}</div>
                      <div className="mt-1">24h Vol</div>
                      <div className="font-semibold text-gray-900">{formatCurrency(coin.total_volume)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <LineChart className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-gray-900">7D Price Comparison</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={chartData} margin={{ left: 8, right: 16, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(t) => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${v >= 1000 ? Math.round(v) : v}`}/>
                    <Tooltip
                      contentStyle={{ fontSize: 12 }}
                      formatter={(value: any, name: any) => [formatPrice(Number(value)), name]}
                      labelFormatter={(label: any) => new Date(label).toLocaleString()}
                    />
                    <Legend />
                    {selected.map((c, i) => (
                      <Line key={c.id} type="monotone" dataKey={c.id} stroke={COLORS[i % COLORS.length]} dot={false} strokeWidth={2} />
                    ))}
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <h3 className="font-semibold text-gray-900">Metric Radar</h3>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius={90}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis tick={false} />
                    {selected.map((c, i) => (
                      <Radar key={c.id} name={c.name} dataKey={c.id} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.35} />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Metrics Table */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Key Metrics</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-500 uppercase">Metric</th>
                    {selected.map((c, i) => (
                      <th key={c.id} className="text-right py-2 px-2 text-xs font-medium text-gray-500 uppercase">
                        <div className="flex items-center justify-end gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          {c.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-2 text-sm font-medium text-gray-700">Price</td>
                    {selected.map((c) => (
                      <td key={c.id} className="py-3 px-2 text-right text-sm font-semibold text-gray-900">
                        {marketData[c.id] ? formatPrice(marketData[c.id].current_price) : "-"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-2 text-sm font-medium text-gray-700">24h Change</td>
                    {selected.map((c) => {
                      const v = marketData[c.id]?.price_change_percentage_24h || 0;
                      const up = v >= 0;
                      return (
                        <td key={c.id} className={`py-3 px-2 text-right text-sm font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
                          {(up ? "+" : "") + v.toFixed(2)}%
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-2 text-sm font-medium text-gray-700">Market Cap</td>
                    {selected.map((c) => (
                      <td key={c.id} className="py-3 px-2 text-right text-sm font-semibold text-gray-900">
                        {marketData[c.id] ? formatCurrency(marketData[c.id].market_cap) : "-"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-2 text-sm font-medium text-gray-700">24h Volume</td>
                    {selected.map((c) => (
                      <td key={c.id} className="py-3 px-2 text-right text-sm font-semibold text-gray-900">
                        {marketData[c.id] ? formatCurrency(marketData[c.id].total_volume) : "-"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-2 text-sm font-medium text-gray-700">7d Change</td>
                    {selected.map((c) => {
                      const v = marketData[c.id]?.price_change_percentage_7d_in_currency ?? 0;
                      const up = (v || 0) >= 0;
                      return (
                        <td key={c.id} className={`py-3 px-2 text-right text-sm font-semibold ${up ? "text-green-600" : "text-red-600"}`}>
                          {(up ? "+" : "") + (v || 0).toFixed(2)}%
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && !error && selected.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Add coins to compare</h3>
          <p className="text-gray-600">Use the search above to select up to {MAX_SELECTED} cryptocurrencies.</p>
        </div>
      )}
    </div>
  );
};

export default Compare;
