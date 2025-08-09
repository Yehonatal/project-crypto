import { useEffect, useState } from "react";
import StatusMessage from "../ui/StatusMessage";

interface TimelineEvent {
  date: string;
  title: string;
  desc: string;
}

const fallbackEvents: TimelineEvent[] = [
  {
    date: "2009-01-03",
    title: "Bitcoin Genesis Block",
    desc: "Satoshi mines the first block of Bitcoin.",
  },
  {
    date: "2015-07-30",
    title: "Ethereum Launch",
    desc: "Ethereum mainnet goes live enabling smart contracts.",
  },
  {
    date: "2020-05-11",
    title: "Bitcoin Halving",
    desc: "Third Bitcoin halving reduces block reward to 6.25 BTC.",
  },
  {
    date: "2021-04-14",
    title: "All-Time High Era",
    desc: "Bitcoin reaches then-ATH around $64k.",
  },
  {
    date: "2022-11-11",
    title: "FTX Collapse",
    desc: "FTX files for bankruptcy impacting market confidence.",
  },
];

const TimeLine = () => {
  const baseUrl =
    (import.meta as { env: { VITE_API_BASE_URL?: string } }).env
      .VITE_API_BASE_URL || "http://localhost:4000";
  const [events, setEvents] = useState<TimelineEvent[]>(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // CoinGecko status_updates is the closest public endpoint for timeline-like events
        const res = await fetch(
          `${baseUrl}/api/coingecko/status_updates?per_page=20&page=1`,
        );
        const json = await res.json();
        if (
          json?.status_updates &&
          Array.isArray(json.status_updates) &&
          json.status_updates.length > 0
        ) {
          const mapped: TimelineEvent[] = json.status_updates.map(
            (item: any) => ({
              date: item.created_at,
              title: item.project?.name || item.category || "Event",
              desc: item.description,
            }),
          );
          setEvents(mapped);
        } else {
          setEvents(fallbackEvents);
        }
      } catch (e) {
        setError(
          "Failed to fetch timeline events. Showing highlights instead.",
        );
        setEvents(fallbackEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
    // eslint-disable-next-line
  }, [baseUrl]);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Crypto Timeline</h1>
      {loading && (
        <StatusMessage type="loading" message="Loading timeline..." />
      )}
      {error && <StatusMessage type="error" message={error} />}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200 rounded" />
        <ul className="space-y-6">
          {events.map((e, idx) => (
            <li key={e.date + idx} className="relative pl-10">
              <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-500">
                  {new Date(e.date).toLocaleDateString()}
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {e.title}
                </div>
                <div className="text-sm text-gray-700">{e.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeLine;
