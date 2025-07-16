import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { MarketChartData } from "../../types/types";
import type { CoinData } from "../../types/types";
import axios from "axios";

const CoinCard = ({ coin }: { coin: CoinData }) => {
    const [showMore, setShowMore] = useState(false);
    const [chartData, setChartData] = useState<MarketChartData[] | null>(null);
    const [loadingChart, setLoadingChart] = useState(false);
    const [chartError, setChartError] = useState<string | null>(null);

    // Generate dummy chart data
    useEffect(() => {
        if (showMore && !chartData) {
            setLoadingChart(true);
            setChartError(null);

            axios
                .get(
                    `${
                        import.meta.env.VITE_API_BASE_URL ||
                        "http://localhost:4000"
                    }/api/coingecko/coins/${
                        coin.id
                    }/market_chart?vs_currency=usd&days=7`,
                    {}
                )
                .then((res) => {
                    const formatted = res.data.prices.map(
                        ([timestamp, price]: [
                            MarketChartData["timestamp"],
                            MarketChartData["price"]
                        ]) => {
                            const date = new Date(timestamp);
                            const time = `${
                                date.getMonth() + 1
                            }/${date.getDate()}`;
                            return { time, price };
                        }
                    );
                    setChartData(formatted);
                })
                .catch((error) => {
                    setChartError("Failed to load chart data");
                    console.error(error);
                })
                .finally(() => {
                    setLoadingChart(false);
                });
        }
    }, [showMore, coin.id, chartData]);

    return (
        <li className="relative bg-white border-2 border-b-5 rounded-2xl border-gray-300 xl-glow p-4 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden">
            {/* Main Card Content */}
            <div
                className={`transition-opacity ${
                    showMore ? "opacity-40" : "opacity-100"
                }`}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-10 h-10 object-contain"
                        />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                {coin.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                💎 {coin.symbol.toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-extrabold">
                        Rank #{coin.market_cap_rank}
                    </span>
                </div>

                <div className="mb-4 flex items-top gap-4">
                    <p className="text-xl font-semibold text-gray-800 mb-1">
                        💰 ${coin.current_price.toLocaleString()}
                    </p>
                    <p
                        className={`text-sm font-medium ${
                            coin.price_change_percentage_24h >= 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        ⚡ 24h: {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="bg-gray-50 p-3">
                        <p className="text-xs text-gray-500 mb-1">Market Cap</p>
                        <p className="font-semibold text-gray-800">
                            ${coin.market_cap.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-gray-50 p-3">
                        <p className="text-xs text-gray-500 mb-1">
                            Volume (24h)
                        </p>
                        <p className="font-semibold text-gray-800">
                            ${coin.total_volume.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <div className="flex justify-end z-20">
                <button
                    onClick={() => setShowMore((prev) => !prev)}
                    className="text-blue-500 hover:text-blue-700 transition"
                >
                    {showMore ? (
                        <ChevronUp size={20} />
                    ) : (
                        <ChevronDown size={20} />
                    )}
                </button>
            </div>

            {/* Glass Overlay with Chart */}
            {showMore && (
                <div className="absolute inset-0 z-30 bg-black/5 backdrop-blur-sm xl-glow p-6 flex flex-col justify-between  animate-fadeIn text-gray-800">
                    {/* Close */}
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={() => setShowMore(false)}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            <ChevronUp size={22} />
                        </button>
                    </div>

                    {/* Chart or Loading/Error */}
                    <div className="h-32 mb-4 w-full">
                        {loadingChart ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="w-10 h-10 border-4 border--500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : chartError ? (
                            <p className="text-red-500 text-center">
                                {chartError}
                            </p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData || undefined}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" hide />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Extra Info */}
                    <div className="text-sm space-y-1 flex justify-between items-top">
                        <div>
                            <p>
                                🚀 ATH:{" "}
                                <span className="font-bold">
                                    ${coin.ath.toLocaleString()}
                                </span>
                            </p>
                            <p>
                                📉 Since ATH:{" "}
                                <span className="font-bold">
                                    {coin.ath_change_percentage.toFixed(2)}%
                                </span>
                            </p>
                            <p>
                                🪙 Circulating:{" "}
                                <span className="font-bold">
                                    {coin.circulating_supply.toLocaleString()}
                                </span>
                            </p>
                            <p>
                                🎯 Max Supply:{" "}
                                <span className="font-bold">
                                    {coin.max_supply
                                        ? coin.max_supply.toLocaleString()
                                        : "∞"}
                                </span>
                            </p>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                {coin.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                💎 {coin.symbol.toUpperCase()}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

export default CoinCard;
