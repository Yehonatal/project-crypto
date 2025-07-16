import type { DetailedCoinData } from "../../types/types";

interface ATHATLSectionProps {
    marketData: DetailedCoinData["market_data"];
}

const ATHATLSection = ({ marketData }: ATHATLSectionProps) => {
    return (
        <div className="grid md:grid-cols-2 gap-6 p-6 border-2 border-b-5 border-gray-300  justify-between rounded-xl">
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    All-Time High
                </h3>
                <div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">
                            ${marketData.ath.usd.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            {new Date(
                                marketData.ath_date.usd
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div
                        className={`text-sm font-medium ${
                            marketData.ath_change_percentage.usd >= 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {marketData.ath_change_percentage.usd.toFixed(2)}% from
                        ATH
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                    All-Time Low
                </h3>
                <div>
                    <div>
                        <p className="text-2xl font-bold text-red-600">
                            ${marketData.atl.usd.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            {new Date(
                                marketData.atl_date.usd
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div
                        className={`text-sm font-medium ${
                            marketData.atl_change_percentage.usd >= 0
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        {marketData.atl_change_percentage.usd.toLocaleString()}%
                        from ATL
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ATHATLSection;
