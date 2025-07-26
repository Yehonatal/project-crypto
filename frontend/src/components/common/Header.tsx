import { Search, Star } from "lucide-react";
import TopBar from "./TopBar.tsx";
import { Link } from "react-router";

interface SearchCoin {
    filter: string;
    onFilterChange: (filter: string) => void;
}

const Header = ({ filter, onFilterChange }: SearchCoin) => {
    return (
        <div>
            <TopBar />
            <header className="w-full bg-white sm:px-6 py-3 flex items-center justify-between text-sm text-gray-700">
                {/* Left: Logo + Nav Links */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-black">
                                💰{" "}
                            </p>
                            <span className="text-lg font-semibold text-black">
                                Project Crypto
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 font-bold text-gray-600">
                        <Link to="/compare" className="hover:text-black">
                            Compare
                        </Link>
                        <Link to="/top_movers" className="hover:text-black">
                            Top Movers
                        </Link>
                        <Link to="/roi_calculator" className="hover:text-black">
                            ROI Calculator
                        </Link>
                        <Link to="/timeline" className="hover:text-black">
                            Timeline
                        </Link>
                        <Link to="/education" className="hover:text-black">
                            Education
                        </Link>
                        <Link to="/news" className="hover:text-black">
                            News
                        </Link>
                    </nav>
                </div>

                {/* Right: Features + Search */}
                <div className="flex items-center gap-4 ">
                    {/* Feature Links */}
                    <div className="hidden sm:flex items-center gap-3">
                        <Link
                            to="/portfolio"
                            className="flex items-center gap-1 hover:text-black  font-bold"
                        >
                            <Star size={16} className="text-yellow-400" />
                            Portfolio
                        </Link>
                    </div>

                    {/* Search Input */}
                    <div className="relative  font-bold">
                        <input
                            type="text"
                            placeholder="Search"
                            value={filter}
                            onChange={(e) => onFilterChange(e.target.value)}
                            aria-placeholder="Search"
                            className="pl-9 pr-6 py-1.5 border-b-2 border-gray-200 rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2  focus:ring-gray-200"
                        />
                        <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" />
                        <div className="absolute right-1 top-1.5 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-500">
                            /
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
