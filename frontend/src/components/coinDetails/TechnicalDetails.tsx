import { Code } from "lucide-react";
import type { DetailedCoinData } from "../../types/types";

interface TechnicalDetailsProps {
    coin: DetailedCoinData;
}

const TechnicalDetails = ({ coin }: TechnicalDetailsProps) => {
    return (
        <div className="bg-white p-2 mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Code size={20} />
                Technical Details
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <p className="text-sm text-gray-600">Hashing Algorithm</p>
                    <p className="font-semibold">{coin.hashing_algorithm}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Block Time</p>
                    <p className="font-semibold">
                        {coin.block_time_in_minutes} minutes
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Market Cap Rank</p>
                    <p className="font-semibold">#{coin.market_cap_rank}</p>
                </div>
            </div>
        </div>
    );
};

export default TechnicalDetails;
