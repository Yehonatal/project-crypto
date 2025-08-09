import { useState } from "react";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import type { CoinData } from "../../types/types";

interface CoinTableProps {
  coins: CoinData[];
}

const CoinTable = ({ coins }: CoinTableProps) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (coinId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(coinId)) {
      newFavorites.delete(coinId);
    } else {
      newFavorites.add(coinId);
    }
    setFavorites(newFavorites);
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price >= 1000) return `$${price.toLocaleString()}`;
    return `$${price.toFixed(2)}`;
  };

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    return (
      <span className={`font-semibold text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '▲ ' : '▼ '}{isPositive ? '+' : ''}{percentage.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="text-left py-3 px-2 font-medium text-gray-500 text-xs uppercase tracking-wide">#</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Coin</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Price</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">1h</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">24h</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">7d</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">24h Volume</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Market Cap</th>
            <th className="text-center py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wide">Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => {
            const isFavorite = favorites.has(coin.id);
            const priceChange24h = coin.price_change_percentage_24h || 0;
            const priceChange7d = coin.price_change_percentage_7d_in_currency || 0;
            const priceChange1h = coin.price_change_percentage_1h_in_currency || 0;

            return (
              <tr key={coin.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {/* Rank and Favorite */}
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFavorite(coin.id)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-gray-400'
                        }`}
                      />
                    </button>
                    <span className="font-medium text-gray-700 text-sm">{index + 1}</span>
                  </div>
                </td>

                {/* Coin Info */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        {coin.name}
                      </span>
                      <span className="text-gray-500 text-sm font-normal uppercase">
                        {coin.symbol}
                      </span>
                    </div>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors">
                      Buy
                    </button>
                  </div>
                </td>

                {/* Price */}
                <td className="py-3 px-4 text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    {formatPrice(coin.current_price)}
                  </div>
                </td>

                {/* 1h Change */}
                <td className="py-3 px-4 text-right">
                  {priceChange1h !== 0 ? formatPercentage(priceChange1h) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>

                {/* 24h Change */}
                <td className="py-3 px-4 text-right">
                  {formatPercentage(priceChange24h)}
                </td>

                {/* 7d Change */}
                <td className="py-3 px-4 text-right">
                  {priceChange7d !== 0 ? formatPercentage(priceChange7d) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>

                {/* 24h Volume */}
                <td className="py-3 px-4 text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    {formatNumber(coin.total_volume || 0)}
                  </div>
                </td>

                {/* Market Cap */}
                <td className="py-3 px-4 text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    {formatNumber(coin.market_cap)}
                  </div>
                </td>

                {/* 7 Day Chart Placeholder */}
                <td className="py-4 px-4 text-center">
                  <div className="w-20 h-12 mx-auto">
                    <div className={`w-full h-full rounded ${
                      priceChange7d >= 0 ? 'bg-green-100' : 'bg-red-100'
                    } flex items-center justify-center`}>
                      <div className={`w-16 h-8 rounded ${
                        priceChange7d >= 0 ? 'bg-green-200' : 'bg-red-200'
                      } relative overflow-hidden`}>
                        <div className={`absolute bottom-0 left-0 right-0 h-full ${
                          priceChange7d >= 0 ? 'bg-green-400' : 'bg-red-400'
                        } opacity-60 rounded`}
                        style={{
                          clipPath: 'polygon(0% 80%, 20% 60%, 40% 70%, 60% 40%, 80% 30%, 100% 20%, 100% 100%, 0% 100%)'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
