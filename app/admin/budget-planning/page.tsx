"use client";

import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function BudgetPlanningPage() {
  const { getDashboardLink } = useAdminRole();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] to-[#1a0b2e] p-6">
      <div className="mx-auto max-w-6xl">
        {/* Буцах холбоос */}
        <div className="mb-6">
          <Link
            href={getDashboardLink()}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Буцах
          </Link>
        </div>

        {/* Гарчиг */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Төсөв төлөвлөлт</h1>
          <p className="mt-2 text-white/60">
            Сургуулийн санхүүгийн төсөв төлөвлөлт, зардлын урьдчилсан тооцоо
          </p>
        </div>

        {/* Төсөв төлөвлөлтийн хэсэг */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Жилийн төсөв төлөвлөлт */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Жилийн төсөв төлөвлөлт</h2>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                2025-2026
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Нийт орлого</span>
                <span className="text-lg font-semibold text-green-400">2.5 тэрбум ₮</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Нийт зардал</span>
                <span className="text-lg font-semibold text-red-400">1.8 тэрбум ₮</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-white">Цэвэр ашиг</span>
                <span className="text-xl font-bold text-white">700 сая ₮</span>
              </div>
            </div>
            <button className="mt-6 w-full rounded-lg bg-blue-600/20 px-4 py-2.5 text-sm font-medium text-blue-300 hover:bg-blue-600/30">
              Төсөв засах
            </button>
          </div>

          {/* Сар бүрийн төсөв */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Сар бүрийн төсөв</h2>
            <div className="space-y-3">
              {[
                { month: "9-р сар", income: "200 сая", expense: "150 сая" },
                { month: "10-р сар", income: "220 сая", expense: "160 сая" },
                { month: "11-р сар", income: "210 сая", expense: "155 сая" },
                { month: "12-р сар", income: "190 сая", expense: "170 сая" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <span className="text-white/80">{item.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-green-400">+{item.income} ₮</span>
                    <span className="text-sm text-red-400">-{item.expense} ₮</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
              Бүх сарын төсөв харах
            </button>
          </div>

          {/* Зардлын ангилал */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-white">Зардлын ангилал</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { category: "Цалин", amount: "850 сая", color: "bg-blue-500" },
                { category: "Байрны зардал", amount: "300 сая", color: "bg-purple-500" },
                { category: "Сургалтын материал", amount: "250 сая", color: "bg-green-500" },
                { category: "Техник хангамж", amount: "200 сая", color: "bg-yellow-500" },
                { category: "Засвар үйлчилгээ", amount: "100 сая", color: "bg-red-500" },
                { category: "Бусад зардал", amount: "100 сая", color: "bg-gray-500" },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                    <span className="text-white/90">{item.category}</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{item.amount} ₮</div>
                </div>
              ))}
            </div>
          </div>

          {/* Төсөв төлөвлөлтийн хэрэгслүүд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Төсөв төлөвлөлтийн хэрэгслүүд</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Төсөв загвар үүсгэх</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Зардлын тооцоолуур</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4h8v8H4z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 6h4v4H6z" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Төсөв тайлан гаргах</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2h8l2 2v10H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M6 7h4M6 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Төсөв төлөвлөлтийн түүх */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Төсөв төлөвлөлтийн түүх</h2>
            <div className="space-y-3">
              {[
                { year: "2024-2025", status: "Дууссан", profit: "650 сая" },
                { year: "2023-2024", status: "Дууссан", profit: "600 сая" },
                { year: "2022-2023", status: "Дууссан", profit: "550 сая" },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{item.year}</span>
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-300">
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    Цэвэр ашиг: <span className="font-medium text-white">{item.profit} ₮</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}