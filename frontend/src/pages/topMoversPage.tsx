import { useEffect, useState } from "react";
import StatusMessage from "../ui/StatusMessage";

interface CoinRow {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

const TopMovers = () => {
  const baseUrl =
    (import.meta as { env: { VITE_API_BASE_URL?: string } }).env
      .VITE_API_BASE_URL || "http://localhost:4000";

  const [gainers, setGainers] = useState<CoinRow[]>([]);
  const [losers, setLosers] = useState<CoinRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const cgKey = localStorage.getItem("pc_coingecko_api_key") || "";

        // Build URL with necessary query parameters
        const url = new URL(`${baseUrl}/api/coingecko/coins/markets`);
        url.searchParams.set("vs_currency", "usd");
        url.searchParams.set("order", "market_cap_desc");
        url.searchParams.set("per_page", "100");
        url.searchParams.set("page", "1");
        url.searchParams.set("sparkline", "false");

        const res = await fetch(url.toString(), {
          headers: cgKey ? { "x-cg-api-key": cgKey } : undefined,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        }

        const data: CoinRow[] = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response format (expected array)");
        }

        // Sort descending by 24h price change %
        const sorted = [...data].sort(
          (a, b) =>
            (b.price_change_percentage_24h ?? 0) -
            (a.price_change_percentage_24h ?? 0),
        );

        const topGainers = sorted
          .filter((c) => (c.price_change_percentage_24h ?? 0) > 0)
          .slice(0, 20);

        const topLosers = sorted
          .filter((c) => (c.price_change_percentage_24h ?? 0) < 0)
          .slice(-20)
          .reverse();

        setGainers(topGainers);
        setLosers(topLosers);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to fetch movers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseUrl]);

  return (
    <div className="max-w-[1224px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Top Movers</h1>
      {loading && <StatusMessage type="loading" message="Loading movers..." />}
      {error && <StatusMessage type="error" message={error} />}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoversTable title="Top Gainers (24h)" data={gainers} positive />
          <MoversTable title="Top Losers (24h)" data={losers} />
        </div>
      )}
    </div>
  );
};

const MoversTable = ({
  title,
  data,
  positive = false,
}: {
  title: string;
  data: CoinRow[];
  positive?: boolean;
}) => {
  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: n >= 1 ? 2 : 6,
    }).format(n);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-2 text-xs text-gray-500">Coin</th>
              <th className="text-right py-2 text-xs text-gray-500">Price</th>
              <th className="text-right py-2 text-xs text-gray-500">24h</th>
              <th className="text-right py-2 text-xs text-gray-500">Volume</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c) => (
              <tr key={c.id} className="border-b border-gray-50">
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {c.name}
                    </span>
                    <span className="text-xs text-gray-500 uppercase">
                      {c.symbol}
                    </span>
                  </div>
                </td>
                <td className="py-2 text-right text-sm font-semibold">
                  {formatCurrency(c.current_price)}
                </td>
                <td
                  className={`py-2 text-right text-sm font-semibold ${
                    positive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {positive && "+"}
                  {c.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="py-2 text-right text-sm">
                  ${c.total_volume.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopMovers;
