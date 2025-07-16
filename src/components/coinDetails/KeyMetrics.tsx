import MetricCard from "./MetricCard";
import type { DetailedCoinData } from "../../types/types";

interface KeyMetricsProps {
    marketData: DetailedCoinData["market_data"];
}

const KeyMetrics = ({ marketData }: KeyMetricsProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <MetricCard
                label="Market Cap"
                value={`$${marketData.market_cap.usd.toLocaleString()}`}
                change={marketData.market_cap_change_percentage_24h}
            />
            <MetricCard
                label="Volume (24h)"
                value={`$${marketData.total_volume.usd.toLocaleString()}`}
            />
            <MetricCard
                label="Circulating Supply"
                value={marketData.circulating_supply.toLocaleString()}
            />
            <MetricCard
                label="Total Supply"
                value={marketData.total_supply.toLocaleString()}
            />
            <MetricCard
                label="Max Supply"
                value={
                    marketData.max_supply
                        ? marketData.max_supply.toLocaleString()
                        : "∞"
                }
            />
            <MetricCard
                label="FDV"
                value={`$${marketData.fully_diluted_valuation.usd.toLocaleString()}`}
            />
        </div>
    );
};

export default KeyMetrics;
