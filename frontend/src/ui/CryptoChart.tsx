import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { type CoinData } from "../types/types";

interface CryptoChartProps {
    coins: CoinData[];
    loading: boolean;
    error: string | null;
}

const CryptoChart = ({ coins, loading, error }: CryptoChartProps) => {
    const chartData = coins.slice(0, 5).map((coin: CoinData) => ({
        name: coin.name,
        price: coin.current_price,
    }));

    return (
        <div className="bg-white p-6 w-full max-w-3xl mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4 text-center">
                📊 Top 5 Coin Prices
            </h2>

            {loading && (
                <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {error && <p className="text-red-500 text-center">{error}</p>}

            {!loading && !error && (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default CryptoChart;
