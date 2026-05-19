"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Payment {
  id: string;
  term: string;
  amount: number;
  status: string;
  paidAt: string | null;
  note: string | null;
}

const statusLabel = (s: string) =>
  ({ paid: "Төлсөн", pending: "Хүлээгдэж байна", overdue: "Хугацаа хэтэрсэн" }[s] ?? s);

const statusColor = (s: string) => ({
  paid:    "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  pending: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  overdue: "border-red-400/30 bg-red-500/10 text-red-300",
}[s] ?? "border-white/10 text-white/50");

export default function PaymentPage() {
  const [activeMenu, setActiveMenu] = useState("Оюутан");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments")
      .then((r) => r.json())
      .then((d) => setPayments(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const total   = payments.reduce((s, p) => s + p.amount, 0);
  const paid    = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-3xl space-y-5">

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Нийт төлбөр", value: fmt(total), color: "text-white" },
                { label: "Төлсөн",       value: fmt(paid),  color: "text-emerald-400" },
                { label: "Үлдэгдэл",     value: fmt(pending), color: pending > 0 ? "text-amber-400" : "text-white/40" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-[#081120]/70 p-4 text-center backdrop-blur-md">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* List */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-widest text-white/60 mb-4">Төлбөрийн түүх</h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : payments.length === 0 ? (
                <p className="text-center py-12 text-white/40">Төлбөрийн мэдээлэл байхгүй байна</p>
              ) : (
                <div className="space-y-3">
                  {payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                      <div>
                        <p className="font-medium">{p.term}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {p.paidAt ? new Date(p.paidAt).toLocaleDateString("mn-MN") : "—"}
                        </p>
                        {p.note && <p className="text-xs text-white/30 mt-0.5">{p.note}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{fmt(p.amount)}</p>
                        <span className={`mt-1 inline-block rounded-full border px-3 py-0.5 text-xs ${statusColor(p.status)}`}>
                          {statusLabel(p.status)}
                        </span>
                      </div>
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
