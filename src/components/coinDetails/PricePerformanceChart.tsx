import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";
import CustomTooltip from "../../ui/CustomToolTip";

interface PricePerformanceChartProps {
    marketData: {
        price_change_percentage_1h_in_currency?: { usd?: number };
        price_change_percentage_24h: number;
        price_change_percentage_7d: number;
        price_change_percentage_30d: number;
        price_change_percentage_60d: number;
        price_change_percentage_1y: number;
    };
}

const PricePerformanceChart = ({ marketData }: PricePerformanceChartProps) => {
    const chartData = [
        {
            period: "1h",
            change: marketData.price_change_percentage_1h_in_currency?.usd || 0,
            label: "1 Hour",
        },
        {
            period: "24h",
            change: marketData.price_change_percentage_24h,
            label: "24 Hours",
        },
        {
            period: "7d",
            change: marketData.price_change_percentage_7d,
            label: "7 Days",
        },
        {
            period: "30d",
            change: marketData.price_change_percentage_30d,
            label: "30 Days",
        },
        {
            period: "60d",
            change: marketData.price_change_percentage_60d,
            label: "60 Days",
        },
        {
            period: "1y",
            change: marketData.price_change_percentage_1y,
            label: "1 Year",
        },
    ];

    const formatYAxisTick = (value: number) => {
        return `${value >= 0 ? "+" : ""}${value.toFixed(0)}%`;
    };

    // Determine line color based on overall trend
    const overallTrend = chartData[chartData.length - 1].change;
    const lineColor = overallTrend >= 0 ? "#10b981" : "#ef4444";

    return (
        <div className="bg-white rounded-xl  p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} />
                Price Performance
            </h2>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="period"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748b" }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            tickFormatter={formatYAxisTick}
                        />
                        <Tooltip
                            content={
                                <CustomTooltip
                                    active={true}
                                    payload={chartData}
                                />
                            }
                        />
                        <Line
                            type="monotone"
                            dataKey="change"
                            stroke={lineColor}
                            strokeWidth={3}
                            dot={{
                                r: 6,
                                fill: lineColor,
                                strokeWidth: 2,
                                stroke: "#ffffff",
                            }}
                            activeDot={{
                                r: 8,
                                fill: lineColor,
                                strokeWidth: 2,
                                stroke: "#ffffff",
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Summary stats below chart */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6 pt-6 border-t border-gray-100">
                {chartData.map((item) => (
                    <div key={item.period} className="text-center">
                        <p className="text-xs text-gray-500 mb-1">
                            {item.period}
                        </p>
                        <p
                            className={`text-sm font-semibold ${
                                item.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {item.change >= 0 ? "+" : ""}
                            {item.change.toFixed(2)}%
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricePerformanceChart;
