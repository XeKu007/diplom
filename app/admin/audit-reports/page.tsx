"use client";

import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function AuditReportsPage() {
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
          <h1 className="text-2xl font-semibold text-white">Шалгалтын тайлан</h1>
          <p className="mt-2 text-white/60">
            Санхүүгийн шалгалтын тайлангууд, дүгнэлт, санал зөвлөмж
          </p>
        </div>

        {/* Шалгалтын тайлангийн хэсэг */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Сүүлийн тайлангууд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Сүүлийн тайлангууд</h2>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                5 ширхэг
              </span>
            </div>
            <div className="space-y-4">
              {[
                { 
                  title: "2025 оны 1-р улирлын шалгалтын тайлан", 
                  date: "2025-04-20", 
                  type: "Улирлын",
                  status: "Баталгаажсан"
                },
                { 
                  title: "Төлбөрийн системийн шалгалтын тайлан", 
                  date: "2025-03-25", 
                  type: "Тусгай",
                  status: "Баталгаажсан"
                },
                { 
                  title: "Цалингийн системийн шалгалтын тайлан", 
                  date: "2025-02-15", 
                  type: "Тусгай",
                  status: "Хүлээгдэж буй"
                },
                { 
                  title: "2024 оны 4-р улирлын шалгалтын тайлан", 
                  date: "2025-01-10", 
                  type: "Улирлын",
                  status: "Баталгаажсан"
                },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      item.status === "Баталгаажсан" 
                        ? "bg-green-500/20 text-green-300" 
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                    <span>{item.date}</span>
                    <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg bg-blue-600/20 px-4 py-2.5 text-sm font-medium text-blue-300 hover:bg-blue-600/30">
              Бүх тайлан харах
            </button>
          </div>

          {/* Тайлан үүсгэх */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Тайлан үүсгэх</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Улирлын тайлан</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2h8l2 2v10H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M6 7h4M6 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Тусгай тайлан</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 3v2M8 11v2M3 8h2M11 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Дүгнэлтийн тайлан</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l2.5 2.5L13 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
            <div className="mt-6 rounded-lg bg-blue-500/10 p-4">
              <h3 className="mb-2 text-sm font-medium text-blue-300">Тайлан үүсгэх заавар</h3>
              <p className="text-sm text-white/60">
                Тайлан үүсгэхдээ шалгалтын төрөл, хугацаа, хамрах хүрээг зөв сонгоно уу.
              </p>
            </div>
          </div>

          {/* Та��лангийн статистик */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-white">Тайлангийн статистик</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт тайлан", value: "48", change: "+5" },
                { label: "Улирлын тайлан", value: "12", change: "+1" },
                { label: "Тусгай тайлан", value: "32", change: "+3" },
                { label: "Дүгнэлтийн тайлан", value: "4", change: "+1" },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-white/70">{item.label}</div>
                  <div className="mt-2 text-xs text-green-400">{item.change} сүүлийн жил</div>
                </div>
              ))}
            </div>
          </div>

          {/* Тайлангийн формат */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Тайлангийн формат</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">PDF формат</span>
                <span className="text-white">32</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Excel формат</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Word формат</span>
                <span className="text-white">4</span>
              </div>
            </div>
            <button className="mt-6 w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
              Формат тохируулах
            </button>
          </div>

          {/* Тайлан хуваалцах */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Тайлан хуваалцах</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Удирдлагад илгээх</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Хэвлэх</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4h8v4h2V4a2 2 0 00-2-2H4a2 2 0 00-2 2v4h2V4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M2 12h12v2H2z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 8h8v6H4z" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Архивлах</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2h8l2 2v10H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M6 7h4M6 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}