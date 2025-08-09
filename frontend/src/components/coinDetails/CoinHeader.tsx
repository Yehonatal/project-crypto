import { ArrowUp, ArrowDown, Calendar } from "lucide-react";
import type { DetailedCoinData } from "../../types/types";

interface CoinHeaderProps {
    coin: DetailedCoinData;
    currentPrice: number;
    priceChange24h: number;
    isUp: boolean;
}

const CoinHeader = ({
    coin,
    currentPrice,
    priceChange24h,
    isUp,
}: CoinHeaderProps) => {
    return (
        <div className="bg-white rounded-xl border-2 border-gray-300 border-b-5 p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <img
                        src={coin.image.large}
                        alt={coin.name}
                        className="w-16 h-16"
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {coin.name} ({coin.symbol.toUpperCase()})
                        </h1>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="bg-blue-100 font-extrabold text-blue-800 px-4 py-1 rounded-full text-sm">
                                Rank #{coin.market_cap_rank}
                            </span>
                            {coin.genesis_date && (
                                <div className="text-gray-600 flex items-center gap-2">
                                    <span className="gap-2 text-sm">
                                        <Calendar size={14} />
                                    </span>
                                    <span className="font-extralight">
                                        {new Date(
                                            coin.genesis_date
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="ml-auto">
                    <div className="text-right">
                        <p className="text-3xl font-bold text-gray-800">
                            ${currentPrice.toLocaleString()}
                        </p>
                        <div
                            className={`flex items-center justify-end gap-1 text-lg font-semibold ${
                                isUp ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {isUp ? (
                                <ArrowUp size={18} />
                            ) : (
                                <ArrowDown size={18} />
                            )}
                            {priceChange24h.toFixed(2)}% (24h)
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories */}
            {coin.categories.length > 0 && (
                <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                        {coin.categories.slice(0, 6).map((category, index) => (
                            <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoinHeader;
