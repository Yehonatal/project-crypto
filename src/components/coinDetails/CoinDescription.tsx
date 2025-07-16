import type { DetailedCoinData } from "../../types/types";

interface CoinDescriptionProps {
    coin: DetailedCoinData;
}

const CoinDescription = ({ coin }: CoinDescriptionProps) => {
    if (!coin.description.en) return null;

    return (
        <div className="bg-white p-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                About {coin.name}
            </h2>
            <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                    __html: coin.description.en,
                }}
            />
        </div>
    );
};

export default CoinDescription;
