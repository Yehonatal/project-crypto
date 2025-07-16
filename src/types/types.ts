export interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    total_volume: number;
    price_change_percentage_24h: number;
    ath: number;
    ath_change_percentage: number;
    circulating_supply: number;
    max_supply: number;
}

export interface MarketChartData {
    timestamp: number;
    price: number;
}

export interface ComingSoonPageProps {
    title: string;
    description?: string;
}

export interface StatusMessageProps {
    type: "loading" | "error";
    message?: string;
}
