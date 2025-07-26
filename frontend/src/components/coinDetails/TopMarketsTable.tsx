import type { DetailedCoinData } from "../../types/types";

interface TopMarketsTableProps {
    coin: DetailedCoinData;
}

const TopMarketsTable = ({ coin }: TopMarketsTableProps) => {
    return (
        <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                Top Markets
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-gray-500 text-sm">
                            <th className="text-left py-3 font-medium">#</th>
                            <th className="text-left py-3 font-medium">
                                Exchange
                            </th>
                            <th className="text-left py-3 font-medium">Pair</th>
                            <th className="text-right py-3 font-medium">
                                Price
                            </th>
                            <th className="text-right py-3 font-medium">
                                Spread
                            </th>
                            <th className="text-right py-3 font-medium">
                                +2% Depth
                            </th>
                            <th className="text-right py-3 font-medium">
                                -2% Depth
                            </th>
                            <th className="text-right py-3 font-medium">
                                24h Volume
                            </th>
                            <th className="text-right py-3 font-medium">
                                Volume %
                            </th>
                            <th className="text-center py-3 font-medium">
                                Confidence
                            </th>
                            <th className="text-right py-3 font-medium">
                                Updated
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {coin.tickers.slice(0, 10).map((ticker, index) => {
                            const totalVolume = coin.tickers.reduce(
                                (sum, t) => sum + t.converted_volume.usd,
                                0
                            );
                            const volumePercentage =
                                (ticker.converted_volume.usd / totalVolume) *
                                100;
                            const updatedTime = new Date(ticker.last_traded_at);
                            const now = new Date();
                            const timeDiff = Math.floor(
                                (now.getTime() - updatedTime.getTime()) /
                                    (1000 * 60)
                            );

                            return (
                                <tr
                                    key={index}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4 text-gray-600 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="py-4">
                                        <a
                                            href={ticker.trade_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            {ticker.market.name}
                                        </a>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {ticker.base}
                                            </span>
                                            <span className="text-gray-400">
                                                /
                                            </span>
                                            <span className="text-gray-600">
                                                {ticker.target}
                                            </span>
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                                                Spot
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right font-medium text-gray-900">
                                        $
                                        {ticker.converted_last.usd.toLocaleString(
                                            undefined,
                                            {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )}
                                    </td>
                                    <td className="py-4 text-right text-gray-600">
                                        {ticker.bid_ask_spread_percentage.toFixed(
                                            2
                                        )}
                                        %
                                    </td>
                                    <td className="py-4 text-right text-gray-600">
                                        $
                                        {(
                                            ticker.converted_volume.usd * 0.02
                                        ).toLocaleString(undefined, {
                                            maximumFractionDigits: 0,
                                        })}
                                    </td>
                                    <td className="py-4 text-right text-gray-600">
                                        $
                                        {(
                                            ticker.converted_volume.usd * 0.02
                                        ).toLocaleString(undefined, {
                                            maximumFractionDigits: 0,
                                        })}
                                    </td>
                                    <td className="py-4 text-right font-medium text-gray-900">
                                        $
                                        {ticker.converted_volume.usd.toLocaleString(
                                            undefined,
                                            {
                                                maximumFractionDigits: 0,
                                            }
                                        )}
                                    </td>
                                    <td className="py-4 text-right text-gray-600">
                                        {volumePercentage.toFixed(2)}%
                                    </td>
                                    <td className="py-4 text-center">
                                        <div className="flex items-center justify-center">
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    ticker.trust_score ===
                                                    "green"
                                                        ? "bg-green-500"
                                                        : ticker.trust_score ===
                                                          "yellow"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-right text-gray-500 text-sm">
                                        {timeDiff < 60
                                            ? `${timeDiff}m ago`
                                            : timeDiff < 1440
                                            ? `${Math.floor(
                                                  timeDiff / 60
                                              )}h ago`
                                            : `${Math.floor(
                                                  timeDiff / 1440
                                              )}d ago`}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopMarketsTable;
