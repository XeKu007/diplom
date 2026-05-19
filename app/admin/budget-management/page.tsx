"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function BudgetManagement() {
  const [activeMenu, setActiveMenu] = useState("Төсөв төлөвлөлт");
  const { getDashboardLink, getRoleLabel } = useAdminRole();

  const budgets = [
    { id: 1, year: "2026", department: "Програм хангамжийн тэнхим", total: "₮ 1.2 тэрбум", allocated: "₮ 1.2 тэрбум", spent: "₮ 980 сая", status: "Идэвхтэй" },
    { id: 2, year: "2026", department: "Сүлжээний технологийн тэнхим", total: "₮ 1.1 тэрбум", allocated: "₮ 1.1 тэрбум", spent: "₮ 850 сая", status: "Идэвхтэй" },
    { id: 3, year: "2026", department: "Мэдээллийн аюулгүй байдлын тэнхим", total: "₮ 900 сая", allocated: "₮ 900 сая", spent: "₮ 720 сая", status: "Идэвхтэй" },
    { id: 4, year: "2026", department: "Мэдээлэл зүйн тэнхим", total: "₮ 950 сая", allocated: "₮ 950 сая", spent: "₮ 820 сая", status: "Идэвхтэй" },
    { id: 5, year: "2026", department: "Дижитал маркетингийн тэнхим", total: "₮ 750 сая", allocated: "₮ 750 сая", spent: "₮ 680 сая", status: "Идэвхтэй" },
    { id: 6, year: "2026", department: "Системийн инженерийн тэнхим", total: "₮ 650 сая", allocated: "₮ 650 сая", spent: "₮ 550 сая", status: "Идэвхтэй" },
    { id: 7, year: "2027", department: "Програм хангамжийн тэнхим", total: "₮ 1.3 тэрбум", allocated: "₮ 0", spent: "₮ 0", status: "Төлөвлөгдсөн" },
    { id: 8, year: "2027", department: "Сүлжээний технологийн тэнхим", total: "₮ 1.2 тэрбум", allocated: "₮ 0", spent: "₮ 0", status: "Төлөвлөгдсөн" },
  ];

  const budgetSummary = {
    total: "₮ 5.6 тэрбум",
    allocated: "₮ 5.6 тэрбум",
    spent: "₮ 4.6 тэрбум",
    remaining: "₮ 1.0 тэрбум",
    utilization: "82%"
  };

  const getStatusColor = (status: string) => {
    return status === "Идэвхтэй" 
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
                <h1 className="text-2xl font-bold text-white">Төсөв төлөвлөлт</h1>
                <p className="mt-1 text-sm text-white/50">Бүрэн эрхт админы төсөв төлөвлөлтийн удирдлага</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">{getRoleLabel()}</p>
                  <p className="text-xs text-white/40">Төсөв төлөвлөлт</p>
                </div>
                <Link href={getDashboardLink()} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Төсөвийн тойм</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Нийт төсөв", value: budgetSummary.total, icon: "💰", color: "bg-emerald-500" },
                  { label: "Хуваарилагдсан", value: budgetSummary.allocated, icon: "📊", color: "bg-blue-500" },
                  { label: "Зарцуулсан", value: budgetSummary.spent, icon: "📉", color: "bg-amber-500" },
                  { label: "Ашиглалт", value: budgetSummary.utilization, icon: "📈", color: "bg-purple-500" },
                ].map((stat, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-white/50">{stat.label}</p>
                        <p className="mt-1 text-xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center`}>
                        <span className="text-lg">{stat.icon}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget List */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Төсөвүүдийн жагсаалт</h2>
                <button className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/25">
                  Шинэ төсөв нэмэх
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Он</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Тэнхим</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Нийт төсөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Хуваарилагдсан</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Зарцуулсан</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үлдэгдэл</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.map((budget) => {
                      const remaining = parseInt(budget.allocated.replace(/[^0-9]/g, '')) - parseInt(budget.spent.replace(/[^0-9]/g, ''));
                      const remainingFormatted = `₮ ${(remaining / 1000000).toFixed(0)} сая`;
                      
                      return (
                        <tr key={budget.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">{budget.year}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-white">{budget.department}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-bold text-white">{budget.total}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-white/80">{budget.allocated}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-white/80">{budget.spent}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-bold text-emerald-400">{remainingFormatted}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-3 py-1 text-xs ${getStatusColor(budget.status)}`}>
                              {budget.status}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Budget Planning */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Budget Distribution */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Төсөвийн тархалт</h2>
                <div className="space-y-4">
                  {budgets.filter(b => b.year === "2026" && b.status === "Идэвхтэй").map((budget, index) => {
                    const percentage = Math.round(parseInt(budget.total.replace(/[^0-9]/g, '')) / 5600000000 * 100);
                    return (
                      <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-white">{budget.department}</p>
                          <span className="text-sm font-bold text-white">{budget.total}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                          <span>Нийт: {percentage}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget Utilization */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Төсөвийн ашиглалт</h2>
                <div className="space-y-4">
                  {budgets.filter(b => b.year === "2026" && b.status === "Идэвхтэй").map((budget, index) => {
                    const spent = parseInt(budget.spent.replace(/[^0-9]/g, ''));
                    const allocated = parseInt(budget.allocated.replace(/[^0-9]/g, ''));
                    const utilization = Math.round((spent / allocated) * 100);
                    
                    return (
                      <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-white">{budget.department}</p>
                          <span className={`text-sm font-bold ${utilization > 90 ? 'text-red-400' : utilization > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {utilization}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                          <span>Зарцуулсан: {budget.spent}</span>
                          <span>Төсөв: {budget.allocated}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${
                              utilization > 90 ? 'bg-gradient-to-r from-red-400 to-orange-300' :
                              utilization > 70 ? 'bg-gradient-to-r from-amber-400 to-yellow-300' :
                              'bg-gradient-to-r from-emerald-400 to-green-300'
                            }`}
                            style={{ width: `${utilization}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Budget Planning Tools */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Төсөв төлөвлөлтийн хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Төсөв төлөвлөгөө", 
                    description: "Шинэ төсөв төлөвлөгөө үүсгэх",
                    icon: "📅",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Төсөв хуваарилалт", 
                    description: "Төсөв тэнхимд хуваарилах",
                    icon: "💰",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Төсөв хяналт", 
                    description: "Төсөвийн ашиглалт хянах",
                    icon: "👁️",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Тайлан үүсгэх", 
                    description: "Төсөвийн тайлан үүсгэх",
                    icon: "📊",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Төсөв тохируулах", 
                    description: "Төсөвийг засах, тохируулах",
                    icon: "⚙️",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Төсөв шинжилгээ", 
                    description: "Төсөвийн шинжилгээ хийх",
                    icon: "📈",
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