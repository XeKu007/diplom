"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

interface Payment {
  id: string; term: string; amount: number; status: string; paidAt: string | null;
  student: { firstName: string; lastName: string; user: { userId: string } };
}

const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";

export default function FinanceAdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Нүүр хуудас");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((d) => setPayments(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalAll     = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid    = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + p.amount, 0);

  const recentPayments = payments.slice(0, 5);

  const quickActions = [
    { label: "Төлбөр бүртгэх",  icon: "💰", color: "from-emerald-600 to-emerald-800", link: "/admin/finance" },
    { label: "Цалин олгох",     icon: "💵", color: "from-blue-600 to-blue-800",       link: "/admin/staff-salaries" },
    { label: "Оюутнууд",        icon: "👨‍🎓", color: "from-violet-600 to-violet-800",   link: "/admin/students" },
    { label: "Тайлан",          icon: "📋", color: "from-amber-600 to-amber-800",     link: "/admin/financial-reports" },
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
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Санхүүгийн алба</p>
              <h1 className="mt-1 text-2xl font-semibold">Санхүүгийн самбар</h1>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт төлбөр",        value: fmt(totalAll),     color: "bg-violet-500",  icon: "💳" },
                { label: "Төлсөн",              value: fmt(totalPaid),    color: "bg-emerald-500", icon: "✅" },
                { label: "Хүлээгдэж байна",     value: fmt(totalPending), color: "bg-amber-500",   icon: "⏳" },
                { label: "Хугацаа хэтэрсэн",   value: fmt(totalOverdue), color: "bg-red-500",     icon: "⚠️" },
              ].map((s) => (
                <div key={s.label} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{s.label}</p>
                      {loading ? (
                        <div className="mt-2 h-8 w-24 animate-pulse rounded-lg bg-white/10" />
                      ) : (
                        <p className="mt-2 text-xl font-bold text-white">{s.value}</p>
                      )}
                    </div>
                    <div className={`h-12 w-12 rounded-full ${s.color} flex items-center justify-center text-xl`}>{s.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/60 mb-4">Хурдан хандалт</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

            {/* Recent payments */}
            {!loading && recentPayments.length > 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/60">Сүүлийн төлбөрүүд</h2>
                  <Link href="/admin/finance" className="text-xs text-violet-400 hover:text-violet-300">Бүгдийг харах →</Link>
                </div>
                <div className="space-y-3">
                  {recentPayments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">{p.student.lastName} {p.student.firstName}</p>
                        <p className="text-xs text-white/40">{p.student.user.userId} · {p.term}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{fmt(p.amount)}</p>
                        <span className={`text-xs ${p.status === "paid" ? "text-emerald-400" : p.status === "overdue" ? "text-red-400" : "text-amber-400"}`}>
                          {p.status === "paid" ? "Төлсөн" : p.status === "overdue" ? "Хэтэрсэн" : "Хүлээгдэж байна"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && payments.length === 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md text-center">
                <p className="text-2xl mb-3">💰</p>
                <h3 className="font-semibold mb-2">Төлбөрийн бүртгэл байхгүй байна</h3>
                <Link href="/admin/finance" className="inline-block mt-2 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/25">
                  + Төлбөр нэмэх
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
