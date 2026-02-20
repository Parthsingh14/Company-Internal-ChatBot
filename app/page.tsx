"use client";
import { useState, useRef, useEffect , KeyboardEvent} from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey, I’m Jero! How can I help you today?" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {

      const res = await fetch("/api/llmchat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
        }),
      });

      const data = await res.json();

      if (data?.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ Sorry, something went wrong." },
        ]);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to reach Jero. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

   return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col">
      <div className="container mx-auto max-w-3xl flex-1 pb-44 px-3 overflow-y-auto">
        <div className="pt-6 flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-xl whitespace-pre-wrap max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-neutral-800"
                    : "bg-neutral-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm italic px-3">
              Jero is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 flex justify-center bg-neutral-900 px-3">
        <div className="bg-neutral-800 rounded-3xl w-full max-w-3xl mb-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className="w-full resize-none outline-none p-3 rounded-3xl bg-neutral-800"
          />

          <div className="flex justify-end p-3">
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-white px-4 py-1 text-black rounded-full hover:bg-gray-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
