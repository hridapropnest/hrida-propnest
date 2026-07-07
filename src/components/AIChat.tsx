import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { ChatMessage } from "../types";

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

const CONVERSATION_CHIPS = [
  { label: "Lodha Altamount 👑", text: "What makes the Lodha Altamount penthouse in Mumbai so unique?" },
  { label: "Book a private showing 🔑", text: "I would like to book a private VIP tour for one of the villas." },
  { label: "Thane vs Navi Mumbai 🌇", text: "How does Hiranandani in Thane compare with Palm Beach Road in Navi Mumbai?" },
  { label: "Broker commissions 💼", text: "What is your standard luxury commission rate and broker representation fee?" },
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "initial",
  role: "model",
  text: `Namaste! I am Elena, your elite real estate AI concierge. I specialize in Mumbai, Thane, and Navi Mumbai's most prestigious luxury properties.

Are you looking for an elite sky-mansion at Lodha Altamount in Mumbai, a grand neoclassical penthouse in Hiranandani Thane, or a futuristic creek-front sky-villa in Navi Mumbai? Tell me your budget or desired lifestyle!`,
  timestamp: new Date().toISOString(),
};

export function AIChat({ isOpen, onClose, onOpenBooking }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
  INITIAL_MESSAGE,
]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
  const message = textToSend.trim();

  if (!message || loading) return;

  const userMessage: ChatMessage = {
    id: window.crypto.randomUUID(),
    role: "user",
    text: message,
    timestamp: new Date().toISOString(),
  };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      // Create chat history for back-end
      const history = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  message,
  history,
}),
      });

      if (!response.ok) {
    const error = await response.json();

throw new Error(error.error ?? "Unable to reach AI server");
}

const data = await response.json();

      const aiMessage: ChatMessage = {
        id: window.crypto.randomUUID(),
        role: "model",
        text: data.text || "I apologize, but my connection failed. Please contact our main desk directly at +1 (202) 112-2333.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: window.crypto.randomUUID(),
          role: "model",
          text: "Forgive me, but I'm having difficulty reaching our server. You can speak directly with our senior agent on the broker line.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="ai-chat-window"
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.92 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="fixed bottom-6 right-6 z-40 flex h-[600px] w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/95 shadow-2xl backdrop-blur-lg"
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-teal-400 text-stone-950 font-display font-bold">
                  E
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-stone-900 bg-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-bold text-sm text-white">Elena Concierge</h4>
                  <Sparkles size={12} className="text-cyan-400" />
                </div>
                <p className="text-[10px] text-stone-400 font-mono">Hrida Propnest AI Estate Specialist</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
  <button
    onClick={() => setMessages([INITIAL_MESSAGE])}
    className="rounded-full p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
    title="New Chat"
  >
    <RefreshCw size={16} />
  </button>

  <button
    id="close-chat-btn"
    onClick={onClose}
    className="rounded-full p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
  >
    <X size={18} />
  </button>
</div>
          </div>

          {/* Messages Container */}
          <div className="custom-scrollbar flex-1 overflow-y-auto p-4 space-y-4 bg-stone-950/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-800 text-[11px] font-bold text-cyan-400">
                    AI
                  </div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm max-w-[82%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-to-r from-cyan-500/10 to-teal-500/10 text-stone-100 border border-cyan-500/20 rounded-tr-none"
                      : "bg-stone-800 text-stone-300 rounded-tl-none border border-stone-800/80"
                  }`}
                >
                  {/* Process simple markdown lists or paragraphs in agent responses */}
                  <div className="space-y-1 whitespace-pre-line">
                    {m.text.split("\n\n").map((para, i) => (
                      <p key={i}>
                        {para.split("\n").map((line, j) => {
                          if (line.trim().startsWith("•")) {
                            return (
                              <span key={j} className="block pl-3 relative">
                                <span className="absolute left-0 text-cyan-400">•</span>
                                {line.replace(/•\s*/, "")}
                              </span>
                            );
                          }
                          return <span key={j}>{line}<br /></span>;
                        })}
                      </p>
                    ))}
                  </div>
                  <span className="mt-1 block text-[9px] text-stone-500 text-right font-mono">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-800 text-[11px] font-bold text-cyan-400">
                  AI
                </div>
                <div className="rounded-2xl rounded-tl-none bg-stone-800 px-4 py-3 text-sm text-stone-400 border border-stone-800/80">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.2s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="px-4 py-2 border-t border-stone-800/50 bg-stone-900/30 overflow-x-auto whitespace-nowrap flex gap-2 no-scrollbar">
            {CONVERSATION_CHIPS.map((chip, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(chip.text)}
                className="inline-block rounded-full border border-stone-800 bg-stone-950 px-3 py-1.5 text-xs text-stone-400 hover:border-cyan-500/30 hover:text-white transition-all cursor-pointer select-none"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Action Helper to Schedule Visit directly */}
          <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/5 to-teal-500/5 border-t border-stone-800/40 flex items-center justify-between">
            <span className="text-[10px] text-stone-400 font-mono">Ready to view in person?</span>
            <button
              id="chat-book-shortcut"
              onClick={onOpenBooking}
              className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest font-mono flex items-center gap-1 cursor-pointer"
            >
              <span>Book Tour</span>
              <span>🔑</span>
            </button>
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-stone-800 bg-stone-900">
            <div className="relative flex items-center bg-stone-950 rounded-xl border border-stone-800 focus-within:border-cyan-500 transition-all px-2.5">
              <input
                id="chat-message-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
    if (e.key === "Enter" && !loading) {
        handleSendMessage(inputValue);
    }
}}
                placeholder="Ask Elena about Mumbai, Thane, Navi Mumbai or elite properties..."
                className="flex-1 py-2.5 px-2 text-xs text-white placeholder-stone-600 focus:outline-none bg-transparent"
              />
              <button
                id="chat-send-btn"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || loading}
                className="rounded-lg p-2 text-cyan-400 hover:bg-stone-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
