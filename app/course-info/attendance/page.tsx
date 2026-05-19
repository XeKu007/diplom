"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AttRow {
  id: string; date: string; status: string; courseName: string; courseCode: string;
}

const attLabel = (s: string) => ({ present: "Ирсэн", absent: "Тасалсан", late: "Хоцорсон", excused: "Чөлөөтэй" }[s] ?? s);
const attColor = (s: string) => ({
  present: "text-emerald-400", absent: "text-red-400", late: "text-amber-400", excused: "text-blue-400",
}[s] ?? "text-white/50");

export default function AttendancePage() {
  const [activeMenu, setActiveMenu] = useState("Ирц");
  const [records, setRecords] = useState<AttRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then((d) => setRecords(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  // Group by course
  const byCourse: Record<string, AttRow[]> = {};
  records.forEach((r) => {
    if (!byCourse[r.courseCode]) byCourse[r.courseCode] = [];
    byCourse[r.courseCode].push(r);
  });

  const totalPresent = records.filter((r) => r.status === "present").length;
  const totalAbsent  = records.filter((r) => r.status === "absent").length;
  const totalRate    = records.length ? Math.round((totalPresent / records.length) * 100) : 0;

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-4xl space-y-5">

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Хичээл</p>
              <h1 className="mt-1 text-2xl font-semibold">Ирцийн мэдээлэл</h1>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Нийт бүртгэл", value: records.length,  color: "text-white" },
                { label: "Ирсэн",        value: totalPresent,     color: "text-emerald-400" },
                { label: "Ирцийн хувь",  value: `${totalRate}%`,  color: totalRate >= 80 ? "text-emerald-400" : "text-red-400" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-[#081120]/70 p-4 text-center backdrop-blur-md">
                  {loading ? (
                    <div className="h-8 w-16 mx-auto animate-pulse rounded-lg bg-white/10" />
                  ) : (
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  )}
                  <p className="text-xs text-white/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
              </div>
            ) : records.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-8 text-center text-white/40 backdrop-blur-md">
                Ирцийн бүртгэл байхгүй байна
              </div>
            ) : (
              Object.entries(byCourse).map(([code, rows]) => {
                const present = rows.filter((r) => r.status === "present").length;
                const pct = Math.round((present / rows.length) * 100);
                return (
                  <div key={code} className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
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
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
                      <div className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {rows.slice(0, 9).map((r) => (
                        <div key={r.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs">
                          <span className="text-white/40">{new Date(r.date).toLocaleDateString("mn-MN")}</span>
                          <span className={`font-medium ${attColor(r.status)}`}>{attLabel(r.status)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
