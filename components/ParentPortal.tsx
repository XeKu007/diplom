"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export type ParentView =
  | "overview" | "grades" | "attendance" | "payment"
  | "schedule" | "exams" | "messages";

interface Course {
  id: string; name: string; code: string; credits: number;
  room: string | null; schedule: string | null; teacher: string | null;
}
interface Grade {
  id: string; courseName: string; courseCode: string; semester: string;
  quiz1: number | null; quiz2: number | null; midterm: number | null;
  assignment: number | null; attendance: number | null; final: number | null;
  totalScore: number | null; letterGrade: string | null;
}
interface Payment {
  id: string; term: string; amount: number; status: string;
  paidAt: string | null; note: string | null;
}
interface AttRecord {
  id: string; date: string; status: string; courseName: string; courseCode: string;
}
interface Notification {
  id: string; title: string; body: string; type: string; isRead: boolean; createdAt: string;
}
interface StudentData {
  id: string; userId: string; firstName: string; lastName: string;
  email: string | null; phone: string | null; major: string | null;
  classGroup: string | null; semester: string | null; enrollmentYear: string | null;
  advisor: string | null; scholarship: string | null; dormitory: string | null;
  status: string; gpa: number; attendanceRate: number;
  courses: Course[]; grades: Grade[]; payments: Payment[];
  attendances: AttRecord[]; notifications: Notification[];
}

const VIEW_TITLES: Record<ParentView, string> = {
  overview:   "Нүүр хуудас",
  grades:     "Дүнгийн мэдээлэл",
  attendance: "Ирцийн мэдээлэл",
  payment:    "Төлбөрийн мэдээлэл",
  schedule:   "Хичээлийн хуваарь",
  exams:      "Шалгалтын хуваарь",
  messages:   "Мэдэгдэл",
};

function letterColor(l: string | null) {
  if (l === "A") return "text-emerald-300 border-emerald-400/30 bg-emerald-500/10";
  if (l === "B") return "text-blue-300 border-blue-400/30 bg-blue-500/10";
  if (l === "C") return "text-amber-300 border-amber-400/30 bg-amber-500/10";
  if (l === "D") return "text-orange-300 border-orange-400/30 bg-orange-500/10";
  return "text-red-300 border-red-400/30 bg-red-500/10";
}

function statusColor(s: string) {
  if (s === "paid")    return "text-emerald-300 border-emerald-400/30 bg-emerald-500/10";
  if (s === "pending") return "text-amber-300 border-amber-400/30 bg-amber-500/10";
  return "text-red-300 border-red-400/30 bg-red-500/10";
}

function attColor(s: string) {
  if (s === "present") return "text-emerald-400";
  if (s === "absent")  return "text-red-400";
  if (s === "late")    return "text-amber-400";
  return "text-blue-400";
}

function attLabel(s: string) {
  return { present: "Ирсэн", absent: "Тасалсан", late: "Хоцорсон", excused: "Чөлөөтэй" }[s] ?? s;
}

function payLabel(s: string) {
  return { paid: "Төлсөн", pending: "Хүлээгдэж байна", overdue: "Хугацаа хэтэрсэн" }[s] ?? s;
}

function fmt(n: number) { return n.toLocaleString("mn-MN") + "₮"; }

// ── Spinner ───────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
    </div>
  );
}

// ── Empty ─────────────────────────────────────────────────
function Empty({ text }: { text: string }) {
  return <p className="text-center py-12 text-white/40">{text}</p>;
}

