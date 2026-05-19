"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function FinanceManagement() {
  const [activeMenu, setActiveMenu] = useState("Төлбөрийн мэдээлэл");
  const { getDashboardLink, getRoleLabel } = useAdminRole();

  const financialData = [
    { id: 1, department: "Програм хангамжийн тэнхим", budget: "₮ 1.2 тэрбум", spent: "₮ 980 сая", remaining: "₮ 220 сая", status: "Хэвийн" },
    { id: 2, department: "Сүлжээний технологийн тэнхим", budget: "₮ 1.1 тэрбум", spent: "₮ 850 сая", remaining: "₮ 250 сая", status: "Хэвийн" },
    { id: 3, department: "Мэдээллийн аюулгүй байдлын тэнхим", budget: "₮ 900 сая", spent: "₮ 720 сая", remaining: "₮ 180 сая", status: "Хэвийн" },
    { id: 4, department: "Мэдээлэл зүйн тэнхим", budget: "₮ 950 сая", spent: "₮ 820 сая", remaining: "₮ 130 сая", status: "Анхаарал" },
    { id: 5, department: "Дижитал маркетингийн тэнхим", budget: "₮ 750 сая", spent: "₮ 680 сая", remaining: "₮ 70 сая", status: "Анхаарал" },
    { id: 6, department: "Системийн инженерийн тэнхим", budget: "₮ 650 сая", spent: "₮ 550 сая", remaining: "₮ 100 сая", status: "Хэвийн" },
  ];

  const paymentStats = [
    { month: "1-р сар", total: "₮ 245,800,000", paid: "₮ 230,500,000", pending: "₮ 15,300,000" },
    { month: "2-р сар", total: "₮ 238,500,000", paid: "₮ 225,200,000", pending: "₮ 13,300,000" },
    { month: "3-р сар", total: "₮ 252,300,000", paid: "₮ 240,800,000", pending: "₮ 11,500,000" },
    { month: "4-р сар", total: "₮ 248,900,000", paid: "₮ 235,600,000", pending: "₮ 13,300,000" },
  ];

  const getStatusColor = (status: string) => {
    return status === "Хэвийн" 
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
                <h1 className="text-2xl font-bold text-white">Санхүүгийн удирдлага</h1>
                <p className="mt-1 text-sm text-white/50">Бүрэн эрхт админы санхүүгийн удирдлага, хяналт</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">{getRoleLabel()}</p>
                  <p className="text-xs text-white/40">Санхүүгийн удирдлага</p>
                </div>
                <Link href={getDashboardLink()} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт төсөв", value: "₮ 5.6 тэрбум", icon: "💰", color: "bg-emerald-500" },
                { label: "Зарцуулсан", value: "₮ 4.6 тэрбум", icon: "📉", color: "bg-blue-500" },
                { label: "Үлдэгдэл", value: "₮ 1.0 тэрбум", icon: "📊", color: "bg-amber-500" },
                { label: "Тэнхимийн тоо", value: financialData.length, icon: "🏛️", color: "bg-purple-500" },
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

            {/* Department Financial Data */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Тэнхимийн санхүүгийн мэдээлэл</h2>
                <button className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/25">
                  Шинэ төсөв нэмэх
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Тэнхим</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төсөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Зарцуулсан</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үлдэгдэл</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">{item.department.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-white">{item.budget}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.spent}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-emerald-400">{item.remaining}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-3 py-1 text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Засах
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

            {/* Payment Statistics */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Monthly Payment Stats */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Сар бүрийн төлбөрийн статистик</h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    Бүх тайлан
                  </button>
                </div>
                
                <div className="space-y-4">
                  {paymentStats.map((stat, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-white">{stat.month}</p>
                        <span className="text-sm font-bold text-white">{stat.total}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-400">Төлсөн: {stat.paid}</span>
                          <span className="text-emerald-400">{Math.round(parseInt(stat.paid.replace(/[^0-9]/g, '')) / parseInt(stat.total.replace(/[^0-9]/g, '')) * 100)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-amber-400">Хүлээгдэж: {stat.pending}</span>
                          <span className="text-amber-400">{Math.round(parseInt(stat.pending.replace(/[^0-9]/g, '')) / parseInt(stat.total.replace(/[^0-9]/g, '')) * 100)}%</span>
                        </div>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-300"
                          style={{ width: `${Math.round(parseInt(stat.paid.replace(/[^0-9]/g, '')) / parseInt(stat.total.replace(/[^0-9]/g, '')) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Overview */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Санхүүгийн тойм</h2>
                  <button className="text-sm text-emerald-400 hover:text-emerald-300">
                    Дэлгэрэнгүй
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Нийт орлого", value: "₮ 985,500,000", percentage: 100, color: "from-emerald-400 to-green-300" },
                    { label: "Нийт зарлага", value: "₮ 795,100,000", percentage: 81, color: "from-red-400 to-orange-300" },
                    { label: "Цэвэр ашиг", value: "₮ 190,400,000", percentage: 19, color: "from-blue-400 to-cyan-300" },
                    { label: "Төлбөрийн дутагдал", value: "₮ 12,500,000", percentage: 1, color: "from-amber-400 to-yellow-300" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{item.label}</p>
                        <span className="text-sm font-bold text-white">{item.value}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                        <span>Нийт: {item.percentage}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Management Tools */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Санхүүгийн удирдлагын хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Төсөв төлөвлөлт", 
                    description: "Тэнхимийн төсөв төлөвлөх, баталгаажуулах",
                    icon: "💰",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Төлбөрийн хяналт", 
                    description: "Төлбөрийн мэдээлэл хянах, баталгаажуулах",
                    icon: "📋",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Санхүүгийн тайлан", 
                    description: "Санхүүгийн тайлан үүсгэх, хянах",
                    icon: "📊",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Төлбөрийн бодлого", 
                    description: "Төлбөрийн бодлого, дүрэм тогтоох",
                    icon: "⚖️",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Хөрөнгийн удирдлага", 
                    description: "Хөрөнгө, тоног төхөөрөмжийн бүртгэл",
                    icon: "🏢",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Хяналт шалгалт", 
                    description: "Санхүүгийн хяналт шалгалт хийх",
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
                      Ашиглах
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