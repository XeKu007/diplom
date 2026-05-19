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

export default function TrainingAdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Нүүр хуудас");
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalTeachers: 0, totalCourses: 0, pendingPayments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { if (d.stats) setStats(d.stats); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Нийт оюутан",      value: stats.totalStudents,  icon: "👨‍🎓", color: "bg-blue-500",    href: "/admin/students" },
    { label: "Идэвхтэй хичээл",  value: stats.totalCourses,   icon: "📚",  color: "bg-emerald-500", href: "/admin/classes" },
    { label: "Нийт багш",        value: stats.totalTeachers,  icon: "🧑‍🏫", color: "bg-amber-500",   href: "/admin/teachers" },
    { label: "Хүлээгдэж буй",    value: stats.pendingPayments,icon: "⚠️",  color: "bg-red-500",     href: "/admin/attendance" },
  ];

  const quickActions = [
    { label: "Ирц бүртгэх",   icon: "📝", color: "from-blue-600 to-blue-800",     link: "/admin/attendance" },
    { label: "Дүн оруулах",   icon: "📈", color: "from-emerald-600 to-emerald-800", link: "/admin/grades" },
    { label: "Хуваарь",       icon: "📅", color: "from-amber-600 to-amber-800",    link: "/admin/timetable" },
    { label: "Оюутнууд",      icon: "👨‍🎓", color: "from-violet-600 to-violet-800",  link: "/admin/students" },
    { label: "Багш нар",      icon: "🧑‍🏫", color: "from-pink-600 to-pink-800",     link: "/admin/teachers" },
    { label: "Хичээлүүд",     icon: "📚", color: "from-cyan-600 to-cyan-800",      link: "/admin/classes" },
  ];

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-6xl space-y-6">

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Сургалтын алба</p>
              <h1 className="mt-1 text-2xl font-semibold">Сургалтын самбар</h1>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((s) => (
                <Link key={s.label} href={s.href}
                  className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md hover:bg-[#0d1a30]/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{s.label}</p>
                      {loading ? (
                        <div className="mt-2 h-8 w-16 animate-pulse rounded-lg bg-white/10" />
                      ) : (
                        <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
                      )}
                    </div>
                    <div className={`h-12 w-12 rounded-full ${s.color} flex items-center justify-center text-xl`}>{s.icon}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick actions */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/60 mb-4">Хурдан хандалт</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((a) => (
                  <Link key={a.link} href={a.link}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-xl shrink-0`}>
                      {a.icon}
                    </div>
                    <span className="font-medium">{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Empty state */}
            {!loading && stats.totalStudents === 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md text-center">
                <p className="text-2xl mb-3">📚</p>
                <h3 className="font-semibold mb-2">Өгөгдөл байхгүй байна</h3>
                <p className="text-sm text-white/50 mb-4">Эхлээд оюутан, багш, хичээл нэмнэ үү</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/admin/students" className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/25">
                    + Оюутан нэмэх
                  </Link>
                  <Link href="/admin/classes" className="rounded-lg border border-amber-400/30 bg-amber-500/15 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/25">
                    + Хичээл нэмэх
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
