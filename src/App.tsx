import { useState, useEffect } from "react";
import { type CoinData } from "./types/types";
import Header from "./components/common/Header";

import Dashboard from "./pages/Dashboard";
import Compare from "./pages/Compare";
import StatusMessage from "./ui/StatusMessage";

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
                    <StatusMessage
                        type="loading"
                        message="Fetching latest crypto data..."
                    />
                )}

                {error && <StatusMessage type="error" message={error} />}
                {!loading && !error && (
                    <>
                        {" "}
                        <Dashboard
                            order={order}
                            setOrder={setOrder}
                            setLimit={setLimit}
                            filteredCoins={filteredCoins}
                        />
                        <Compare />
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
