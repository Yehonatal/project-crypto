import { Globe, Info, Code, Users, TrendingUp } from "lucide-react";
import type { DetailedCoinData } from "../../types/types";

interface LinksSectionProps {
    coin: DetailedCoinData;
}

const LinksSection = ({ coin }: LinksSectionProps) => {
    return (
        <div className="bg-white p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Globe size={20} />
                Links & Resources
            </h2>
            <div className="flex gap-10">
                {coin.links.homepage[0] && (
                    <a
                        href={coin.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <Globe size={18} className="text-gray-500" />
                        <span>Website</span>
                    </a>
                )}
                {coin.links.whitepaper && (
                    <a
                        href={coin.links.whitepaper}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <Info size={18} className="text-gray-500" />
                        <span>Whitepaper</span>
                    </a>
                )}
                {coin.links.repos_url.github[0] && (
                    <a
                        href={coin.links.repos_url.github[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <Code size={18} className="text-gray-500" />
                        <span>GitHub Repository</span>
                    </a>
                )}
                {coin.links.subreddit_url && (
                    <a
                        href={coin.links.subreddit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <Users size={18} className="text-gray-500" />
                        <span>Reddit Community</span>
                    </a>
                )}
                {coin.links.twitter_screen_name && (
                    <a
                        href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <svg
                            className="w-[18px] h-[18px] text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                        <span>Twitter</span>
                    </a>
                )}
                {coin.links.blockchain_site[0] && (
                    <a
                        href={coin.links.blockchain_site[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <TrendingUp size={18} className="text-gray-500" />
                        <span>Blockchain Explorer</span>
                    </a>
                )}
                {coin.links.official_forum_url[0] && (
                    <a
                        href={coin.links.official_forum_url[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        <Users size={18} className="text-gray-500" />
                        <span>Official Forum</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default LinksSection;
