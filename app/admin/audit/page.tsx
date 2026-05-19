"use client";

import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function AuditPage() {
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
          <h1 className="text-2xl font-semibold text-white">Хяналтын мэдээлэл</h1>
          <p className="mt-2 text-white/60">
            Санхүүгийн хяналт шалгалтын мэдээлэл, шалгалтын үр дүн
          </p>
        </div>

        {/* Хяналтын мэдээллийн хэсэг */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Сүүлийн шалгалтууд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">Сүүлийн шалгалтууд</h2>
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                3 ширхэг
              </span>
            </div>
            <div className="space-y-4">
              {[
                { 
                  title: "2025 оны 1-р улирлын шалгалт", 
                  date: "2025-04-15", 
                  status: "Дууссан",
                  result: "Асуудалгүй"
                },
                { 
                  title: "Төлбөрийн системийн шалгалт", 
                  date: "2025-03-20", 
                  status: "Дууссан",
                  result: "Засалт шаардлагатай"
                },
                { 
                  title: "Цалингийн системийн шалгалт", 
                  date: "2025-02-10", 
                  status: "Дууссан",
                  result: "Асуудалгүй"
                },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      item.result === "Асуудалгүй" 
                        ? "bg-green-500/20 text-green-300" 
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}>
                      {item.result}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-white/60">
                    <span>{item.date}</span>
                    <span className="text-white/80">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg bg-blue-600/20 px-4 py-2.5 text-sm font-medium text-blue-300 hover:bg-blue-600/30">
              Бүх шалгалт харах
            </button>
          </div>

          {/* Ирэх шалгалтууд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Ирэх шалгалтууд</h2>
            <div className="space-y-3">
              {[
                { title: "2025 оны 2-р улирлын шалгалт", date: "2025-07-15", type: "Улирлын" },
                { title: "Төсөв төлөвлөлтийн шалгалт", date: "2025-06-10", type: "Тусгай" },
                { title: "Тэтгэлгийн системийн шалгалт", date: "2025-05-20", type: "Тусгай" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                  <div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm text-white/60">{item.date}</div>
                  </div>
                  <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5">
              Шалгалт төлөвлөх
            </button>
          </div>

          {/* Шалгалтын статистик */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
            <h2 className="mb-4 text-lg font-medium text-white">Шалгалтын статистик</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт шалгалт", value: "24", change: "+3" },
                { label: "Асуудалгүй", value: "18", change: "+2" },
                { label: "Засалт шаардлагатай", value: "5", change: "+1" },
                { label: "Ноцтой асуудал", value: "1", change: "0" },
              ].map((item, index) => (
                <div key={index} className="rounded-lg bg-white/5 p-4">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-white/70">{item.label}</div>
                  <div className="mt-2 text-xs text-green-400">{item.change} сүүлийн 3 сар</div>
                </div>
              ))}
            </div>
          </div>

          {/* Шалгалтын төрлүүд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Шалгалтын төрлүүд</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Дотоод хяналт</span>
                <span className="text-white">12</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Гадаад хяналт</span>
                <span className="text-white">6</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Тусгай шалгалт</span>
                <span className="text-white">4</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-white/80">Улирлын шалгалт</span>
                <span className="text-white">2</span>
              </div>
            </div>
          </div>

          {/* Шалгалтын хэрэгслүүд */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 text-lg font-medium text-white">Шалгалтын хэрэгслүүд</h2>
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Шалгалтын төлөвлөгөө</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Шалгалтын тайлан</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2h8l2 2v10H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M6 7h4M6 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <button className="flex w-full items-center justify-between rounded-lg bg-white/5 p-3 hover:bg-white/10">
                <span className="text-white/80">Асуудлын бүртгэл</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 3v2M8 11v2M3 8h2M11 8h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}