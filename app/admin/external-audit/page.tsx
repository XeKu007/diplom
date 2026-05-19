"use client";

import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function ExternalAuditPage() {
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
          <h1 className="text-2xl font-semibold text-white">Гадаад хяналт</h1>
          <p className="mt-2 text-white/60">
            Гадаад байгууллагын хяналт шалгалтын мэдээлэл, үр дүн
          </p>
        </div>

        {/* Гадаад хяналтын хэсэг */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Гадаад хяналтын байгууллагууд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Хяналтын байгууллагууд</h2>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                4 байгууллага
              </span>
            </div>
            <div className="space-y-4">
              {[
                { 
                  name: "Татварын ерөнхий газар", 
                  lastAudit: "2025-03-15", 
                  nextAudit: "2025-09-15",
                  status: "Идэвхтэй"
                },
                { 
                  name: "Монголбанк", 
                  lastAudit: "2024-11-20", 
                  nextAudit: "2025-11-20",
                  status: "Идэвхтэй"
                },
                { 
                  name: "Боловсролын яам", 
                  lastAudit: "2025-01-10", 
                  nextAudit: "2026-01-10",
                  status: "Идэвхтэй"
                },
                { 
                  name: "Нягтлан бодох бүртгэлийн үндэсний зөвлөл", 
                  lastAudit: "2024-08-05", 
                  nextAudit: "2025-08-05",
                  status: "Идэвхтэй"
                },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.name}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      item.status === "Идэвхтэй" 
                        ? "bg-green-500/20 text-green-300" 
                        : "bg-gray-500/20 text-gray-300"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    <div>Сүүлийн хяналт: {item.lastAudit}</div>
                    <div>Дараагийн хяналт: {item.nextAudit}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg bg-blue-600/20 px-4 py-2.5 text-sm font-medium text-blue-300 hover:bg-blue-600/30">
              Байгууллага нэмэх
            </button>
          </div>

          {/* Ирэх гадаад хяналтууд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Ирэх хяналтууд</h2>
            <div className="space-y-3">
              {[
                { 
                  organization: "Татварын ерөнхий газар", 
                  date: "2025-09-15", 
                  type: "Жилийн хяналт",
                  preparation: "Бэлтгэл хийгдэж байна"
                },
                { 
                  organization: "Монголбанк", 
                  date: "2025-11-20", 
                  type: "Санхүүгийн хяналт",
                  preparation: "Төлөвлөгдсөн"
                },
                { 
                  organization: "Боловсролын яам", 
                  date: "2026-01-10", 
                  type: "Боловсролын хяналт",
                  preparation: "Төлөвлөгдсөн"
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div>
                    <div className="font-medium text-white">{item.organization}</div>
                    <div className="text-sm text-white/60">{item.date} - {item.type}</div>
                  </div>
                  <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-300">
                    {item.preparation}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
              Бэлтгэл төлөвлөгөө
            </button>
          </div>

          {/* Гадаад хяналтын статистик */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-white">Гадаад хяналтын статистик</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт гадаад хяналт", value: "24", change: "+2" },
                { label: "Татварын хяналт", value: "8", change: "+1" },
                { label: "Санхүүгийн хяналт", value: "6", change: "+1" },
                { label: "Боловсролын хяналт", value: "10", change: "0" },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-white/70">{item.label}</div>
                  <div className="mt-2 text-xs text-green-400">{item.change} сүүлийн 2 жил</div>
                </div>
              ))}
            </div>
          </div>

          {/* Хяналтын үр дүн */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Хяналтын үр дүн</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Асуудалгүй</span>
                <span className="text-white">18</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Засалт шаардлагатай</span>
                <span className="text-white">5</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Ноцтой асуудал</span>
                <span className="text-white">1</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Тайлан хүлээгдэж буй</span>
                <span className="text-white">0</span>
              </div>
            </div>
          </div>

          {/* Гадаад хяналтын хэрэгслүүд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Хяналтын хэрэгслүүд</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Хяналтын бэлтгэл</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4.5 1.8v2.4M11.5 1.8v2.4M2 6h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Харилцах материал</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2h8l2 2v10H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M6 7h4M6 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Тайлан архивлах</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2h8l2 2v10H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M6 7h4M6 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-6 rounded-lg bg-blue-500/10 p-4">
              <h3 className="mb-2 text-sm font-medium text-blue-300">Гадаад хяналтын заавар</h3>
              <p className="text-sm text-white/60">
                Гадаад хяналтад бэлтгэхдээ бүх шаардлагатай баримт бичгүүдийг бэлтгэсэн байх.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}