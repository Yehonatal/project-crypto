import { useState, useEffect } from "react";
import { type CoinData } from "./types/types";
import CryptoCard from "./components/CoinCard";
import Header from "./components/Header";

function App() {
    const [coins, setCoins] = useState<CoinData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const baseUrl =
                    import.meta.env.VITE_API_BASE_URL ||
                    "http://localhost:4000";
                const response = await fetch(
                    `${baseUrl}/api/coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
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
    }, []);

    return (
        <div className="max-w-[1424px] mx-auto">
            <Header />
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
                        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coins.map((coin) => (
                                <CryptoCard key={coin.id} coin={coin} />
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
