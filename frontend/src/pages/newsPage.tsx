import { useEffect, useState } from "react";
import StatusMessage from "../ui/StatusMessage";

interface UpdateItem {
  project: { name: string; image: { large: string } };
  description: string;
  category: string;
  created_at: string;
}

const News = () => {
  const baseUrl =
    (import.meta as { env: { VITE_API_BASE_URL?: string } }).env
      .VITE_API_BASE_URL || "http://localhost:4000";
  const [items, setItems] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const key = localStorage.getItem("pc_coingecko_api_key") || "";
        const res = await fetch(
          `${baseUrl}/api/coingecko/status_updates?per_page=30&page=1`,
          {
            headers: key ? { "x-cg-api-key": key } : undefined,
          },
        );
        const json = await res.json();
        setItems(json?.status_updates || []);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message || "Failed to fetch news");
        } else {
          setError("Failed to fetch news");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [baseUrl]);

  return (
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Crypto News</h1>
      {loading && <StatusMessage type="loading" message="Loading news..." />}
      {error && <StatusMessage type="error" message={error} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {items.map((u, i) => (
            <article
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3"
            >
              <img
                src={u.project?.image?.large}
                className="w-10 h-10 rounded"
              />
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  {new Date(u.created_at).toLocaleString()} · {u.category}
                </div>
                <div className="text-gray-900 text-sm whitespace-pre-wrap">
                  {u.description}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {u.project?.name}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
