import { useEffect, useState } from "react";
import { type DetailedCoinData } from "../types/types";
import axios from "axios";
import StatusMessage from "../ui/StatusMessage";
import { useParams } from "react-router";

// Component imports
import CoinHeader from "../components/coinDetails/CoinHeader";
import KeyMetrics from "../components/coinDetails/KeyMetrics";
import TechnicalDetails from "../components/coinDetails/TechnicalDetails";
import CoinDescription from "../components/coinDetails/CoinDescription";
import PricePerformanceChart from "../components/coinDetails/PricePerformanceChart";
import ATHATLSection from "../components/coinDetails/ATHATLSection";
import CommunityDevelopment from "../components/coinDetails/CommunityDevelopment";
import LinksSection from "../components/coinDetails/LinksSection";
import TopMarketsTable from "../components/coinDetails/TopMarketsTable";

const CoinDetailsPage = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState<DetailedCoinData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get(
                `${
                    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
                }/api/coingecko/coins/${id}`,
                {}
            )
            .then((res) => {
                setCoin(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch coin details.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading)
        return <StatusMessage type="loading" message="Loading coin data..." />;

    if (error || !coin)
        return (
            <StatusMessage type="404" message={error || "Coin not found."} />
        );

    const marketData = coin.market_data;
    const currentPrice = marketData.current_price.usd;
    const priceChange24h = marketData.price_change_percentage_24h;
    const isUp = priceChange24h >= 0;

    return (
        <div className="mx-auto px-2 py-2 space-y-2">
            {/* Header Section */}
            <CoinHeader
                coin={coin}
                currentPrice={currentPrice}
                priceChange24h={priceChange24h}
                isUp={isUp}
            />

            <div className="flex my-10">
                <div className="flex-2">
                    {/* Technical Details */}
                    <TechnicalDetails coin={coin} />

                    {/* Description */}
                    <CoinDescription coin={coin} />
                </div>

                <div className="flex-1">
                    {/* Price Performance Chart */}
                    <PricePerformanceChart marketData={marketData} />
                </div>
            </div>

            {/* ATH/ATL and KeyMetrics Section */}
            <div className="flex gap-2 my-10">
                <ATHATLSection marketData={marketData} />
                <KeyMetrics marketData={marketData} />
            </div>

            {/* Top Markets */}
            <div className="my-10">
                <TopMarketsTable coin={coin} />
            </div>

            {/* Community Stuff*/}
            <div className="mt-10">
                <CommunityDevelopment coin={coin} />
                <LinksSection coin={coin} />
            </div>
        </div>
    );
};

export default CoinDetailsPage;
