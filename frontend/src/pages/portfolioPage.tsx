import { useMemo, useState } from "react";

// Mock user profile
const mockProfile = {
  name: "Jane Doe",
  email: "jane.doe@email.com",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  bio: "Crypto enthusiast. Building for the future.",
  joined: "2022-01-15",
  location: "London, UK",
};

interface Holding {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  quantity: number;
  price: number; // current price USD (mock or from props later)
  costBasis: number; // avg buy price USD
}

const mockHoldings: Holding[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    quantity: 0.25,
    price: 68000,
    costBasis: 52000,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    quantity: 1.8,
    price: 3500,
    costBasis: 2100,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    quantity: 15,
    price: 150,
    costBasis: 90,
  },
];

// Pie chart helper (returns array of {label, value, color})
const getPieData = (holdings: Holding[]) => {
  const colors = [
    "#16a34a",
    "#f59e42",
    "#6366f1",
    "#e11d48",
    "#0ea5e9",
    "#fbbf24",
  ];
  const total = holdings.reduce((sum, h) => sum + h.quantity * h.price, 0);
  return holdings.map((h, i) => ({
    label: h.symbol,
    value: Math.round(((h.quantity * h.price) / total) * 100),
    color: colors[i % colors.length],
  }));
};

const Portfolio = () => {
  const [holdings] = useState<Holding[]>(mockHoldings);

  const totals = useMemo(() => {
    const value = holdings.reduce((s, h) => s + h.quantity * h.price, 0);
    const cost = holdings.reduce((s, h) => s + h.quantity * h.costBasis, 0);
    const pnl = value - cost;
    const pnlPct = (pnl / (cost || 1)) * 100;
    return { value, cost, pnl, pnlPct };
  }, [holdings]);

  const fmt = (n: number) =>
    `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  const pieData = getPieData(holdings);

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-8">
      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <img
          src={mockProfile.avatar}
          alt={mockProfile.name}
          className="w-28 h-28 rounded-full border-4 border-green-200 shadow"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {mockProfile.name}
          </h1>
          <div className="text-gray-600 mb-2">{mockProfile.email}</div>
          <div className="text-gray-700 mb-2">{mockProfile.bio}</div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>
              Joined: {new Date(mockProfile.joined).toLocaleDateString()}
            </span>
            <span>Location: {mockProfile.location}</span>
          </div>
        </div>
      </div>

      {/* Portfolio Summary and Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">Total Value</div>
            <div className="text-xl font-bold text-gray-900">
              {fmt(totals.value)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">Cost Basis</div>
            <div className="text-xl font-bold text-gray-900">
              {fmt(totals.cost)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">Unrealized PnL</div>
            <div
              className={`text-xl font-bold ${totals.pnl >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {fmt(totals.pnl)}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500">PnL %</div>
            <div
              className={`text-xl font-bold ${totals.pnlPct >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {totals.pnlPct.toFixed(2)}%
            </div>
          </div>
        </div>
        {/* Asset Allocation Pie Chart */}
        <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-2">Asset Allocation</div>
          <svg width={120} height={120} viewBox="0 0 32 32" className="mb-2">
            {(() => {
              let acc = 0;
              return pieData.map((slice, i) => {
                const r = 16,
                  cx = 16,
                  cy = 16;
                const angle = (slice.value / 100) * 360;
                const x1 = cx + r * Math.cos((Math.PI * (acc - 90)) / 180);
                const y1 = cy + r * Math.sin((Math.PI * (acc - 90)) / 180);
                acc += angle;
                const x2 = cx + r * Math.cos((Math.PI * (acc - 90)) / 180);
                const y2 = cy + r * Math.sin((Math.PI * (acc - 90)) / 180);
                const largeArc = angle > 180 ? 1 : 0;
                return (
                  <path
                    key={slice.label}
                    d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`}
                    fill={slice.color}
                    stroke="#fff"
                    strokeWidth={0.5}
                  />
                );
              });
            })()}
          </svg>
          <div className="flex flex-wrap gap-2 justify-center">
            {pieData.map((slice) => (
              <span
                key={slice.label}
                className="flex items-center gap-1 text-xs"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: slice.color }}
                />
                {slice.label} ({slice.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
        <div className="text-lg font-semibold text-gray-900 mb-2">Holdings</div>
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left py-2 text-xs text-gray-500">Asset</th>
              <th className="text-right py-2 text-xs text-gray-500">Qty</th>
              <th className="text-right py-2 text-xs text-gray-500">Price</th>
              <th className="text-right py-2 text-xs text-gray-500">Value</th>
              <th className="text-right py-2 text-xs text-gray-500">
                Cost Basis
              </th>
              <th className="text-right py-2 text-xs text-gray-500">PnL</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => {
              const value = h.quantity * h.price;
              const cost = h.quantity * h.costBasis;
              const pnl = value - cost;
              return (
                <tr key={h.id} className="border-b border-gray-50">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200" />
                      <span className="text-sm font-medium text-gray-900">
                        {h.name}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">
                        {h.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 text-right">{h.quantity}</td>
                  <td className="py-2 text-right">{fmt(h.price)}</td>
                  <td className="py-2 text-right">{fmt(value)}</td>
                  <td className="py-2 text-right">{fmt(h.costBasis)}</td>
                  <td
                    className={`py-2 text-right ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {fmt(pnl)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Recent Activity (Mock) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
        <div className="text-lg font-semibold text-gray-900 mb-2">
          Recent Activity
        </div>
        <ul className="divide-y divide-gray-100 text-sm">
          <li className="py-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Bought <b>0.1 BTC</b> at $60,000 (Mar 2024)
          </li>
          <li className="py-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            Received <b>0.5 SOL</b> from friend (Feb 2024)
          </li>
          <li className="py-2 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            Sold <b>0.2 ETH</b> at $3,200 (Jan 2024)
          </li>
        </ul>
      </div>

      {/* Profile Quick Edit (Mock) */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="text-lg font-semibold text-gray-900 mb-2">
          Profile Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={mockProfile.name}
              disabled
              className="w-full rounded border-gray-200 px-3 py-2 text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={mockProfile.email}
              disabled
              className="w-full rounded border-gray-200 px-3 py-2 text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Location</label>
            <input
              type="text"
              value={mockProfile.location}
              disabled
              className="w-full rounded border-gray-200 px-3 py-2 text-sm bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Bio</label>
            <input
              type="text"
              value={mockProfile.bio}
              disabled
              className="w-full rounded border-gray-200 px-3 py-2 text-sm bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
