const LimitSelector = ({ setLimit }: { setLimit: (limit: number) => void }) => {
    return (
        <>
            <span className="font-light text-gray-600 text-sm">Show</span>
            <select
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-b-3 border-gray-200 rounded-md bg-gray-100 text-gray-700 p-1  ml-2 font-extrabold"
            >
                <option value="6">6</option>
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </>
    );
};

export default LimitSelector;
