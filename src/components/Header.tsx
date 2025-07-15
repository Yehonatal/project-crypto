import { Search, Star } from "lucide-react";
import TopBar from "./TopBar.tsx";

const Header = () => {
    return (
        <div>
            <TopBar />
            <header className="w-full bg-white sm:px-6 py-3 flex items-center justify-between text-sm text-gray-700">
                {/* Left: Logo + Nav Links */}
                <div className="flex items-center gap-8">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <p className="text-lg font-semibold text-black">💰 </p>
                        <span className="text-lg font-semibold text-black">
                            Project Crypto
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex items-center gap-6 font-bold text-gray-600">
                        <a href="#" className="hover:text-black">
                            Dashboard
                        </a>
                        <a href="#" className="hover:text-black">
                            Compare
                        </a>
                        <a href="#" className="hover:text-black">
                            Top Movers
                        </a>
                        <a href="#" className="hover:text-black">
                            ROI Calculator
                        </a>
                        <a href="#" className="hover:text-black">
                            Timeline
                        </a>
                        <a href="#" className="hover:text-black">
                            Education
                        </a>
                        <a href="#" className="hover:text-black">
                            News
                        </a>
                    </nav>
                </div>

                {/* Right: Features + Search */}
                <div className="flex items-center gap-4 ">
                    {/* Feature Links */}
                    <div className="hidden sm:flex items-center gap-3">
                        <a
                            href="#"
                            className="flex items-center gap-1 hover:text-black  font-bold"
                        >
                            <Star size={16} className="text-yellow-400" />
                            Portfolio
                        </a>
                    </div>

                    {/* Search Input */}
                    <div className="relative  font-bold">
                        <input
                            type="text"
                            placeholder="Search"
                            className="pl-9 pr-6 py-1.5 border-b-2 border-gray-200 rounded-md bg-gray-100 text-gray-700 focus:outline-none focus:ring-2  focus:ring-gray-200"
                        />
                        <Search className="absolute left-2 top-1.5 w-4 h-4 text-gray-400" />
                        <div className="absolute right-1 top-1.5 px-1.5 py-0.5 text-xs rounded bg-gray-200 text-gray-500">
                            /
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;
