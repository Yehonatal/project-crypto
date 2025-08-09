import { Users, Star } from "lucide-react";
import type { DetailedCoinData } from "../../types/types";

interface CommunityDevelopmentProps {
    coin: DetailedCoinData;
}

const CommunityDevelopment = ({ coin }: CommunityDevelopmentProps) => {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white  p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Users size={18} />
                    Community
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Watchlist Users</span>
                        <span className="font-semibold">
                            {coin.watchlist_portfolio_users.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            Reddit Subscribers
                        </span>
                        <span className="font-semibold">
                            {coin.community_data.reddit_subscribers.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Sentiment (Up)</span>
                        <span className="font-semibold text-green-600">
                            {coin.sentiment_votes_up_percentage.toFixed(1)}%
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Sentiment (Down)</span>
                        <span className="font-semibold text-red-600">
                            {coin.sentiment_votes_down_percentage.toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white  p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Star size={18} />
                    Development
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">GitHub Stars</span>
                        <span className="font-semibold">
                            {coin.developer_data.stars.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Forks</span>
                        <span className="font-semibold">
                            {coin.developer_data.forks.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Contributors</span>
                        <span className="font-semibold">
                            {coin.developer_data.pull_request_contributors}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Commits (4w)</span>
                        <span className="font-semibold">
                            {coin.developer_data.commit_count_4_weeks}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityDevelopment;
