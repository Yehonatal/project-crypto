import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface GlobalData {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    market_cap_change_percentage_24h_usd: number;
  };
}

interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
  };
}

interface TrendingData {
  coins: TrendingCoin[];
}

interface TopGainer {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
}

const MarketOverview = () => {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [topGainers, setTopGainers] = useState<TopGainer[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch global market data
        const globalResponse = await fetch(`${baseUrl}/api/coingecko/global`);
        const globalResult = await globalResponse.json();
        setGlobalData(globalResult);

        // Fetch trending coins
        const trendingResponse = await fetch(`${baseUrl}/api/coingecko/search/trending`);
        const trendingResult = await trendingResponse.json();
        setTrendingData(trendingResult);

        // Fetch top gainers (using coins/markets with price change filter)
        const gainersResponse = await fetch(
          `${baseUrl}/api/coingecko/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`
        );
        const gainersResult = await gainersResponse.json();
        setTopGainers(gainersResult.filter((coin: TopGainer) => coin.price_change_percentage_24h > 0).slice(0, 3));

      } catch (error) {
        console.error("Error fetching market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [baseUrl]);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)} Trillion`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)} Billion`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)} Million`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const marketCapChange = globalData?.data?.market_cap_change_percentage_24h_usd || 0;
  const isPositiveChange = marketCapChange >= 0;

  return (
    <div className="mb-8">
      {/* Header Section - Exact CoinGecko Style */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Cryptocurrency Prices by Market Cap
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-green-700 font-medium">Highlights</span>
            <span className="text-green-600">✓</span>
          </div>
        </div>
        
        <div className="text-gray-600 text-sm">
          <span>The global cryptocurrency market cap today is </span>
          <span className="font-bold text-gray-900">
            {globalData ? formatNumber(globalData.data.total_market_cap.usd) : "$4.02 Trillion"}
          </span>
          <span>, a </span>
          <span className={`font-semibold ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveChange ? '▲ ' : '▼ '}{isPositiveChange ? '+' : ''}{marketCapChange.toFixed(1)}% change
          </span>
          <span> in the last 24 hours. </span>
          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
            Read more
          </a>
        </div>
      </div>

      {/* Market Stats - Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Market Cap Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600 text-sm">Market Cap</span>
            <div className={`flex items-center gap-1 ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveChange ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-semibold text-sm">{marketCapChange.toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            {globalData ? formatNumber(globalData.data.total_market_cap.usd) : "$4,021,366,219,282"}
          </div>
          {/* Simple green line chart simulation */}
          <div className="h-12 relative">
            <svg className="w-full h-full" viewBox="0 0 300 48">
              <path
                d="M0,35 Q50,30 75,25 T150,20 Q200,18 225,15 T300,12"
                stroke={isPositiveChange ? "#10b981" : "#ef4444"}
                strokeWidth="2"
                fill="none"
                className="opacity-80"
              />
              <path
                d="M0,35 Q50,30 75,25 T150,20 Q200,18 225,15 T300,12 L300,48 L0,48 Z"
                fill={isPositiveChange ? "#10b981" : "#ef4444"}
                className="opacity-10"
              />
            </svg>
          </div>
        </div>

        {/* 24h Trading Volume */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <span className="text-gray-600 text-sm">24h Trading Volume</span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            {globalData ? formatNumber(globalData.data.total_volume.usd) : "$138,053,003,553"}
          </div>
          {/* Simple red line chart simulation */}
          <div className="h-12 relative">
            <svg className="w-full h-full" viewBox="0 0 300 48">
              <path
                d="M0,20 Q75,25 100,30 T200,35 Q250,32 275,28 T300,25"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                className="opacity-80"
              />
              <path
                d="M0,20 Q75,25 100,30 T200,35 Q250,32 275,28 T300,25 L300,48 L0,48 Z"
                fill="#ef4444"
                className="opacity-10"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Three Column Section - Trending, Top Gainers, Top Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-500 text-lg">🔥</span>
            <h3 className="font-semibold text-gray-900">Trending</h3>
            <a href="#" className="ml-auto text-blue-600 hover:text-blue-700 text-sm">
              View more →
            </a>
          </div>
          <div className="space-y-3">
            {trendingData?.coins.slice(0, 3).map((trending) => (
              <div key={trending.item.id} className="flex items-center gap-3">
                <img 
                  src={trending.item.thumb} 
                  alt={trending.item.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{trending.item.name}</div>
                  <div className="text-xs text-gray-500">#{trending.item.market_cap_rank}</div>
                </div>
                <div className="text-green-600 font-semibold text-sm">
                  ▲ 7.6%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-green-500 text-lg">🚀</span>
            <h3 className="font-semibold text-gray-900">Top Gainers</h3>
            <a href="#" className="ml-auto text-blue-600 hover:text-blue-700 text-sm">
              View more →
            </a>
          </div>
          <div className="space-y-3">
            {topGainers.slice(0, 3).map((gainer) => (
              <div key={gainer.id} className="flex items-center gap-3">
                <img 
                  src={gainer.image} 
                  alt={gainer.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{gainer.symbol.toUpperCase()}</div>
                  <div className="text-xs text-gray-500">{formatPrice(gainer.current_price)}</div>
                </div>
                <div className="text-green-600 font-semibold text-sm">
                  ▲ {gainer.price_change_percentage_24h.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-red-500 text-lg">📉</span>
            <h3 className="font-semibold text-gray-900">Top Losers</h3>
            <a href="#" className="ml-auto text-blue-600 hover:text-blue-700 text-sm">
              View more →
            </a>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">B</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Blackhole</div>
                <div className="text-xs text-gray-500">$0.6451</div>
              </div>
              <div className="text-red-600 font-semibold text-sm">
                ▼ 22.7%
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">B</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Block</div>
                <div className="text-xs text-gray-500">$0.1916</div>
              </div>
              <div className="text-red-600 font-semibold text-sm">
                ▼ 15.0%
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">S</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">Siren</div>
                <div className="text-xs text-gray-500">$0.078</div>
              </div>
              <div className="text-red-600 font-semibold text-sm">
                ▼ 14.7%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
