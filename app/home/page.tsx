"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const CourseGrid = dynamic(() => import("@/components/CourseGrid"), {
  ssr: false,
  loading: () => (
    <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
      <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
    </div>
  ),
});

interface StudentInfo {
  firstName: string; lastName: string; major: string | null;
  classGroup: string | null; semester: string | null; gpa: number;
  grades: { totalScore: number | null }[];
  payments: { status: string; amount: number }[];
}

export default function HomePage() {
  const [activeMenu, setActiveMenu] = useState("Нүүр хуудас");
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (me) => {
        if (!me?.userId) return;
        const res = await fetch("/api/students");
        const list = await res.json();
        const found = list.find((s: { userId: string }) => s.userId === me.userId);
        if (found) {
          const detail = await fetch(`/api/students/${found.id}`).then((r) => r.json());
          setStudent(detail);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleMenuChange = useCallback((menu: string) => {
    setActiveMenu(menu);
  }, []);

  const pendingPayment = student?.payments?.find((p) => p.status !== "paid");
  const avgScore = student?.grades?.length
    ? Math.round(student.grades.reduce((s, g) => s + (g.totalScore ?? 0), 0) / student.grades.length)
    : null;

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={handleMenuChange} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-6xl space-y-5">

            {/* Welcome */}
            {!loading && student && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-2xl font-bold shrink-0">
                    {student.firstName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold">Сайн байна уу, {student.lastName} {student.firstName}!</h1>
                    <p className="text-sm text-white/50 mt-0.5">{student.major ?? "—"} · {student.classGroup ?? "—"} · {student.semester ?? "—"}-р семестер</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
                    {[
                      { label: "GPA",       value: student.gpa.toFixed(2), color: "text-violet-300" },
                      { label: "Дундаж",    value: avgScore !== null ? `${avgScore}%` : "—", color: "text-emerald-300" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center">
                        <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-white/40">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending payment alert */}
                {pendingPayment && (
                  <div className="mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <p className="text-sm font-medium text-amber-300">Төлбөрийн мэдэгдэл</p>
                      <p className="text-xs text-white/50 mt-0.5">
                        {pendingPayment.amount.toLocaleString("mn-MN")}₮ төлбөр хүлээгдэж байна
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <div className="h-20 animate-pulse rounded-xl bg-white/5" />
              </div>
            )}

            {/* Course grid */}
            <CourseGrid />
          </div>
        </main>
      </div>
    </div>
  );
}
