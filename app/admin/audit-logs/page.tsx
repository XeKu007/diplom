"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AuditLog {
  id: string; action: string; detail: string | null; ip: string | null; createdAt: string;
  user: { userId: string; name: string; role: string };
}

const actionColor = (a: string) => ({
  LOGIN:        "text-emerald-400 border-emerald-400/30 bg-emerald-500/10",
  LOGIN_FAILED: "text-red-400 border-red-400/30 bg-red-500/10",
  LOGOUT:       "text-blue-400 border-blue-400/30 bg-blue-500/10",
}[a] ?? "text-white/50 border-white/10 bg-white/5");

const actionIcon = (a: string) => ({
  LOGIN:        "✅",
  LOGIN_FAILED: "❌",
  LOGOUT:       "🚪",
}[a] ?? "📋");

export default function AuditLogsPage() {
  const [activeMenu, setActiveMenu] = useState("Аудит лог");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filter) params.set("action", filter);
      const res = await fetch(`/api/audit-logs?${params}`);
      if (res.ok) setLogs(await res.json());
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const roleLabel = (r: string) => ({
    admin: "👑 Бүрэн эрхт", training: "📚 Сургалт", finance: "💰 Санхүү",
    student: "🎓 Оюутан", teacher: "🧑‍🏫 Багш", parent: "👨‍👩‍👧 Эцэг/эх",
  }[r] ?? r);

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-5xl space-y-6">

            {/* Header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Систем</p>
                <h1 className="mt-1 text-2xl font-semibold">Аудит лог</h1>
                <p className="mt-1 text-sm text-white/50">Системийн бүх үйлдлийн бүртгэл</p>
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none">
                <option value="" className="bg-[#0a1628]">Бүх үйлдэл</option>
                <option value="LOGIN" className="bg-[#0a1628]">✅ Нэвтэрсэн</option>
                <option value="LOGIN_FAILED" className="bg-[#0a1628]">❌ Нэвтрэлт амжилтгүй</option>
                <option value="LOGOUT" className="bg-[#0a1628]">🚪 Гарсан</option>
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Нийт бүртгэл",        value: logs.length,                                                    color: "text-white" },
                { label: "Амжилттай нэвтрэлт",  value: logs.filter((l) => l.action === "LOGIN").length,               color: "text-emerald-400" },
                { label: "Амжилтгүй нэвтрэлт",  value: logs.filter((l) => l.action === "LOGIN_FAILED").length,        color: "text-red-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-4 text-center backdrop-blur-md">
                  <p className={`text-2xl font-bold ${s.color}`}>{loading ? "…" : s.value}</p>
                  <p className="text-xs text-white/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Logs */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/60">
                  Бүртгэлүүд {!loading && <span className="text-white/40 ml-1">({logs.length})</span>}
                </h2>
                <button onClick={load} className="text-xs text-violet-400 hover:text-violet-300">↻ Шинэчлэх</button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-center py-12 text-white/40">Бүртгэл байхгүй байна</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                      <span className="text-xl shrink-0 mt-0.5">{actionIcon(log.action)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${actionColor(log.action)}`}>
                            {log.action}
                          </span>
                          <span className="text-sm font-medium">{log.user.name}</span>
                          <span className="text-xs text-white/40 font-mono">{log.user.userId}</span>
                          <span className="text-xs text-white/30">{roleLabel(log.user.role)}</span>
                        </div>
                        {log.detail && <p className="text-xs text-white/50 mt-1">{log.detail}</p>}
                        {log.ip && <p className="text-xs text-white/30 mt-0.5">IP: {log.ip}</p>}
                      </div>
                      <p className="text-xs text-white/30 shrink-0">
                        {new Date(log.createdAt).toLocaleString("mn-MN")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
