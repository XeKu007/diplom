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

interface RecentStudent {
  id: string;
  firstName: string;
  lastName: string;
  major: string | null;
  user: { userId: string };
}

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Нүүр хуудас");
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    pendingPayments: 0,
  });
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.stats) setStats(d.stats);
        setRecentStudents(d.recentStudents ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Нийт оюутан",           value: stats.totalStudents,   icon: "👨‍🎓", color: "bg-violet-500",  href: "/admin/students" },
    { label: "Нийт багш",             value: stats.totalTeachers,   icon: "🧑‍🏫", color: "bg-emerald-500", href: "/admin/teachers" },
    { label: "Идэвхтэй хичээл",       value: stats.totalCourses,    icon: "📚",  color: "bg-amber-500",   href: "/admin/classes" },
    { label: "Хүлээгдэж буй төлбөр",  value: stats.pendingPayments, icon: "💰",  color: "bg-blue-500",    href: "/admin/finance" },
  ];

  const quickLinks = [
    { label: "Оюутны жагсаалт",  href: "/admin/students",         icon: "👨‍🎓", color: "from-violet-600 to-purple-800" },
    { label: "Дүнгийн бүртгэл",  href: "/admin/grades",           icon: "📊",  color: "from-blue-600 to-blue-800" },
    { label: "Ирцийн бүртгэл",   href: "/admin/attendance",       icon: "📋",  color: "from-emerald-600 to-emerald-800" },
    { label: "Хичээлүүд",        href: "/admin/classes",          icon: "📚",  color: "from-amber-600 to-amber-800" },
    { label: "Багш нар",         href: "/admin/teachers",         icon: "🧑‍🏫", color: "from-pink-600 to-pink-800" },
    { label: "Төлбөр",           href: "/admin/finance",          icon: "💰",  color: "from-teal-600 to-teal-800" },
    { label: "Хуваарь",          href: "/admin/timetable",        icon: "📅",  color: "from-cyan-600 to-cyan-800" },
    { label: "Цалин",            href: "/admin/staff-salaries",   icon: "💵",  color: "from-green-600 to-green-800" },
    { label: "Эрхийн удирдлага", href: "/admin/role-management",  icon: "🔐",  color: "from-rose-600 to-rose-800" },
  ];

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-6xl space-y-6">

            {/* Header */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Систем</p>
              <h1 className="mt-1 text-2xl font-semibold">Админы самбар</h1>
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
                    <div className={`h-12 w-12 rounded-full ${s.color} flex items-center justify-center text-xl`}>
                      {s.icon}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick links */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/60 mb-4">Хурдан хандалт</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {quickLinks.map((l) => (
                  <Link key={l.href} href={l.href}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${l.color} flex items-center justify-center text-xl shrink-0`}>
                      {l.icon}
                    </div>
                    <span className="font-medium">{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent students */}
            {!loading && recentStudents.length > 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/60">Сүүлд нэмэгдсэн оюутнууд</h2>
                  <Link href="/admin/students" className="text-xs text-violet-400 hover:text-violet-300">Бүгдийг харах →</Link>
                </div>
                <div className="space-y-3">
                  {recentStudents.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold">{s.firstName.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{s.lastName} {s.firstName}</p>
                        <p className="text-xs text-white/40">{s.user.userId} · {s.major ?? "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state — DB хоосон үед заавар */}
            {!loading && stats.totalStudents === 0 && stats.totalTeachers === 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md">
                <div className="text-center py-4">
                  <p className="text-2xl mb-3">🚀</p>
                  <h3 className="font-semibold text-white mb-2">Системийг эхлүүлэх</h3>
                  <p className="text-sm text-white/50 mb-5">Эхлээд оюутан, багш, хичээл нэмнэ үү</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/admin/students"
                      className="rounded-lg border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm text-violet-300 hover:bg-violet-500/25">
                      + Оюутан нэмэх
                    </Link>
                    <Link href="/admin/teachers"
                      className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/25">
                      + Багш нэмэх
                    </Link>
                    <Link href="/admin/classes"
                      className="rounded-lg border border-amber-400/30 bg-amber-500/15 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/25">
                      + Хичээл нэмэх
                    </Link>
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
