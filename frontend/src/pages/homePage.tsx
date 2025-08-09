import { useState } from "react";
import { Grid3X3, List, Settings } from "lucide-react";
import { useNavigate } from "react-router";
import CryptoCard from "../components/common/CoinCard";
import CoinTable from "../components/common/CoinTable";
import LimitSelector from "../components/dashboard/LimitSelector";
import OrderSelector from "../components/dashboard/OrderSelector";
import MarketOverview from "../components/common/MarketOverview";
import type { CoinData } from "../types/types";

interface HomeProp {
    order: string;
    filter: string;
    setOrder: (order: string) => void;
    setLimit: (limit: number) => void;
    coins: CoinData[];
}

const Home = ({ order, filter, setOrder, setLimit, coins }: HomeProp) => {
    const [viewMode, setViewMode] = useState<"cards" | "table">("table");
    const [activeCategory, setActiveCategory] = useState("all");
    const navigate = useNavigate();
    const filteredCoins = coins
        .filter((coin) => {
            return (
                coin.name.toLowerCase().includes(filter.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(filter.toLowerCase())
            );
        })
        .slice()
        .sort((a: CoinData, b: CoinData): number => {
            switch (order) {
                case "market_cap_desc":
                    return b.market_cap - a.market_cap;
                case "market_cap_asc":
                    return a.market_cap - b.market_cap;
                case "price_desc":
                    return b.current_price - a.current_price;
                case "price_asc":
                    return a.current_price - b.current_price;
                case "change_desc":
                    return (
                        b.price_change_percentage_24h -
                        a.price_change_percentage_24h
                    );
                case "change_asc":
                    return (
                        a.price_change_percentage_24h -
                        b.price_change_percentage_24h
                    );
                default:
                    return 0;
            }
        });

    const categories = [
        { id: "all", label: "All", icon: "📊", active: true },
        { id: "highlights", label: "Highlights", icon: "📋" },
        { id: "categories", label: "Categories", icon: "📚" },
        { id: "ai-meme", label: "AI Meme", icon: "🔥" },
        { id: "stablecoin", label: "Stablecoin Protocol", icon: "💰" },
        { id: "pumpfun", label: "Pump.fun Ecosystem", icon: "🎮" },
        { id: "customize", label: "Customize", icon: "", isCustomize: true },
    ];

    const handleCategoryClick = (categoryId: string) => {
        if (categoryId === "highlights") {
            navigate("/crypto-highlights");
            return;
        }
        setActiveCategory(categoryId);
    };

    // Filter coins based on active category
    const getCategoryFilteredCoins = () => {
        switch (activeCategory) {
            case "ai-meme":
                return filteredCoins.filter(
                    (coin) =>
                        coin.name.toLowerCase().includes("ai") ||
                        coin.name.toLowerCase().includes("meme") ||
                        coin.symbol.toLowerCase().includes("ai")
                );
            case "stablecoin":
                return filteredCoins.filter(
                    (coin) =>
                        coin.name.toLowerCase().includes("usd") ||
                        coin.symbol.toLowerCase().includes("usdt") ||
                        coin.symbol.toLowerCase().includes("usdc") ||
                        coin.name.toLowerCase().includes("tether")
                );
            default:
                return filteredCoins;
        }
    };

    const categoryFilteredCoins = getCategoryFilteredCoins();

    return (
        <>
            <MarketOverview />

            {/* Coins List Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        All Cryptocurrencies
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Browse and filter all available cryptocurrencies
                    </p>
                </div>
                {/* Category Tabs */}
                <div className="flex items-center gap-1 mb-6 overflow-x-auto">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-lg ${
                                activeCategory === category.id
                                    ? "bg-white border border-gray-300 text-gray-700"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            {category.isCustomize ? (
                                <Settings className="w-4 h-4 text-gray-400" />
                            ) : (
                                <span
                                    className={
                                        activeCategory === category.id
                                            ? "text-green-600"
                                            : ""
                                    }
                                >
                                    {category.icon}
                                </span>
                            )}
                            {category.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 mb-4 justify-between">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                            View:
                        </span>
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    viewMode === "table"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <List className="w-4 h-4" />
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode("cards")}
                                className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                                    viewMode === "cards"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-600 hover:text-gray-900"
                                }`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                                Cards
                            </button>
                        </div>
                    </div>

                    {/* Filter and Controls */}
                    <div className="flex items-center gap-2">
                        <OrderSelector sortBy={order} onSetOrder={setOrder} />
                        <LimitSelector setLimit={setLimit} />
                    </div>
                </div>
                {categoryFilteredCoins.length > 0 ? (
                    viewMode === "table" ? (
                        <CoinTable coins={categoryFilteredCoins} />
                    ) : (
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryFilteredCoins.map((coin: CoinData) => (
                                <li
                                    key={coin.id}
                                    className="relative bg-white border-2 border-b-5 rounded-2xl border-gray-300 xl-glow p-4 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between overflow-hidden"
                                >
                                    <CryptoCard coin={coin} />
                                </li>
                            ))}
                        </ul>
                    )
                ) : (
                    <div className="text-center py-12">
                        <h1 className="text-lg text-gray-600">
                            No coins found
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {activeCategory === "all"
                                ? "Try adjusting your search or filter criteria"
                                : `No coins found in the ${
                                      categories.find(
                                          (c) => c.id === activeCategory
                                      )?.label
                                  } category`}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
