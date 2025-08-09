const OrderSelector = ({
    sortBy,
    onSetOrder,
}: {
    sortBy: string;
    onSetOrder: (order: string) => void;
}) => {
    return (
        <>
            <span className="font-light text-gray-600 text-sm">Order by</span>
            <select
                value={sortBy}
                onChange={(e) => onSetOrder(e.target.value)}
                className="border border-b-3 text-sm border-gray-200 rounded-md bg-gray-100 text-gray-700 p-1  ml-2 font-extrabold"
            >
                <option value="market_cap_desc">
                    Market Cap (High To Low)
                </option>
                <option value="market_cap_asc">Market Cap (Low To High)</option>
                <option value="price_desc">Price (High To Low)</option>
                <option value="price_asc">Price (Low To High)</option>
                <option value="change_desc">24h Change (High To Low)</option>
                <option value="change_asc">24h Change (Low To High)</option>
            </select>
        </>
    );
};

export default OrderSelector;
