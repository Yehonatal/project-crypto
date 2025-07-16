interface ToolTip {
    active: boolean;
    payload: any[];
    label?: string;
}
const CustomTooltip = ({ active, payload, label }: ToolTip) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const isPositive = value >= 0;

        return (
            <div className="bg-white p-3 border border-gray-200 rounded-lg ">
                <p className="font-medium text-gray-800">{label}</p>
                <p
                    className={`font-semibold ${
                        isPositive ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {isPositive ? "+" : ""}
                    {value.toFixed(2)}%
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
