import CryptoCard from "../components/common/CoinCard";
import LimitSelector from "../components/dashboard/LimitSelector";
import OrderSelector from "../components/dashboard/OrderSelector";
import type { CoinData } from "../types/types";

interface HomeProp {
    order: string;
    filter: string;
    setOrder: (order: string) => void;
    setLimit: (limit: number) => void;
    coins: CoinData[];
}

const Home = ({ order, filter, setOrder, setLimit, coins }: HomeProp) => {
    const filteredCoins = coins
        .filter((coin) => {
            return (
                coin.name.toLowerCase().includes(filter.toLowerCase()) ||
                coin.symbol.toLowerCase().includes(filter.toLowerCase())
            );
        })
        .slice()
        .sort((a: CoinData, b: CoinData): number => {
            switch (order) {
                case "market_cap_desc":
                    return b.market_cap - a.market_cap;
                case "market_cap_asc":
                    return a.market_cap - b.market_cap;
                case "price_desc":
                    return b.current_price - a.current_price;
                case "price_asc":
                    return a.current_price - b.current_price;
                case "change_desc":
                    return (
                        b.price_change_percentage_24h -
                        a.price_change_percentage_24h
                    );
                case "change_asc":
                    return (
                        a.price_change_percentage_24h -
                        b.price_change_percentage_24h
                    );
                default:
                    return 0;
            }
        });

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

export default Home;
