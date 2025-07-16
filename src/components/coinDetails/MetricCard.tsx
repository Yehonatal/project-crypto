const MetricCard = ({
    label,
    value,
    change,
}: {
    label: string;
    value: string;
    change?: number;
}) => {
    return (
        <div className="bg-white border-2 border-b-5 border-gray-300 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-base font-semibold text-gray-800">{value}</p>
            {change !== undefined && (
                <p
                    className={`text-xs font-medium ${
                        change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {change >= 0 ? "+" : ""}
                    {change.toFixed(2)}%
                </p>
            )}
        </div>
    );
};

export default MetricCard;
