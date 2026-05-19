"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const typeStyle = (t: string) => ({
  info:    { icon: "ℹ️", color: "border-blue-400/30 bg-blue-500/10" },
  warning: { icon: "⚠️", color: "border-amber-400/30 bg-amber-500/10" },
  success: { icon: "✅", color: "border-emerald-400/30 bg-emerald-500/10" },
  error:   { icon: "❌", color: "border-red-400/30 bg-red-500/10" },
}[t] ?? { icon: "📢", color: "border-white/10 bg-white/5" });

export default function NotificationsPage() {
  const [activeMenu, setActiveMenu] = useState("Мэдэгдэл");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-3xl space-y-5">
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium uppercase tracking-widest text-white/60">
                  Мэдэгдэл {unread > 0 && <span className="ml-2 rounded-full bg-violet-500 px-2 py-0.5 text-xs text-white">{unread}</span>}
                </h2>
                {unread > 0 && (
                  <button onClick={() => notifications.filter((n) => !n.isRead).forEach((n) => markRead(n.id))}
                    className="text-xs text-violet-400 hover:text-violet-300">Бүгдийг уншсан болгох</button>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-center py-12 text-white/40">Мэдэгдэл байхгүй байна</p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => {
                    const ts = typeStyle(n.type);
                    return (
                      <div key={n.id} onClick={() => !n.isRead && markRead(n.id)}
                        className={`rounded-xl border p-4 cursor-pointer transition-all ${ts.color} ${!n.isRead ? "opacity-100" : "opacity-60"}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-xl shrink-0">{ts.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`font-medium text-sm ${!n.isRead ? "text-white" : "text-white/70"}`}>{n.title}</p>
                              {!n.isRead && <span className="h-2 w-2 rounded-full bg-violet-400 shrink-0" />}
                            </div>
                            <p className="text-xs text-white/60 mt-1">{n.body}</p>
                            <p className="text-xs text-white/30 mt-2">
                              {new Date(n.createdAt).toLocaleDateString("mn-MN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
