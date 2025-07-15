import { Github, User } from "lucide-react";

const TopBar = () => {
    return (
        <div className="w-full bg-white px-6 py-2 text-sm text-gray-700 flex justify-between items-center">
            {/* Left Section: Stats */}
            <div className="flex flex-wrap gap-4 text-xs sm:text-sm items-center">
                <span>
                    <span className="text-gray-500">Coins:</span>{" "}
                    <span className="font-semibold">17,662</span>
                </span>
                <span>
                    <span className="text-gray-500">Exchanges:</span>{" "}
                    <span className="font-semibold">1,316</span>
                </span>
                <span>
                    <span className="text-gray-500">Market Cap:</span>{" "}
                    <span className="font-semibold">$3.76T</span>{" "}
                    <span className="text-red-500 font-medium">▼ 5.1%</span>
                </span>
                <span>
                    <span className="text-gray-500">24h Vol:</span>{" "}
                    <span className="font-semibold">$214.746B</span>
                </span>
                <span>
                    <span className="text-gray-500">Dominance:</span>{" "}
                    <span className="font-semibold">BTC 61.9%</span>{" "}
                    <span className="font-semibold">ETH 9.77%</span>
                </span>
                <span>
                    <span className="text-gray-500">Gas:</span>{" "}
                    <span className="font-semibold text-indigo-600">
                        3.654 GWEI
                    </span>
                </span>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-md border-2 border-b-4 border-gray-200 hover:bg-gray-100 transition">
                    <Github className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 rounded-md border-2 border-b-4 border-gray-200 hover:bg-gray-100 transition">
                    <User className="w-4 h-4 text-gray-600" />
                </button>
                <button className="bg-green-500 border-green-600 border-2 border-b-4 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition">
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default TopBar;
