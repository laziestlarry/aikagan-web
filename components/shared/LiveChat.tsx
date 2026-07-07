"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

/* ───────────────────────────────────────────────────────────────────────────
 * Live Chat — Floating widget powered by the chatbot service
 *
 * - Appears as a round button in the bottom-right corner
 * - Expands into a full chat panel on click
 * - Creates a session on first message, persists for the visit
 * - Handles idle / offline fallback gracefully
 * ─────────────────────────────────────────────────────────────────────────── */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm the AutonomaX assistant. Ask me about our products, services, or how the system works — or type 'agent' to connect with a human.",
};

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Auto-scroll to newest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  /* Create a chat session lazily */
  const ensureSession = async (): Promise<string> => {
    if (sessionId) return sessionId;
    const params = new URLSearchParams({ user_id: "web-visitor" });
    const res = await fetch(`/api/services/chat/session?${params}`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to create session");
    const data = await res.json();
    setSessionId(data.session_id);
    return data.session_id;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);

    /* Optimistic user message */
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const sid = await ensureSession();
      const params = new URLSearchParams({ session_id: sid, message: text });
      const res = await fetch(`/api/services/chat/message?${params}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Chat error");
      const data = await res.json();
      const botMsg: ChatMessage = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setError("Could not reach the assistant right now. Please try again or email support@autonomax.ai.");
      /* Remove the optimistic user message on error */
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-kagan-gold text-black shadow-lg shadow-kagan-gold/30 hover:bg-kagan-gold-light hover:shadow-kagan-gold/50 transition-all duration-200 hover:scale-105"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-80 sm:w-96 flex-col rounded-2xl border border-kagan-border bg-kagan-card/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-kagan-border px-4 py-3 bg-kagan-gold/10">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-kagan-white">Live Chat</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-kagan-gold text-black rounded-br-md"
                      : "bg-kagan-card border border-kagan-border text-kagan-light rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-kagan-card border border-kagan-border px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-kagan-gold" />
                  <span className="text-xs text-kagan-muted">Thinking…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 pb-1">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-kagan-border p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message…"
                disabled={loading}
                className="flex-1 rounded-xl border border-kagan-border bg-kagan-black/60 px-4 py-2.5 text-sm text-kagan-white placeholder:text-kagan-muted focus:outline-none focus:ring-1 focus:ring-kagan-gold disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-kagan-gold text-black hover:bg-kagan-gold-light disabled:opacity-40 transition-colors"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-kagan-muted text-center">
              Responses are AI-generated. For urgent issues, email{" "}
              <a href="mailto:support@autonomax.ai" className="text-kagan-gold hover:underline">
                support@autonomax.ai
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
