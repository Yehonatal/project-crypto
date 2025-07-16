import { useState, useEffect } from "react";
import { type CoinData } from "./types/types";
import CryptoCard from "./components/CoinCard";
import Header from "./components/Header";
import LimitSelector from "./components/LimitSelector";
import OrderSelector from "./components/OrderSelector";

function App() {
    const [coins, setCoins] = useState<CoinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [limit, setLimit] = useState<number>(6);
    const [filter, setFiltered] = useState<string>("");
    const [order, setOrder] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl =
                    import.meta.env.VITE_API_BASE_URL ||
                    "http://localhost:4000";
                const response = await fetch(
                    `${baseUrl}/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
                );
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setCoins(data);
                setLoading(false);
                setError(null);
            } catch (err: Error | unknown) {
                setError((err as Error).message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [limit]);

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

    return (
        <div className="max-w-[1424px] mx-auto">
            <Header filter={filter} onFilterChange={setFiltered} />
            <div className="min-h-screen py-10 px-6">
                {loading && (
                    <p className="text-center text-blue-600 font-medium animate-pulse">
                        Loading...
                    </p>
                )}

                {error && (
                    <p className="text-center text-red-500 font-medium">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        {" "}
                        <div className="flex items-center gap-2 mb-4 justify-end ">
                            {/* Filter and Controls */}
                            <OrderSelector
                                sortBy={order}
                                onSetOrder={setOrder}
                            />
                            <LimitSelector setLimit={setLimit} />
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCoins.length > 0 ? (
                                filteredCoins.map((coin) => (
                                    <CryptoCard key={coin.id} coin={coin} />
                                ))
                            ) : (
                                <div>
                                    <h1>No coins found</h1>
                                </div>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
