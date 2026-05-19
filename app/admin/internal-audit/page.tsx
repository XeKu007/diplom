"use client";

import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function InternalAuditPage() {
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
          <h1 className="text-2xl font-semibold text-white">Дотоод хяналт</h1>
          <p className="mt-2 text-white/60">
            Сургуулийн дотоод хяналтын үйл ажиллагаа, шалгалтын үр дүн
          </p>
        </div>

        {/* Дотоод хяналтын хэсэг */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Идэвхтэй дотоод хяналтууд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Идэвхтэй хяналтууд</h2>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                3 идэвхтэй
              </span>
            </div>
            <div className="space-y-4">
              {[
                { 
                  title: "Төлбөрийн системийн дотоод хяналт", 
                  startDate: "2025-04-01", 
                  endDate: "2025-04-30",
                  progress: 75,
                  auditor: "Б.Эрдэнэ"
                },
                { 
                  title: "Цалингийн системийн дотоод хяналт", 
                  startDate: "2025-03-15", 
                  endDate: "2025-04-15",
                  progress: 100,
                  auditor: "Ц.Мөнхбат"
                },
                { 
                  title: "Тэтгэлгийн системийн дотоод хяналт", 
                  startDate: "2025-05-01", 
                  endDate: "2025-05-31",
                  progress: 25,
                  auditor: "Д.Сүхбат"
                },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      item.progress === 100 
                        ? "bg-green-500/20 text-green-300" 
                        : item.progress >= 50
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {item.progress}%
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    <div>Хянагч: {item.auditor}</div>
                    <div>{item.startDate} - {item.endDate}</div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div 
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg bg-blue-600/20 px-4 py-2.5 text-sm font-medium text-blue-300 hover:bg-blue-600/30">
              Шинэ хяналт эхлүүлэх
            </button>
          </div>

          {/* Дотоод хяналтын баг */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Хяналтын баг</h2>
            <div className="space-y-3">
              {[
                { name: "Б.Эрдэнэ", role: "Тэргүүн хянагч", department: "Санхүү" },
                { name: "Ц.Мөнхбат", role: "Хянагч", department: "Санхүү" },
                { name: "Д.Сүхбат", role: "Хянагч", department: "Сургалт" },
                { name: "Г.Баярмаа", role: "Туслах хянагч", department: "Санхүү" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div>
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-sm text-white/60">{item.role}</div>
                  </div>
                  <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                    {item.department}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
              Багын гишүүд нэмэх
            </button>
          </div>

          {/* Дотоод хяналтын статистик */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-white">Дотоод хяналтын статистик</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт хяналт", value: "36", change: "+4" },
                { label: "Идэвхтэй хяналт", value: "3", change: "+1" },
                { label: "Дууссан хяналт", value: "30", change: "+3" },
                { label: "Төлөвлөгдсөн хяналт", value: "3", change: "0" },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-white/70">{item.label}</div>
                  <div className="mt-2 text-xs text-green-400">{item.change} сүүлийн 6 сар</div>
                </div>
              ))}
            </div>
          </div>

          {/* Хяналтын арга зүй */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Хяналтын арга зүй</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Баримт шалгалт</span>
                <span className="text-white">18</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Ярилцлага</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Ажиглалт</span>
                <span className="text-white">4</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Тооцоолол</span>
                <span className="text-white">2</span>
              </div>
            </div>
          </div>

          {/* Хяналтын хэрэгслүүд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Хяналтын хэрэгслүүд</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Хяналтын төлөвлөгөө</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4.5 1.8v2.4M11.5 1.8v2.4M2 6h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Асуудлын бүртгэл</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 3v2M8 11v2M3 8h2M11 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Дүгнэлтийн тайлан</span>
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