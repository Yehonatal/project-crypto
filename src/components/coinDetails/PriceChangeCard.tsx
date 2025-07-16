const PriceChangeCard = ({
    label,
    value,
}: {
    label: string;
    value?: number;
}) => {
    return (
        <div className="bg-white border rounded-lg shadow-sm px-4 py-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p
                className={`text-base font-semibold ${
                    value === undefined
                        ? "text-gray-400"
                        : value >= 0
                        ? "text-green-600"
                        : "text-red-600"
                }`}
            >
                {value === undefined
                    ? "N/A"
                    : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`}
            </p>
        </div>
    );
};

export default PriceChangeCard;
