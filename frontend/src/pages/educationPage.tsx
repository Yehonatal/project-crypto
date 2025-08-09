import { useEffect, useMemo, useRef, useState } from "react";
import { Brain, Send, Sparkles, User, Bot, KeyRound, X, Shield, Wand2, Clipboard, Check, RefreshCcw, ArrowDown } from "lucide-react";
import StatusMessage from "../ui/StatusMessage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Lazy import Gemini so the page loads even if the SDK isn't installed yet
let GoogleGenerativeAI: any;
(async () => {
  try {
    const mod = await import("@google/generative-ai");
    GoogleGenerativeAI = mod.GoogleGenerativeAI;
  } catch (e) {
    // SDK not installed yet; we'll show a helpful message instead of crashing
    console.error(e); 
    
  }
})();

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

type ExperienceLevel = "beginner" | "intermediate" | "advanced";

const LOCAL_STORAGE_KEY = {
  geminiKey: "pc_gemini_api_key",
  level: "pc_edu_level",
};

const SUGGESTIONS: Record<ExperienceLevel, string[]> = {
  beginner: [
    "What is Bitcoin in simple terms?",
    "How do I keep my crypto safe?",
    "What is a seed phrase and why is it important?",
    "What is the difference between a coin and a token?",
    "How do I buy my first crypto legally and safely?",
  ],
  intermediate: [
    "Explain blockchain vs. DAGs with examples",
    "What is staking and how do rewards work?",
    "Compare self-custody vs. exchange wallets",
    "What are gas fees and how can I reduce them?",
    "What is the role of market cap and FDV in valuation?",
  ],
  advanced: [
    "Walk me through EVM internals and gas accounting",
    "How to evaluate tokenomics sustainability?",
    "Explain MEV and common mitigation techniques",
    "Compare L2 designs: optimistic vs. zk rollups",
    "Risk model for CEX vs. DEX liquidity fragmentation",
  ],
};

function createSystemPrompt(level: ExperienceLevel) {
  const base = `You are CryptoTutor, a friendly and responsible AI educator inside a crypto market app. 
Style: concise, structured, practical, and empathetic. Use short paragraphs, bullet points, and examples.
Safety: never provide financial or legal advice; include neutral risk notes when relevant. If a topic is high risk, add a "Caution" callout.
Visual style: use inline emoji sparingly to signal tone (e.g., ✅, ⚠️, 💡), and prefer lists and steps.
Links: when suggesting further reading, prefer vendor-neutral docs, standards, and well-known references.
`;

  if (level === "beginner")
    return (
      base +
      `Audience: absolute beginner. Avoid jargon; define terms in plain English. Use analogies and real-world examples.
If user asks for investments, respond with education-only material (concepts, risks, frameworks) and disclaimers.
End answers with a short "Key takeaways" list.`
    );
  if (level === "intermediate")
    return (
      base +
      `Audience: has used exchanges/wallets. Introduce light technical details (addresses, private keys, gas, staking).
Add quick comparison tables when helpful. Include best practices checklists.`
    );
  return (
    base +
    `Audience: advanced practitioner. Comfortable with specs, models, and trade‑offs. Provide deeper internals, references, and concise math where useful.
Prefer structured outlines and crisp definitions.`
  );
}

const initialGreeting: ChatMessage = {
  id: "sys-1",
  role: "assistant",
  content:
    "Hi! I’m your Crypto AI Tutor. Pick your experience level, or ask a question. I can explain crypto concepts in plain language and help you learn safely.",
  ts: Date.now(),
};

