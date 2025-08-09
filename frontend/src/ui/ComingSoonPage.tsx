import { Construction } from "lucide-react";
import { type ComingSoonPageProps } from "../types/types";

const ComingSoonPage = ({ title, description }: ComingSoonPageProps) => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 text-center">
            <div className="max-w-xl">
                <div className="flex justify-center mb-4 text-yellow-500">
                    <Construction size={48} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl mb-3">
                    {title} Page Coming Soon 🚧
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                    {description ||
                        `We're working hard to build the ${title.toLowerCase()} feature. Check back soon!`}
                </p>
            </div>
        </div>
    );
};

export default ComingSoonPage;
