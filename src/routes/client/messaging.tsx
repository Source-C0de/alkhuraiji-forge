import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MessageSquare, ChevronRight } from "lucide-react";
import { useClientStore, type Message } from "@/store/clientStore";

export const Route = createFileRoute("/client/messaging")({
  component: MessagingCenter,
});

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function MessagingCenter() {
  const { messages, sendMessage, markMessagesRead, projects, profile } = useClientStore();
  const [input, setInput] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | undefined>(projects[0]?.id);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markMessagesRead();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredMessages = selectedProject
    ? messages.filter((m) => m.projectId === selectedProject || !m.projectId)
    : messages;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(trimmed, selectedProject);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const unreadCount = messages.filter((m) => m.sender === "manager" && !m.read).length;

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex gap-6">
      {/* Project sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-white">Messages</h1>
          <p className="text-white/35 text-xs mt-0.5">Chat with your project managers</p>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
          {/* All messages */}
          <button
            onClick={() => setSelectedProject(undefined)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
              !selectedProject
                ? "border-[#C9A84C]/30 bg-[#C9A84C]/8 text-[#C9A84C]"
                : "border-white/[0.06] bg-[#0E0E0E] text-white/50 hover:text-white hover:border-white/[0.12]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">All Projects</span>
              {unreadCount > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#C9A84C] text-black text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>

          {projects.map((p) => {
            const projMessages = messages.filter((m) => m.projectId === p.id);
            const unread = projMessages.filter((m) => m.sender === "manager" && !m.read).length;
            const lastMsg = projMessages[projMessages.length - 1];

            return (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  selectedProject === p.id
                    ? "border-[#C9A84C]/30 bg-[#C9A84C]/8"
                    : "border-white/[0.06] bg-[#0E0E0E] hover:border-white/[0.12]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-medium truncate ${selectedProject === p.id ? "text-[#C9A84C]" : "text-white/70"}`}>
                    {p.name}
                  </p>
                  {unread > 0 && (
                    <span className="h-4 min-w-4 px-1 rounded-full bg-[#C9A84C] text-black text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                      {unread}
                    </span>
                  )}
                </div>
                {lastMsg && (
                  <p className="text-[11px] text-white/25 truncate">{lastMsg.content}</p>
                )}
                <p className="text-[10px] text-white/[0.15] mt-0.5">{p.category}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden min-w-0">
        {/* Chat header */}
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-black font-bold text-sm">
              K
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {selectedProject
                  ? projects.find((p) => p.id === selectedProject)?.manager ?? "Project Team"
                  : "All Project Managers"}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[10px] text-emerald-400">Online</p>
              </div>
            </div>
          </div>
          {selectedProject && (
            <div className="text-[11px] text-white/30">
              {projects.find((p) => p.id === selectedProject)?.name}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
          {filteredMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-12 w-12 text-white/[0.06] mb-4" />
              <p className="text-white/25 text-sm">No messages yet. Start a conversation!</p>
            </div>
          )}

          {filteredMessages.map((msg, i) => {
            const isClient = msg.sender === "client";
            const showDate = i === 0 || new Date(filteredMessages[i - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-white/[0.05]" />
                    <span className="text-[10px] text-white/20 px-2">
                      {new Date(msg.timestamp).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </span>
                    <div className="flex-1 h-px bg-white/[0.05]" />
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-3 ${isClient ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isClient
                      ? "bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-black"
                      : "bg-white/[0.08] text-white/70"
                  }`}>
                    {msg.senderName.charAt(0)}
                  </div>

                  {/* Bubble */}
                  <div className={`max-w-[72%] ${isClient ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <p className={`text-[10px] text-white/25 ${isClient ? "text-right" : ""}`}>{msg.senderName}</p>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isClient
                        ? "bg-[#C9A84C]/15 border border-[#C9A84C]/20 text-white/90 rounded-tr-sm"
                        : "bg-white/[0.05] border border-white/[0.06] text-white/75 rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] text-white/20 ${isClient ? "text-right" : ""}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-4 py-4 border-t border-white/[0.06] flex-shrink-0">
          <div className="flex items-end gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] focus-within:border-[#C9A84C]/30 px-4 py-3 transition-all">
            <button className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors flex-shrink-0 mb-0.5">
              <Paperclip className="h-4 w-4 text-white/30" />
            </button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/20 text-sm resize-none max-h-32 scrollbar-hide"
              style={{ lineHeight: "1.5" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex-shrink-0 h-9 w-9 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black flex items-center justify-center transition-all shadow-[0_2px_12px_rgba(201,168,76,0.3)] disabled:opacity-30 disabled:cursor-not-allowed mb-0.5"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-white/15 text-center mt-2">Your messages are end-to-end encrypted</p>
        </div>
      </div>
    </div>
  );
}