const Education = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [level, setLevel] = useState<ExperienceLevel>("beginner");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY.geminiKey);
    const storedLevel = (localStorage.getItem(LOCAL_STORAGE_KEY.level) as ExperienceLevel) || "beginner";
    setLevel(storedLevel);
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setShowKeyModal(true);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
      setAtBottom(nearBottom);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const suggestions = useMemo(() => SUGGESTIONS[level], [level]);

  const handleSaveKey = () => {
    if (!apiKey || apiKey.trim().length < 20) {
      setError("Please provide a valid Gemini API key.");
      return;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY.geminiKey, apiKey.trim());
    setShowKeyModal(false);
    setError(null);
  };

  const handleSetLevel = (lvl: ExperienceLevel) => {
    setLevel(lvl);
    localStorage.setItem(LOCAL_STORAGE_KEY.level, lvl);
  };

  const handleNewChat = () => {
    setMessages([initialGreeting]);
    setInput("");
    setError(null);
  };

  const autoGrow = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch (e) {
      // ignore
    }
  };

  const handleAsk = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question) return;
    if (!GoogleGenerativeAI) {
      setError(
        "Gemini SDK not installed. In development, run: pnpm add @google/generative-ai (inside the frontend container)."
      );
      return;
    }
    const key = apiKey || localStorage.getItem(LOCAL_STORAGE_KEY.geminiKey);
    if (!key) {
      setShowKeyModal(true);
      return;
    }

    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: question, ts: Date.now() }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: {
          role: "user",
          parts: [{ text: createSystemPrompt(level) }],
        },
      });

      // Build chat history compatible with Gemini
      const history = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));

      // Gemini requires first content to be from 'user'.
      while (history.length && history[0].role !== "user") {
        history.shift();
      }
      // Keep only recent context to stay efficient
      const boundedHistory = history.slice(-20);

      const chat = await model.startChat({
        history: boundedHistory,
      });

      const result = await chat.sendMessage(question);
      const textResp = (result.response?.text?.()) ?? ((result.response as any)?.candidates?.[0]?.content?.parts?.[0]?.text || "");
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: textResp, ts: Date.now() }]);
    } catch (e: any) {
      setError(e?.message || "Failed to get a response from Gemini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1224px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-green-600" /> Crypto AI Tutor
          </h1>
          <p className="text-gray-600 mt-1">Learn crypto at your level. Safe, clear, and practical explanations.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(["beginner", "intermediate", "advanced"] as ExperienceLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleSetLevel(lvl)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  level === lvl ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 border-2 border-b-4 border-gray-200 rounded-lg bg-white text-sm"
          >
            <RefreshCcw className="w-4 h-4 text-gray-600" /> New Chat
          </button>
          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-2 px-3 py-2 border-2 border-b-4 border-gray-200 rounded-lg bg-white text-sm"
          >
            <KeyRound className="w-4 h-4 text-gray-600" /> API Key
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleAsk(s)}
            className="flex items-center gap-2 p-3 bg-white border-2 border-b-4 border-gray-200 rounded-xl text-left hover:shadow-sm transition"
          >
            <Wand2 className="w-4 h-4 text-indigo-500" />
            <span className="text-sm text-gray-800">{s}</span>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div ref={scrollRef} className="h-[520px] overflow-y-auto p-4 space-y-5">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative max-w-[85%] rounded-2xl px-5 py-4 text-sm ${
                  m.role === "user"
                    ? "bg-green-600 text-white leading-relaxed"
                    : "bg-gray-50 border border-gray-200 text-gray-800 leading-7"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {m.role === "user" ? (
                    <User className="w-3.5 h-3.5 opacity-80" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 text-green-600" />
                  )}
                  <span className="text-xs opacity-80">
                    {m.role === "user" ? "You" : "Tutor"} · {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {m.role === "assistant" && (
                    <button
                      onClick={() => void handleCopy(m.content, m.id)}
                      className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
                      title="Copy response"
                    >
                      {copiedId === m.id ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                      {copiedId === m.id ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
                {m.role === "assistant" ? (
                  <div className="prose prose-base max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-3 prose-li:my-2 prose-ul:my-3 prose-ol:my-3 prose-hr:my-4 prose-blockquote:my-3 prose-code:text-[0.9em] prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-3 prose-pre:rounded-lg">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-xs opacity-80">Tutor</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {error && <StatusMessage type="error" message={error} />}

          {!atBottom && (
            <button
              onClick={() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })}
              className="fixed bottom-28 right-10 z-10 bg-white border border-gray-200 shadow px-2.5 py-2 rounded-full text-gray-700 hover:text-gray-900"
              title="Scroll to latest"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoGrow();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleAsk();
                }
              }}
              placeholder="Ask anything about crypto..."
              rows={1}
              className="flex-1 rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500 resize-none max-h-[140px]"
            />
            <button
              disabled={!input.trim() || loading}
              onClick={() => void handleAsk()}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Shield className="w-3.5 h-3.5" /> Educational use only. Not financial advice.
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-gray-900">Enter Gemini API Key</h3>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-gray-500 hover:text-gray-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Your key is stored locally in this browser and never sent to our servers. You can get a free key from Google AI Studio.
            </p>
            <input
              value={apiKey ?? ""}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your Gemini API key"
              className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            <div className="flex items-center justify-between mt-3">
              <a
                href="https://ai.google.dev/gemini-api/docs/api-key"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" /> Get an API Key
              </a>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-2 text-sm rounded-lg border-2 border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKey}
                  className="px-3 py-2 text-sm rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;
