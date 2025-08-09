import { AlertCircle, Loader2 } from "lucide-react";
import { type StatusMessageProps } from "../types/types";
import { Link } from "react-router";

const StatusMessage = ({ type, message }: StatusMessageProps) => {
    const baseClasses =
        "flex flex-col items-center justify-center gap-4 px-6 py-10 ";

    const textBase =
        "text-center text-2xl sm:text-lg font-semibold leading-relaxed";

    if (type === "loading") {
        return (
            <div className={baseClasses}>
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75" />
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin relative z-10" />
                </div>
                <p className={`${textBase} text-gray-800`}>
                    {message || "Fetching crypto magic... 🪄"}
                </p>
            </div>
        );
    }

    if (type === "error") {
        return (
            <div className={baseClasses + " bg-red-50/40"}>
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full bg-red-200 animate-ping opacity-50" />
                    <div className="relative z-10 p-2 bg-red-100 rounded-full shadow-inner">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
                <p className={`${textBase} text-red-600`}>
                    {message || "Oops! Something went wrong 😓"}
                </p>
            </div>
        );
    }

    if (type === "404") {
        return (
            <div className={baseClasses + " bg-yellow-50/60"}>
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full bg-yellow-100 animate-ping opacity-50" />
                    <div className="relative z-10 p-2 bg-yellow-100 rounded-full shadow-inner">
                        <span
                            role="img"
                            aria-label="lost"
                            className="text-yellow-600 text-xl"
                        >
                            🧭
                        </span>
                    </div>
                </div>
                <p className={`${textBase} text-yellow-700`}>
                    Page not found. You may be lost in the blockchain 🌐
                </p>
                <Link
                    to="/"
                    className="text-sm font-extrabold text-blue-600 hover:underline transition-all"
                >
                    ← Back to homepage
                </Link>
            </div>
        );
    }

    return null;
};

export default StatusMessage;
