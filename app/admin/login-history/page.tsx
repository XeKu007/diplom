"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AuditLog {
  id: string;
  action: string;
  detail: string | null;
  ip: string | null;
  createdAt: string;
  user: { userId: string; name: string; role: string };
}

const roleLabel = (r: string) =>
  ({
    admin: "👑 Бүрэн эрхт",
    training: "📚 Сургалт",
    finance: "💰 Санхүү",
    student: "🎓 Оюутан",
    teacher: "🧑‍🏫 Багш",
    parent: "👨‍👩‍👧 Эцэг/эх",
  }[r] ?? r);

const roleColor = (r: string) =>
  ({
    admin: "from-purple-500 to-pink-600",
    training: "from-blue-500 to-cyan-600",
    finance: "from-emerald-500 to-teal-600",
    teacher: "from-amber-500 to-orange-600",
    student: "from-indigo-500 to-blue-600",
    parent: "from-rose-500 to-red-600",
  }[r] ?? "from-gray-500 to-gray-600");

export default function LoginHistory() {
  const [activeMenu, setActiveMenu] = useState("Нэвтрэх түүх");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit-logs?limit=200");
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Filter: LOGIN / LOGIN_FAILED / LOGOUT
  const loginLogs = logs.filter((l) =>
    ["LOGIN", "LOGIN_FAILED", "LOGOUT"].includes(l.action)
  );

  const filtered = loginLogs.filter((l) => {
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "success" && l.action === "LOGIN") ||
      (filterStatus === "failed" && l.action === "LOGIN_FAILED");
    const matchRole =
      filterRole === "all" || l.user.role === filterRole;
    return matchStatus && matchRole;
  });

  const todayStr = new Date().toDateString();
  const todayLogs = loginLogs.filter(
    (l) => new Date(l.createdAt).toDateString() === todayStr
  );

  const roles = ["all", "admin", "training", "finance", "teacher", "student", "parent"];

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main
          className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{
            backgroundImage:
              "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')",
            backgroundSize: "72%",
          }}
        >
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Систем</p>
                <h1 className="mt-1 text-2xl font-semibold">Нэвтрэх түүх</h1>
                <p className="mt-1 text-sm text-white/50">
                  Системд нэвтрэх бүх оролдлогын түүх
                </p>
              </div>
              <button
                onClick={load}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white"
              >
                ↻ Шинэчлэх
              </button>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-64">
                  <label className="block text-sm text-white/50 mb-2">
                    Статусаар шүүх
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5 text-white focus:outline-none"
                  >
                    <option value="all" className="bg-[#0a1628]">Бүх статус</option>
                    <option value="success" className="bg-[#0a1628]">✅ Амжилттай</option>
                    <option value="failed" className="bg-[#0a1628]">❌ Амжилтгүй</option>
                  </select>
                </div>
                <div className="md:w-64">
                  <label className="block text-sm text-white/50 mb-2">
                    Рольоор шүүх
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5 text-white focus:outline-none"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r} className="bg-[#0a1628]">
                        {r === "all" ? "Бүх роль" : roleLabel(r)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Өнөөдрийн нэвтрэлт",
                  value: loading ? "…" : todayLogs.length,
                  icon: "📊",
                  color: "bg-blue-500",
                },
                {
                  label: "Амжилттай",
                  value: loading
                    ? "…"
                    : loginLogs.filter((l) => l.action === "LOGIN").length,
                  icon: "✅",
                  color: "bg-emerald-500",
                },
                {
                  label: "Амжилтгүй",
                  value: loading
                    ? "…"
                    : loginLogs.filter((l) => l.action === "LOGIN_FAILED").length,
                  icon: "❌",
                  color: "bg-red-500",
                },
                {
                  label: "Нийт бүртгэл",
                  value: loading ? "…" : loginLogs.length,
                  icon: "🌐",
                  color: "bg-amber-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}
                    >
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Нэвтрэх түүх</h2>
                <p className="text-sm text-white/50">{filtered.length} бүртгэл</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-white/40">Бүртгэл олдсонгүй</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {[
                          "Огноо",
                          "Хэрэглэгч",
                          "Роль",
                          "IP хаяг",
                          "Дэлгэрэнгүй",
                          "Статус",
                        ].map((h) => (
                          <th
                            key={h}
                            className="pb-3 text-left text-sm font-medium text-white/50"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className="py-3 text-sm text-white">
                            {new Date(log.createdAt).toLocaleString("mn-MN")}
                          </td>
                          <td className="py-3">
                            <p className="text-white">{log.user.name}</p>
                            <p className="text-xs text-white/40 font-mono">
                              {log.user.userId}
                            </p>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-3 w-3 rounded-full bg-gradient-to-br ${roleColor(log.user.role)}`}
                              />
                              <p className="text-sm text-white">
                                {roleLabel(log.user.role)}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-white/70 font-mono">
                            {log.ip ?? "—"}
                          </td>
                          <td className="py-3 text-sm text-white/50">
                            {log.detail ?? "—"}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                log.action === "LOGIN"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : log.action === "LOGIN_FAILED"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-blue-500/10 text-blue-400"
                              }`}
                            >
                              {log.action === "LOGIN"
                                ? "Амжилттай"
                                : log.action === "LOGIN_FAILED"
                                ? "Амжилтгүй"
                                : "Гарсан"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Role breakdown */}
            {!loading && loginLogs.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Роль тус бүрийн нэвтрэлт
                  </h2>
                  <div className="space-y-4">
                    {["admin", "training", "finance", "teacher", "student", "parent"].map(
                      (role) => {
                        const count = loginLogs.filter(
                          (l) => l.user.role === role && l.action === "LOGIN"
                        ).length;
                        const pct =
                          loginLogs.filter((l) => l.action === "LOGIN").length > 0
                            ? Math.round(
                                (count /
                                  loginLogs.filter((l) => l.action === "LOGIN").length) *
                                  100
                              )
                            : 0;
                        if (count === 0) return null;
                        return (
                          <div key={role} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-3 w-3 rounded-full bg-gradient-to-br ${roleColor(role)}`}
                              />
                              <span className="text-sm text-white/70">
                                {roleLabel(role)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-32 rounded-full bg-white/[0.06] overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${roleColor(role)} rounded-full`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-sm text-white/50 w-10 text-right">
                                {count}
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Аюулгүй байдлын мэдээлэл
                  </h2>
                  <div className="space-y-3">
                    {loginLogs.filter((l) => l.action === "LOGIN_FAILED").length > 0 ? (
                      <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-4">
                        <h3 className="font-medium text-red-300">
                          Амжилтгүй нэвтрэлт илэрлээ
                        </h3>
                        <p className="text-sm text-white/50 mt-1">
                          Нийт{" "}
                          {loginLogs.filter((l) => l.action === "LOGIN_FAILED").length}{" "}
                          удаа амжилтгүй нэвтрэх оролдлого бүртгэгдсэн
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                        <h3 className="font-medium text-emerald-300">
                          Аюулгүй байдал хэвийн
                        </h3>
                        <p className="text-sm text-white/50 mt-1">
                          Амжилтгүй нэвтрэлт бүртгэгдээгүй байна
                        </p>
                      </div>
                    )}
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-sm text-white/70">
                        Нийт нэвтрэлт:{" "}
                        <span className="text-white font-semibold">
                          {loginLogs.filter((l) => l.action === "LOGIN").length}
                        </span>
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        Гарсан:{" "}
                        <span className="text-white font-semibold">
                          {loginLogs.filter((l) => l.action === "LOGOUT").length}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
