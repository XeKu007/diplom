"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  pendingPayments: number;
}

export default function AnalyticsDashboard() {
  const [activeMenu, setActiveMenu] = useState("Аналитик самбар");
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalTeachers: 0, totalCourses: 0, pendingPayments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.stats) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { label: "Нийт оюутан",         value: stats.totalStudents,   icon: "👨‍🎓", color: "text-violet-300",  bg: "bg-violet-500/10 border-violet-400/20" },
    { label: "Нийт багш",           value: stats.totalTeachers,   icon: "🧑‍🏫", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-400/20" },
    { label: "Идэвхтэй хичээл",     value: stats.totalCourses,    icon: "📚",  color: "text-amber-300",   bg: "bg-amber-500/10 border-amber-400/20" },
    { label: "Хүлээгдэж буй төлбөр",value: stats.pendingPayments, icon: "💰",  color: "text-blue-300",    bg: "bg-blue-500/10 border-blue-400/20" },
  ];

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-7xl space-y-6">

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Систем</p>
                <h1 className="mt-1 text-2xl font-semibold">Аналитик самбар</h1>
                <p className="mt-1 text-sm text-white/50">Системийн ерөнхий статистик</p>
              </div>
              <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                ← Буцах
              </Link>
            </div>

            {/* Key metrics */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((m) => (
                <div key={m.label} className={`rounded-[24px] border p-5 backdrop-blur-md ${m.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{m.icon}</span>
                    {loading ? (
                      <div className="h-8 w-16 animate-pulse rounded-lg bg-white/10" />
                    ) : (
                      <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
                    )}
                  </div>
                  <p className="text-sm text-white/60">{m.label}</p>
                </div>
              ))}
            </div>

            {/* Ratio cards */}
            {!loading && stats.totalStudents > 0 && (
              <div className="grid gap-5 sm:grid-cols-3">
                {[
                  {
                    label: "Оюутан / Багш харьцаа",
                    value: stats.totalTeachers > 0 ? `${Math.round(stats.totalStudents / stats.totalTeachers)}:1` : "—",
                    desc: "Нэг багшид ногдох оюутны тоо",
                    color: "text-violet-300",
                  },
                  {
                    label: "Оюутан / Хичээл харьцаа",
                    value: stats.totalCourses > 0 ? `${Math.round(stats.totalStudents / stats.totalCourses)}:1` : "—",
                    desc: "Нэг хичээлд ногдох оюутны тоо",
                    color: "text-emerald-300",
                  },
                  {
                    label: "Төлбөрийн хүлээгдэл",
                    value: stats.pendingPayments,
                    desc: "Хүлээгдэж буй төлбөрийн тоо",
                    color: stats.pendingPayments > 0 ? "text-amber-300" : "text-white/40",
                  },
                ].map((s) => (
                  <div key={s.label} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                    <p className="text-xs text-white/40 mb-2">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-white/30 mt-2">{s.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/60 mb-4">Дэлгэрэнгүй тайлан</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Оюутны жагсаалт",  href: "/admin/students",   icon: "👨‍🎓" },
                  { label: "Дүнгийн бүртгэл",  href: "/admin/grades",     icon: "📊" },
                  { label: "Ирцийн бүртгэл",   href: "/admin/attendance", icon: "📋" },
                  { label: "Санхүүгийн тайлан",href: "/admin/finance",    icon: "💰" },
                  { label: "Багш нар",          href: "/admin/teachers",   icon: "🧑‍🏫" },
                  { label: "Хичээлүүд",         href: "/admin/classes",    icon: "📚" },
                ].map((l) => (
                  <Link key={l.href} href={l.href}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                    <span className="text-xl">{l.icon}</span>
                    <span className="text-sm font-medium">{l.label}</span>
                    <span className="ml-auto text-white/30">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
