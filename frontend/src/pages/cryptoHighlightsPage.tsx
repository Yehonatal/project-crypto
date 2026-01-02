import { useState, useEffect } from "react";

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

interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap_rank: number;
}

const CryptoHighlightsPage = () => {
    const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
    const [topGainers, setTopGainers] = useState<CoinData[]>([]);
    const [topLosers, setTopLosers] = useState<CoinData[]>([]);
    const [newCoins, setNewCoins] = useState<CoinData[]>([]);
    const [mostViewed, setMostViewed] = useState<CoinData[]>([]);
    const [activeTab, setActiveTab] = useState("highlights");
    const [loading, setLoading] = useState(true);

    const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

    useEffect(() => {
        const fetchHighlightsData = async () => {
            try {
                // Fetch trending coins
                const trendingResponse = await fetch(
                    `${baseUrl}/api/coingecko/search/trending`
                );
                const trendingResult = await trendingResponse.json();
                setTrendingData(trendingResult);

                // Fetch coins market data for gainers/losers
                const marketResponse = await fetch(
                    `${baseUrl}/api/coingecko/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
                );
                const marketResult = await marketResponse.json();

                // Split into gainers and losers
                const gainers = marketResult
                    .filter(
                        (coin: CoinData) => coin.price_change_percentage_24h > 0
                    )
                    .slice(0, 8);
                const losers = marketResult
                    .filter(
                        (coin: CoinData) => coin.price_change_percentage_24h < 0
                    )
                    .slice(-8)
                    .reverse();

                setTopGainers(gainers);
                setTopLosers(losers);

                // Fetch newest coins (using recently added sorting)
                const newCoinsResponse = await fetch(
                    `${baseUrl}/api/coingecko/coins/markets?vs_currency=usd&order=id&per_page=8&page=1&sparkline=false`
                );
                const newCoinsResult = await newCoinsResponse.json();
                setNewCoins(newCoinsResult);

                // Use popular coins as "most viewed" (top market cap)
                const popularResponse = await fetch(
                    `${baseUrl}/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&sparkline=false`
                );
                const popularResult = await popularResponse.json();
                setMostViewed(popularResult);
            } catch (error) {
                console.error("Error fetching highlights data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHighlightsData();
    }, [baseUrl]);

    const formatPrice = (price: number) => {
        if (price < 0.01) return `$${price.toFixed(6)}`;
        if (price < 1) return `$${price.toFixed(4)}`;
        if (price >= 1000) return `$${price.toLocaleString()}`;
        return `$${price.toFixed(2)}`;
    };

    const formatPercentage = (percentage: number) => {
        const isPositive = percentage >= 0;
        return (
            <span
                className={`font-semibold ${
                    isPositive ? "text-green-600" : "text-red-600"
                }`}
            >
                {isPositive ? "▲ " : "▼ "}
                {isPositive ? "+" : ""}
                {percentage.toFixed(1)}%
            </span>
        );
    };

    const tabs = [
        { id: "all", label: "All", icon: "📊" },
        { id: "highlights", label: "Highlights", icon: "📋", active: true },
        { id: "categories", label: "Categories", icon: "📚" },
        {
            id: "airdrop",
            label: "Airdropped Tokens by NFT Projects",
            icon: "🪂",
        },
        { id: "solana", label: "Solana Meme", icon: "🟣" },
        { id: "achan", label: "4chan-Themed", icon: "🐸" },
    ];

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-64 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Crypto Highlights
                </h1>
                <p className="text-gray-600">
                    Which cryptocurrencies are people more interested in? Track
                    and discover the most interesting cryptocurrencies based on
                    market and CoinGecko activity.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-8 overflow-x-auto border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                            activeTab === tab.id
                                ? "border-green-500 text-green-600 bg-green-50"
                                : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trending Coins */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500 text-xl">🔥</span>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Trending Coins
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            more →
                        </a>
                    </div>

                    <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 font-medium mb-3 pb-2 border-b border-gray-100">
                            <span>Coin</span>
                            <span className="text-right">Price</span>
                            <span className="text-right">24h</span>
                            <span></span>
                        </div>

                        {trendingData?.coins.slice(0, 8).map((trending) => (
                            <div
                                key={trending.item.id}
                                className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-gray-50 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={trending.item.thumb}
                                        alt={trending.item.name}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span className="font-medium text-gray-900 text-sm truncate">
                                        {trending.item.name}
                                    </span>
                                </div>
                                <div className="text-right text-sm font-medium">
                                    $4,194.57
                                </div>
                                <div className="text-right">
                                    <span className="text-green-600 font-semibold text-sm">
                                        ▲ 7.6%
                                    </span>
                                </div>
                                <div></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Gainers */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 text-xl">🚀</span>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Top Gainers
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            more →
                        </a>
                    </div>

                    <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 font-medium mb-3 pb-2 border-b border-gray-100">
                            <span>Coin</span>
                            <span className="text-right">Price</span>
                            <span className="text-right">24h</span>
                            <span></span>
                        </div>

                        {topGainers.slice(0, 8).map((gainer) => (
                            <div
                                key={gainer.id}
                                className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-gray-50 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={gainer.image}
                                        alt={gainer.name}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span className="font-medium text-gray-900 text-sm truncate">
                                        {gainer.symbol.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right text-sm font-medium">
                                    {formatPrice(gainer.current_price)}
                                </div>
                                <div className="text-right">
                                    {formatPercentage(
                                        gainer.price_change_percentage_24h
                                    )}
                                </div>
                                <div></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Losers */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-red-500 text-xl">📉</span>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Top Losers
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            more →
                        </a>
                    </div>

                    <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 font-medium mb-3 pb-2 border-b border-gray-100">
                            <span>Coin</span>
                            <span className="text-right">Price</span>
                            <span className="text-right">24h</span>
                            <span></span>
                        </div>

                        {topLosers.slice(0, 8).map((loser) => (
                            <div
                                key={loser.id}
                                className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-gray-50 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={loser.image}
                                        alt={loser.name}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span className="font-medium text-gray-900 text-sm truncate">
                                        {loser.symbol.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right text-sm font-medium">
                                    {formatPrice(loser.current_price)}
                                </div>
                                <div className="text-right">
                                    {formatPercentage(
                                        loser.price_change_percentage_24h
                                    )}
                                </div>
                                <div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row - New Coins, Token Unlocks, Most Viewed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* New Coins */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-500 text-xl">✨</span>
                            <h2 className="text-lg font-semibold text-gray-900">
                                New Coins
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            more →
                        </a>
                    </div>

                    <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 font-medium mb-3 pb-2 border-b border-gray-100">
                            <span>Coin</span>
                            <span className="text-right">Price</span>
                            <span className="text-right">24h</span>
                            <span></span>
                        </div>

                        {newCoins.slice(0, 8).map((coin) => (
                            <div
                                key={coin.id}
                                className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-gray-50 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={coin.image}
                                        alt={coin.name}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span className="font-medium text-gray-900 text-sm truncate">
                                        {coin.symbol.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right text-sm font-medium">
                                    {formatPrice(coin.current_price)}
                                </div>
                                <div className="text-right">
                                    {formatPercentage(
                                        coin.price_change_percentage_24h
                                    )}
                                </div>
                                <div></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Incoming Token Unlocks */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500 text-xl">🔓</span>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Incoming Token Unlocks
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            more →
                        </a>
                    </div>

                    <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 font-medium mb-3 pb-2 border-b border-gray-100">
                            <span>Coin</span>
                            <span className="text-right">Next Unlock Date</span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                        M
                                    </span>
                                </div>
                                <span className="font-medium text-gray-900 text-sm">
                                    Movement
                                </span>
                            </div>
                            <div className="text-right text-sm">
                                0d 02h 10m 41s
                            </div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">
                                        R
                                    </span>
                                </div>
                                <span className="font-medium text-gray-900 text-sm">
                                    Render
                                </span>
                            </div>
                            <div className="text-right text-sm">
                                0d 14h 10m 41s
                            </div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>

                {/* Most Viewed */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xl">👁</span>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Most Viewed
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            more →
                        </a>
                    </div>

                    <div className="space-y-1">
                        <div className="grid grid-cols-4 gap-4 text-xs text-gray-500 font-medium mb-3 pb-2 border-b border-gray-100">
                            <span>Coin</span>
                            <span className="text-right">Price</span>
                            <span className="text-right">24h</span>
                            <span></span>
                        </div>

                        {mostViewed.slice(0, 8).map((coin) => (
                            <div
                                key={coin.id}
                                className="grid grid-cols-4 gap-4 items-center py-2 hover:bg-gray-50 rounded"
                            >
                                <div className="flex items-center gap-2">
                                    <img
                                        src={coin.image}
                                        alt={coin.name}
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span className="font-medium text-gray-900 text-sm truncate">
                                        {coin.symbol.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-right text-sm font-medium">
                                    {formatPrice(coin.current_price)}
                                </div>
                                <div className="text-right">
                                    {formatPercentage(
                                        coin.price_change_percentage_24h
                                    )}
                                </div>
                                <div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CryptoHighlightsPage;