// ── Card wrapper ──────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[24px] border border-white/10 bg-[#081120]/70 backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────
function Overview({ s }: { s: StudentData }) {  const totalPaid    = s.payments.filter((p) => p.status === "paid").reduce((a, b) => a + b.amount, 0);
  const totalPending = s.payments.filter((p) => p.status !== "paid").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-5">
      {/* Hero */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-800 to-violet-800 flex items-center justify-center text-3xl font-bold">
            {s.firstName.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{s.lastName} {s.firstName}</h2>
            <p className="text-sm text-white/50 mt-1">{s.major ?? "—"} · {s.classGroup ?? "—"}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {s.scholarship && <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">{s.scholarship}</span>}
              {s.semester    && <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs text-blue-300">{s.semester}-р семестер</span>}
              {s.dormitory   && <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-xs text-amber-300">{s.dormitory}</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "GPA",          value: s.gpa.toFixed(2),          color: "text-violet-300" },
          { label: "Ирцийн хувь",  value: `${s.attendanceRate}%`,    color: s.attendanceRate >= 80 ? "text-emerald-300" : "text-red-300" },
          { label: "Хичээл",       value: s.courses.length,          color: "text-amber-300" },
          { label: "Үлдэгдэл",     value: fmt(totalPending),         color: totalPending > 0 ? "text-red-300" : "text-white/40" },
        ].map((st) => (
          <Card key={st.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${st.color}`}>{st.value}</p>
            <p className="text-xs text-white/40 mt-1">{st.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Хувийн мэдээлэл */}
        <Card className="p-5">
          <p className="text-sm font-semibold text-white/80 mb-4">Хувийн мэдээлэл</p>
          <div className="space-y-3">
            {[
              { label: "Оюутны ID",    value: s.userId },
              { label: "И-мэйл",       value: s.email },
              { label: "Утас",         value: s.phone },
              { label: "Тэнхим",       value: s.major },
              { label: "Зөвлөх багш",  value: s.advisor },
              { label: "Элссэн он",    value: s.enrollmentYear },
            ].map((item) => (
              <div key={item.label} className="flex justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                <span className="text-xs text-white/40">{item.label}</span>
                <span className="text-sm text-white/80">{item.value ?? "—"}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Сүүлийн дүнгүүд */}
        <Card className="p-5">
          <p className="text-sm font-semibold text-white/80 mb-4">Сүүлийн дүнгүүд</p>
          {s.grades.length === 0 ? <Empty text="Дүн байхгүй" /> : (
            <div className="space-y-2">
              {s.grades.slice(0, 5).map((g) => (
                <div key={g.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5">
                  <div>
                    <p className="text-sm font-medium">{g.courseName}</p>
                    <p className="text-xs text-white/40">{g.courseCode} · {g.semester}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{g.totalScore ?? "—"}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${letterColor(g.letterGrade)}`}>
                      {g.letterGrade ?? "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Сүүлийн мэдэгдлүүд */}
      {s.notifications.length > 0 && (
        <Card className="p-5">
          <p className="text-sm font-semibold text-white/80 mb-4">Сүүлийн мэдэгдлүүд</p>
          <div className="space-y-2">
            {s.notifications.slice(0, 3).map((n) => (
              <div key={n.id} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-white/50 mt-0.5">{n.body}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Grades ────────────────────────────────────────────────
function GradesView({ grades }: { grades: Grade[] }) {
  if (grades.length === 0) return <Card className="p-5"><Empty text="Дүн бүртгэгдээгүй байна" /></Card>;
  return (
    <Card className="p-5 overflow-x-auto">
      <p className="text-sm font-semibold text-white/80 mb-4">Дүнгийн хуудас</p>
      <table className="w-full border-collapse text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10">
            {["Хичээл","Семестер","Сорил 1","Сорил 2","Явц","Бие даалт","Ирц","Шалгалт","Нийт","Үнэлгээ"].map((h) => (
              <th key={h} className="px-3 py-3 text-left text-xs font-medium text-white/40">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => (
            <tr key={g.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
              <td className="px-3 py-3">
                <p className="font-medium">{g.courseName}</p>
                <p className="text-xs text-white/40">{g.courseCode}</p>
              </td>
              <td className="px-3 py-3 text-white/50 text-xs">{g.semester}</td>
              <td className="px-3 py-3 text-center text-white/70">{g.quiz1 ?? "—"}</td>
              <td className="px-3 py-3 text-center text-white/70">{g.quiz2 ?? "—"}</td>
              <td className="px-3 py-3 text-center text-white/70">{g.midterm ?? "—"}</td>
              <td className="px-3 py-3 text-center text-white/70">{g.assignment ?? "—"}</td>
              <td className="px-3 py-3 text-center text-white/70">{g.attendance ?? "—"}</td>
              <td className="px-3 py-3 text-center text-white/70">{g.final ?? "—"}</td>
              <td className="px-3 py-3 text-center font-bold">{g.totalScore ?? "—"}</td>
              <td className="px-3 py-3 text-center">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${letterColor(g.letterGrade)}`}>
                  {g.letterGrade ?? "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

// ── Attendance ────────────────────────────────────────────
function AttendanceView({ attendances, rate }: { attendances: AttRecord[]; rate: number }) {
  // Group by course
  const byCourse: Record<string, AttRecord[]> = {};
  attendances.forEach((a) => {
    if (!byCourse[a.courseCode]) byCourse[a.courseCode] = [];
    byCourse[a.courseCode].push(a);
  });

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Нийт бүртгэл", value: attendances.length, color: "text-white" },
          { label: "Ирсэн",        value: attendances.filter((a) => a.status === "present").length, color: "text-emerald-400" },
          { label: "Ирцийн хувь",  value: `${rate}%`, color: rate >= 80 ? "text-emerald-400" : "text-red-400" },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/40 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Per course */}
      {Object.entries(byCourse).map(([code, rows]) => {
        const present = rows.filter((r) => r.status === "present").length;
        const pct = Math.round((present / rows.length) * 100);
        return (
          <Card key={code} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">{rows[0].courseName}</p>
                <p className="text-xs text-white/40">{code}</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-bold ${pct >= 80 ? "text-emerald-400" : "text-red-400"}`}>{pct}%</p>
                <p className="text-xs text-white/40">{present}/{rows.length}</p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
              <div className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${pct}%` }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {rows.slice(0, 8).map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs">
                  <span className="text-white/40">{new Date(r.date).toLocaleDateString("mn-MN")}</span>
                  <span className={`font-medium ${attColor(r.status)}`}>{attLabel(r.status)}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}

      {attendances.length === 0 && <Card className="p-5"><Empty text="Ирцийн бүртгэл байхгүй байна" /></Card>}
    </div>
  );
}

// ── Payment ───────────────────────────────────────────────
function PaymentView({ payments }: { payments: Payment[] }) {
  const total   = payments.reduce((s, p) => s + p.amount, 0);
  const paid    = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Нийт төлбөр", value: fmt(total),   color: "text-white" },
          { label: "Төлсөн",      value: fmt(paid),    color: "text-emerald-400" },
          { label: "Үлдэгдэл",    value: fmt(pending), color: pending > 0 ? "text-amber-400" : "text-white/40" },
        ].map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/40 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <p className="text-sm font-semibold text-white/80 mb-4">Төлбөрийн түүх</p>
        {payments.length === 0 ? <Empty text="Төлбөрийн мэдээлэл байхгүй" /> : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
                <div>
                  <p className="font-medium">{p.term}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {p.paidAt ? new Date(p.paidAt).toLocaleDateString("mn-MN") : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{fmt(p.amount)}</p>
                  <span className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs ${statusColor(p.status)}`}>
                    {payLabel(p.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ── Schedule ──────────────────────────────────────────────
function ScheduleView({ courses }: { courses: Course[] }) {
  const COLORS = [
    "border-violet-400/25 bg-violet-500/10",
    "border-amber-400/25 bg-amber-500/10",
    "border-emerald-400/25 bg-emerald-500/10",
    "border-orange-400/25 bg-orange-500/10",
    "border-pink-400/25 bg-pink-500/10",
    "border-cyan-400/25 bg-cyan-500/10",
  ];

  if (courses.length === 0) return <Card className="p-5"><Empty text="Хичээл бүртгэгдээгүй байна" /></Card>;

  return (
    <Card className="p-5">
      <p className="text-sm font-semibold text-white/80 mb-4">Хичээлийн хуваарь</p>
      <div className="space-y-3">
        {courses.map((c, i) => (
          <div key={c.id} className={`rounded-[18px] border p-4 ${COLORS[i % COLORS.length]}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-white/50 mt-0.5">{c.code} · {c.teacher ?? "—"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white/80">{c.schedule ?? "—"}</p>
                <p className="text-xs text-white/40 mt-0.5">Өрөө: {c.room ?? "—"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Notifications ─────────────────────────────────────────
function NotificationsView({ notifications }: { notifications: Notification[] }) {
  const typeStyle = (t: string) => ({
    info:    { icon: "ℹ️", color: "border-blue-400/30 bg-blue-500/10" },
    warning: { icon: "⚠️", color: "border-amber-400/30 bg-amber-500/10" },
    success: { icon: "✅", color: "border-emerald-400/30 bg-emerald-500/10" },
    error:   { icon: "❌", color: "border-red-400/30 bg-red-500/10" },
  }[t] ?? { icon: "📢", color: "border-white/10 bg-white/5" });

  if (notifications.length === 0) return <Card className="p-5"><Empty text="Мэдэгдэл байхгүй байна" /></Card>;

  return (
    <Card className="p-5">
      <p className="text-sm font-semibold text-white/80 mb-4">Мэдэгдлүүд</p>
      <div className="space-y-3">
        {notifications.map((n) => {
          const ts = typeStyle(n.type);
          return (
            <div key={n.id} className={`rounded-xl border p-4 ${ts.color}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0">{ts.icon}</span>
                <div>
                  <p className="font-medium text-sm">{n.title}</p>
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
    </Card>
  );
}

// ── Main component ────────────────────────────────────────
export default function ParentPortal({ view }: { view: ParentView }) {
  const [activeMenu, setActiveMenu] = useState(VIEW_TITLES[view]);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { setActiveMenu(VIEW_TITLES[view]); }, [view]);

  useEffect(() => {
    fetch("/api/parent/student")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setStudent(d);
      })
      .catch(() => setError("Сүлжээний алдаа гарлаа"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-5xl space-y-5">

            {view !== "overview" && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Эцэг/эх</p>
                <h1 className="mt-1 text-2xl font-semibold">{VIEW_TITLES[view]}</h1>
              </div>
            )}

            {loading && <Spinner />}

            {!loading && error && (
              <Card className="p-6 border-red-400/20 bg-red-500/10">
                <p className="text-red-300 font-medium">⚠️ {error}</p>
                <p className="text-sm text-white/50 mt-1">
                  Эцэг/эхийн бүртгэлтэй оюутан олдсонгүй. Системийн администратортай холбогдоно уу.
                </p>
              </Card>
            )}

            {!loading && !error && student && (
              <>
                {view === "overview"   && <Overview s={student} />}
                {view === "grades"     && <GradesView grades={student.grades} />}
                {view === "attendance" && <AttendanceView attendances={student.attendances} rate={student.attendanceRate} />}
                {view === "payment"    && <PaymentView payments={student.payments} />}
                {view === "schedule"   && <ScheduleView courses={student.courses} />}
                {view === "exams"      && <ScheduleView courses={student.courses} />}
                {view === "messages"   && <NotificationsView notifications={student.notifications} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
