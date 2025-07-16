import CryptoCard from "../components/common/CoinCard";
import LimitSelector from "../components/dashboard/LimitSelector";
import OrderSelector from "../components/dashboard/OrderSelector";
import type { CoinData } from "../types/types";

interface DashboardProp {
    order: string;
    setOrder: (order: string) => void;
    setLimit: (limit: number) => void;
    filteredCoins: CoinData[];
}

const Dashboard = ({
    order,
    setOrder,
    setLimit,
    filteredCoins,
}: DashboardProp) => {
    return (
        <>
            <div className="flex items-center gap-2 mb-4 justify-end ">
                {/* Filter and Controls */}
                <OrderSelector sortBy={order} onSetOrder={setOrder} />
                <LimitSelector setLimit={setLimit} />
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoins.length > 0 ? (
                    filteredCoins.map((coin: CoinData) => (
                        <CryptoCard key={coin.id} coin={coin} />
                    ))
                ) : (
                    <div>
                        <h1>No coins found</h1>
                    </div>
                )}
            </ul>
        </>
    );
};

export default Dashboard;
