"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

interface StudentDetail {
  id: string; firstName: string; lastName: string;
  email: string | null; phone: string | null; major: string | null;
  classGroup: string | null; semester: string | null; status: string; gpa: number;
  user: { userId: string };
  enrollments: { id: string; course: { id: string; name: string; code: string; credits: number } }[];
  grades: { id: string; totalScore: number | null; letterGrade: string | null; course: { name: string } }[];
  payments: { id: string; term: string; amount: number; status: string }[];
  attendances: { id: string; date: string; status: string; course: { name: string } }[];
}

interface Course { id: string; name: string; code: string; credits: number }

const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Оюутны жагсаалт");
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEnroll, setShowEnroll] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState<"info" | "grades" | "attendance" | "payments" | "courses">("info");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        fetch(`/api/students/${id}`).then((r) => r.json()),
        fetch("/api/courses").then((r) => r.json()),
      ]);
      setStudent(s);
      setAllCourses(Array.isArray(c) ? c : []);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const enrolledIds = new Set(student?.enrollments?.map((e) => e.course.id) ?? []);
  const availableCourses = allCourses.filter((c) => !enrolledIds.has(c.id));

  const handleEnroll = async () => {
    if (!selectedCourse) { setError("Хичээл сонгоно уу"); return; }
    setEnrolling(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id, courseId: selectedCourse }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess("Хичээлд амжилттай бүртгэлээ");
      setShowEnroll(false); setSelectedCourse(""); load();
    } finally { setEnrolling(false); }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm("Энэ хичээлийн бүртгэлийг устгах уу?")) return;
    await fetch(`/api/enrollments/${enrollmentId}`, { method: "DELETE" });
    setSuccess("Бүртгэл устгагдлаа");
    load();
  };

  const statusLabel = (s: string) => ({ active: "Идэвхтэй", leave: "Чөлөөтэй", graduated: "Төгссөн", expelled: "Хасагдсан" }[s] ?? s);
  const attLabel = (s: string) => ({ present: "Ирсэн", absent: "Тасалсан", late: "Хоцорсон", excused: "Чөлөөтэй" }[s] ?? s);
  const attColor = (s: string) => ({ present: "text-emerald-400", absent: "text-red-400", late: "text-amber-400", excused: "text-blue-400" }[s] ?? "text-white/50");
  const payColor = (s: string) => ({ paid: "text-emerald-400", pending: "text-amber-400", overdue: "text-red-400" }[s] ?? "text-white/50");
  const payLabel = (s: string) => ({ paid: "Төлсөн", pending: "Хүлээгдэж байна", overdue: "Хугацаа хэтэрсэн" }[s] ?? s);
  const lcColor = (l: string | null) => ({ A: "text-emerald-400", B: "text-blue-400", C: "text-amber-400", D: "text-orange-400" }[l ?? ""] ?? "text-red-400");

  const TABS = [
    { key: "info",       label: "Мэдээлэл" },
    { key: "courses",    label: `Хичээл (${student?.enrollments?.length ?? 0})` },
    { key: "grades",     label: `Дүн (${student?.grades?.length ?? 0})` },
    { key: "attendance", label: `Ирц (${student?.attendances?.length ?? 0})` },
    { key: "payments",   label: `Төлбөр (${student?.payments?.length ?? 0})` },
  ] as const;

  if (loading) return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
    </div>
  );

  if (!student) return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/50 mb-4">Оюутан олдсонгүй</p>
        <Link href="/admin/students" className="text-violet-400 hover:text-violet-300">← Буцах</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-5xl space-y-5">

            {/* Header */}
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="text-white/40 hover:text-white text-sm">← Буцах</button>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">{student.lastName} {student.firstName}</h1>
                <p className="text-sm text-white/50">{student.user.userId} · {student.major ?? "—"}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs ${student.status === "active" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-amber-400/30 bg-amber-500/10 text-amber-300"}`}>
                {statusLabel(student.status)}
              </span>
            </div>

            {/* Alerts */}
            {success && <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">✅ {success}</div>}
            {error   && <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">❌ {error}</div>}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "GPA",     value: student.gpa.toFixed(2), color: "text-violet-300" },
                { label: "Хичээл",  value: student.enrollments?.length ?? 0, color: "text-emerald-300" },
                { label: "Дүн",     value: student.grades?.length ?? 0, color: "text-amber-300" },
                { label: "Ирц",     value: student.attendances?.length ?? 0, color: "text-cyan-300" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-[#081120]/70 p-3 text-center backdrop-blur-md">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((t) => (
                <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${tab === t.key ? "bg-violet-500/20 border border-violet-400/30 text-violet-200" : "text-white/40 hover:text-white/70"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">

              {/* Info */}
              {tab === "info" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Нэр",          value: `${student.lastName} ${student.firstName}` },
                    { label: "Оюутны ID",    value: student.user.userId },
                    { label: "И-мэйл",       value: student.email },
                    { label: "Утас",         value: student.phone },
                    { label: "Тэнхим",       value: student.major },
                    { label: "Анги",         value: student.classGroup },
                    { label: "Семестер",     value: student.semester },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                      <p className="text-xs text-white/40">{item.label}</p>
                      <p className="text-sm text-white mt-0.5">{item.value ?? "—"}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Courses */}
              {tab === "courses" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white/80">Бүртгэлтэй хичээлүүд</p>
                    <button onClick={() => { setShowEnroll(true); setError(""); }}
                      className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/25">
                      + Хичээлд бүртгэх
                    </button>
                  </div>
                  {student.enrollments?.length === 0 ? (
                    <p className="text-center py-8 text-white/40">Хичээлд бүртгэгдээгүй байна</p>
                  ) : (
                    <div className="space-y-2">
                      {student.enrollments?.map((e) => (
                        <div key={e.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                          <div>
                            <p className="text-sm font-medium">{e.course.name}</p>
                            <p className="text-xs text-white/40">{e.course.code} · {e.course.credits} кредит</p>
                          </div>
                          <button onClick={() => handleUnenroll(e.id)}
                            className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20">
                            Хасах
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Grades */}
              {tab === "grades" && (
                <div>
                  {student.grades?.length === 0 ? (
                    <p className="text-center py-8 text-white/40">Дүн байхгүй байна</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            {["Хичээл","Нийт оноо","Үнэлгээ"].map((h) => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {student.grades?.map((g) => (
                            <tr key={g.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                              <td className="px-4 py-3">{g.course.name}</td>
                              <td className="px-4 py-3 font-bold">{g.totalScore ?? "—"}</td>
                              <td className="px-4 py-3"><span className={`font-bold text-lg ${lcColor(g.letterGrade)}`}>{g.letterGrade ?? "—"}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Attendance */}
              {tab === "attendance" && (
                <div>
                  {student.attendances?.length === 0 ? (
                    <p className="text-center py-8 text-white/40">Ирцийн бүртгэл байхгүй байна</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {student.attendances?.slice(0, 30).map((a) => (
                        <div key={a.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                          <div>
                            <p className="text-sm">{a.course.name}</p>
                            <p className="text-xs text-white/40">{new Date(a.date).toLocaleDateString("mn-MN")}</p>
                          </div>
                          <span className={`text-sm font-medium ${attColor(a.status)}`}>{attLabel(a.status)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Payments */}
              {tab === "payments" && (
                <div>
                  {student.payments?.length === 0 ? (
                    <p className="text-center py-8 text-white/40">Төлбөрийн бүртгэл байхгүй байна</p>
                  ) : (
                    <div className="space-y-2">
                      {student.payments?.map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                          <p className="text-sm font-medium">{p.term}</p>
                          <div className="text-right">
                            <p className="font-bold">{fmt(p.amount)}</p>
                            <span className={`text-xs ${payColor(p.status)}`}>{payLabel(p.status)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Enroll Modal */}
      {showEnroll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Хичээлд бүртгэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div>
              <label className="text-xs text-white/50 mb-2 block">Хичээл сонгох</label>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2.5 text-sm text-white focus:outline-none">
                <option value="">— Сонгох —</option>
                {availableCourses.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0a1628]">{c.name} ({c.code})</option>
                ))}
              </select>
              {availableCourses.length === 0 && (
                <p className="text-xs text-white/40 mt-2">Бүртгэх боломжтой хичээл байхгүй байна</p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowEnroll(false); setSelectedCourse(""); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={handleEnroll} disabled={enrolling || !selectedCourse}
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {enrolling ? "Бүртгэж байна..." : "Бүртгэх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
