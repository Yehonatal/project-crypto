import { useState, useEffect } from "react";
import { type CoinData } from "./types/types";

import Home from "./pages/homePage";
import Header from "./components/common/Header";
import StatusMessage from "./ui/StatusMessage";

import { Routes, Route } from "react-router";
import Compare from "./pages/comparePage";
import Education from "./pages/educationPage";
import News from "./pages/newsPage";
import Portfolio from "./pages/portfolioPage";
import ROICalculator from "./pages/roiCalculatorPage";
import TopMovers from "./pages/topMoversPage";
import TimeLine from "./pages/timelinePage";
import NotFound from "./pages/notFoundPage";
import CoinDetailsPage from "./pages/coinDetailsPage";

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

    return (
        <>
            <div className="max-w-[1424px] mx-auto">
                <Header filter={filter} onFilterChange={setFiltered} />
                <div className="min-h-screen py-10 px-6">
                    {loading && (
                        <StatusMessage
                            type="loading"
                            message="Fetching latest crypto data..."
                        />
                    )}
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    {error && (
                                        <StatusMessage
                                            type="error"
                                            message={error}
                                        />
                                    )}
                                    {!loading && !error && (
                                        <>
                                            {" "}
                                            <Home
                                                order={order}
                                                setOrder={setOrder}
                                                setLimit={setLimit}
                                                coins={coins}
                                                filter={filter}
                                            />
                                        </>
                                    )}
                                </>
                            }
                        />
                        <Route path="/coin/:id" element={<CoinDetailsPage />} />
                        <Route path="/compare" element={<Compare />} />
                        <Route path="/top_movers" element={<TopMovers />} />
                        <Route
                            path="/roi_calculator"
                            element={<ROICalculator />}
                        />
                        <Route path="/education" element={<Education />} />
                        <Route path="/timeline" element={<TimeLine />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default App;
