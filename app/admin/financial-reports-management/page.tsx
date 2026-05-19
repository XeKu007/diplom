"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function FinancialReportsManagement() {
  const [activeMenu, setActiveMenu] = useState("Санхүүгийн тайлан");
  const { getDashboardLink, getRoleLabel } = useAdminRole();

  const reports = [
    { id: 1, name: "2026 оны 1-р улирлын тайлан", type: "Улирлын", period: "2026-01-01 - 2026-03-31", status: "Баталгаажсан", size: "2.4 MB" },
    { id: 2, name: "2026 оны 1-р сарын тайлан", type: "Сар бүр", period: "2026-01-01 - 2026-01-31", status: "Баталгаажсан", size: "1.8 MB" },
    { id: 3, name: "2026 оны 2-р сарын тайлан", type: "Сар бүр", period: "2026-02-01 - 2026-02-28", status: "Баталгаажсан", size: "1.9 MB" },
    { id: 4, name: "2026 оны 3-р сарын тайлан", type: "Сар бүр", period: "2026-03-01 - 2026-03-31", status: "Баталгаажсан", size: "2.1 MB" },
    { id: 5, name: "2026 оны 4-р сарын тайлан", type: "Сар бүр", period: "2026-04-01 - 2026-04-30", status: "Бэлтгэгдсэн", size: "2.2 MB" },
    { id: 6, name: "2026 оны жилийн төлөвлөгөө", type: "Төлөвлөгөө", period: "2026-01-01 - 2026-12-31", status: "Баталгаажсан", size: "3.5 MB" },
  ];

  const reportTypes = [
    { type: "Сар бүр", count: 4, color: "bg-blue-500" },
    { type: "Улирлын", count: 1, color: "bg-emerald-500" },
    { type: "Жилийн", count: 0, color: "bg-amber-500" },
    { type: "Тусгай", count: 1, color: "bg-purple-500" },
  ];

  const getStatusColor = (status: string) => {
    return status === "Баталгаажсан" 
      ? "bg-emerald-500/10 text-emerald-400" 
      : "bg-amber-500/10 text-amber-400";
  };

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main
          className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{
            backgroundImage:
              "linear-gradient(rgba(8, 14, 30, 0.9), rgba(8, 12, 24, 0.95)), url('/indra-bg.jpg')",
            backgroundPosition: "center center",
            backgroundSize: "72%",
          }}
        >
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Санхүүгийн тайлан</h1>
                <p className="mt-1 text-sm text-white/50">Бүрэн эрхт админы санхүүгийн тайлангийн удирдлага</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">{getRoleLabel()}</p>
                  <p className="text-xs text-white/40">Санхүүгийн тайлан</p>
                </div>
                <Link href={getDashboardLink()} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт тайлан", value: reports.length, icon: "📋", color: "bg-blue-500" },
                { label: "Баталгаажсан", value: reports.filter(r => r.status === "Баталгаажсан").length, icon: "✅", color: "bg-emerald-500" },
                { label: "Бэлтгэгдсэн", value: reports.filter(r => r.status === "Бэлтгэгдсэн").length, icon: "📝", color: "bg-amber-500" },
                { label: "Нийт хэмжээ", value: "13.9 MB", icon: "💾", color: "bg-purple-500" },
              ].map((stat, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Report Types */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Тайлангийн төрлүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {reportTypes.map((item, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-white">{item.type}</p>
                        <p className="text-sm text-white/50">{item.count} тайлан</p>
                      </div>
                      <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center`}>
                        <span className="text-lg">📊</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                        style={{ width: `${(item.count / reports.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports List */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Санхүүгийн тайлангууд</h2>
                <button className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/25">
                  Шинэ тайлан үүсгэх
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Тайлангийн нэр</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төрөл</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Хугацаа</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Хэмжээ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">📊</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{report.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                            {report.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/70">{report.period}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-3 py-1 text-xs ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/70">{report.size}</p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Татаж авах
                            </button>
                            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Харах
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Report Generation */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Тайлан үүсгэх</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Сар бүрийн тайлан", 
                    description: "Сар бүрийн санхүүгийн тайлан үүсгэх",
                    icon: "📅",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Улирлын тайлан", 
                    description: "Улирлын санхүүгийн тайлан үүсгэх",
                    icon: "📊",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Жилийн тайлан", 
                    description: "Жилийн санхүүгийн тайлан үүсгэх",
                    icon: "📈",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Төсөв төлөвлөлт", 
                    description: "Төсөв төлөвлөлтийн тайлан үүсгэх",
                    icon: "💰",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Тэнхимийн тайлан", 
                    description: "Тэнхимийн санхүүгийн тайлан үүсгэх",
                    icon: "🏛️",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Хяналтын тайлан", 
                    description: "Хяналтын тайлан үүсгэх",
                    icon: "👁️",
                    color: "from-rose-500 to-red-600"
                  },
                ].map((tool, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                        <span className="text-xl">{tool.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{tool.name}</h3>
                        <p className="text-sm text-white/50">{tool.description}</p>
                      </div>
                    </div>
                    <button className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                      Үүсгэх
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}