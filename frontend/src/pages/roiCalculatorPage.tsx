import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const ROICalculator = () => {
  const [amount, setAmount] = useState(1000);
  const [buyPrice, setBuyPrice] = useState(10000);
  const [sellPrice, setSellPrice] = useState(12000);
  const [feePct, setFeePct] = useState(0.1); // in %

  const result = useMemo((): {
    qty: number;
    gross: number;
    fees: number;
    profit: number;
    roi: number;
  } => {
    const qty = amount / buyPrice;
    const gross = qty * sellPrice;
    const fees = amount * (feePct / 100) + gross * (feePct / 100);
    const profit = gross - amount - fees;
    const roi = (profit / amount) * 100;
    return { qty, gross, fees, profit, roi };
  }, [amount, buyPrice, sellPrice, feePct]);

  const fmt = (n: number) =>
    `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <div className="max-w-[720px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">ROI Calculator</h1>

      {/* Educational Section */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-green-700 mb-2">
          What is ROI?
        </h2>
        <p className="text-gray-700 mb-2">
          <strong>ROI</strong> stands for <strong>Return on Investment</strong>.
          It measures how much profit or loss you make on an investment relative
          to the amount of money you put in.
        </p>
        <ul className="list-disc pl-5 text-gray-700 mb-2">
          <li>
            <strong>Formula:</strong>{" "}
            <span className="font-mono">
              ROI = (Profit / Investment) × 100%
            </span>
          </li>
          <li>
            <strong>Example:</strong> If you invest $1,000 and later your
            investment is worth $1,200, your profit is $200. Your ROI is{" "}
            <span className="font-mono">(200 / 1000) × 100% = 20%</span>.
          </li>
        </ul>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-700">Want to learn more?</span>
          <Link
            to={{
              pathname: "/education",
              search: "?q=What is ROI in crypto investing?",
            }}
            className="inline-block px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
          >
            Ask the AI Tutor
          </Link>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm text-gray-700">
            Investment Amount (USD)
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </label>
          <label className="text-sm text-gray-700">
            Buy Price (USD)
            <input
              type="number"
              min={0}
              value={buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </label>
          <label className="text-sm text-gray-700">
            Sell Price (USD)
            <input
              type="number"
              min={0}
              value={sellPrice}
              onChange={(e) => setSellPrice(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </label>
          <label className="text-sm text-gray-700">
            Fees (%)
            <input
              type="number"
              min={0}
              step={0.01}
              value={feePct}
              onChange={(e) => setFeePct(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </label>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-gray-600">Estimated Quantity</div>
            <div className="text-lg font-semibold text-gray-900">
              {result.qty.toFixed(6)}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-gray-600">Gross Value</div>
            <div className="text-lg font-semibold text-gray-900">
              {fmt(result.gross)}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-gray-600">Fees</div>
            <div className="text-lg font-semibold text-gray-900">
              {fmt(result.fees)}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-gray-600">Profit</div>
            <div
              className={`text-lg font-semibold ${
                result.profit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {fmt(result.profit)}
            </div>
          </div>
        </div>

        {/* ROI */}
        <div className="text-center">
          <div className="text-sm text-gray-600">ROI</div>
          <div
            className={`text-2xl font-bold ${
              result.roi >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.roi.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
