"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Salary {
  id: string;
  month: string;
  base: number;
  bonus: number;
  deduction: number;
  net: number;
  status: string;
  paidAt: string | null;
}

export default function TeacherSalaryPage() {
  const [activeMenu, setActiveMenu] = useState("Цалин");
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/salaries")
      .then((r) => r.json())
      .then((d) => setSalaries(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";
  const totalNet = salaries.reduce((s, r) => s + r.net, 0);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-3xl space-y-5">

            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-4 backdrop-blur-md text-center">
              <p className="text-xs text-white/50 mb-1">Нийт авсан цалин</p>
              <p className="text-3xl font-bold text-emerald-400">{fmt(totalNet)}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-widest text-white/60 mb-4">Цалингийн түүх</h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : salaries.length === 0 ? (
                <p className="text-center py-12 text-white/40">Цалингийн мэдээлэл байхгүй байна</p>
              ) : (
                <div className="space-y-3">
                  {salaries.map((s) => (
                    <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold">{s.month}</p>
                        <span className={`rounded-full border px-3 py-0.5 text-xs ${s.status === "paid" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-amber-400/30 bg-amber-500/10 text-amber-300"}`}>
                          {s.status === "paid" ? "Олгосон" : "Хүлээгдэж байна"}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-center text-xs">
                        {[
                          { label: "Үндсэн",   value: fmt(s.base),      color: "text-white" },
                          { label: "Нэмэгдэл", value: fmt(s.bonus),     color: "text-emerald-400" },
                          { label: "Суутгал",  value: fmt(s.deduction), color: "text-red-400" },
                          { label: "Цэвэр",    value: fmt(s.net),       color: "text-violet-400 font-bold" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-lg border border-white/10 bg-white/5 p-2">
                            <p className="text-white/40 mb-1">{item.label}</p>
                            <p className={item.color}>{item.value}</p>
                          </div>
                        ))}
                      </div>
                      {s.paidAt && (
                        <p className="text-xs text-white/30 mt-2 text-right">
                          Олгосон: {new Date(s.paidAt).toLocaleDateString("mn-MN")}
                        </p>
                      )}
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
