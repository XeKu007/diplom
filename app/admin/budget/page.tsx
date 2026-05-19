"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function BudgetPage() {
  const { getDashboardLink } = useAdminRole();
  const [year, setYear] = useState("2024");

  const backLink = getDashboardLink();

  const years = ["2024", "2023", "2022", "2021"];

  const budgetData = [
    { category: "Цалин", budget: 245800000, actual: 238500000, variance: -7300000, variancePercent: -3.0 },
    { category: "Байрны түрээс", budget: 18000000, actual: 17500000, variance: -500000, variancePercent: -2.8 },
    { category: "Засвар үйлчилгээ", budget: 10000000, actual: 9500000, variance: -500000, variancePercent: -5.0 },
    { category: "Ном, материал", budget: 15000000, actual: 14200000, variance: -800000, variancePercent: -5.3 },
    { category: "Техник хэрэгсэл", budget: 20000000, actual: 18500000, variance: -1500000, variancePercent: -7.5 },
    { category: "Маркетинг", budget: 12000000, actual: 11500000, variance: -500000, variancePercent: -4.2 },
    { category: "Сургалтын зардал", budget: 30000000, actual: 28500000, variance: -1500000, variancePercent: -5.0 },
    { category: "Бусад зардал", budget: 8000000, actual: 7500000, variance: -500000, variancePercent: -6.3 },
  ];

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0);
  const totalVariance = totalActual - totalBudget;
  const totalVariancePercent = totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] to-[#1a0b2e] p-6">
      <div className="mx-auto max-w-6xl">
        {/* Буцах холбоос */}
        <div className="mb-6">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Буцах
          </Link>
        </div>

        {/* Гарчиг */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Төсөв</h1>
          <p className="text-white/60">
            Санхүүгийн төсөв, бодит зардлын харьцуулалт, дүн шинжилгээ
          </p>
        </div>

        {/* Шүүлтүүр */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-white/70 mb-2">
            Жил
          </label>
          <div className="flex flex-wrap gap-2">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  year === y
                    ? "bg-violet-600 text-white"
                    : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"
                }`}
              >
                {y} он
              </button>
            ))}
          </div>
        </div>

        {/* Нийт статистик */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Нийт төсөв</h3>
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalBudget.toLocaleString()}</div>
              <div className="text-sm text-white/60">Жилийн төсөв</div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Бодит зардал</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalActual.toLocaleString()}</div>
              <div className="text-sm text-white/60">Одоогийн зардал</div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Зөрүү</h3>
              <div className={`p-2 ${totalVariance < 0 ? "bg-emerald-500/20" : "bg-rose-500/20"} rounded-lg`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${totalVariance < 0 ? "text-emerald-300" : "text-rose-300"}`}>
                {totalVariance < 0 ? "-" : "+"}₮ {Math.abs(totalVariance).toLocaleString()}
              </div>
              <div className={`text-sm ${totalVariance < 0 ? "text-emerald-300" : "text-rose-300"}`}>
                {totalVariancePercent.toFixed(1)}% {totalVariance < 0 ? "хамгаалсан" : "илүү зарцуулсан"}
              </div>
            </div>
          </div>
        </div>

        {/* Төсвийн хүснэгт */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Төсвийн жагсаалт</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                Шинэ төсөв нэмэх
              </button>
              <button className="px-4 py-2 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">
                Тайлан татах
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/70 font-medium">Зардлын ангилал</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төсөв</th>
                  <th className="text-left p-4 text-white/70 font-medium">Бодит</th>
                  <th className="text-left p-4 text-white/70 font-medium">Зөрүү</th>
                  <th className="text-left p-4 text-white/70 font-medium">Зөрүү %</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөв</th>
                  <th className="text-left p-4 text-white/70 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {budgetData.map((item, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{item.category}</td>
                    <td className="p-4 text-white">₮ {item.budget.toLocaleString()}</td>
                    <td className="p-4 text-blue-300">₮ {item.actual.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        item.variance < 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                      }`}>
                        {item.variance < 0 ? "-" : "+"}₮ {Math.abs(item.variance).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.variancePercent >= -5 ? "bg-emerald-500" :
                              item.variancePercent >= -10 ? "bg-amber-500" :
                              "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(Math.abs(item.variancePercent) * 2, 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm ${item.variancePercent < 0 ? "text-emerald-300" : "text-rose-300"}`}>
                          {item.variancePercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        item.variancePercent >= -5 ? "bg-emerald-500/20 text-emerald-300" :
                        item.variancePercent >= -10 ? "bg-amber-500/20 text-amber-300" :
                        "bg-rose-500/20 text-rose-300"
                      }`}>
                        {item.variancePercent >= -5 ? "Сайн" : item.variancePercent >= -10 ? "Дунд" : "Муу"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="px-3 py-1.5 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">
                        Засах
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Төсвийн график */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-semibold text-white mb-6">Төсөв vs Бодит зардал</h3>
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">{item.category}</span>
                    <span className="text-white">
                      ₮ {item.actual.toLocaleString()} / ₮ {item.budget.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-blue-500"
                      style={{ width: `${(item.actual / item.budget) * 100}%` }}
                    />
                    <div 
                      className="h-full bg-violet-500"
                      style={{ width: `${100 - ((item.actual / item.budget) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Бодит: {Math.round((item.actual / item.budget) * 100)}%</span>
                    <span className={item.variance < 0 ? "text-emerald-300" : "text-rose-300"}>
                      {item.variancePercent.toFixed(1)}% зөрүү
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-semibold text-white mb-6">Зардлын хуваарилалт</h3>
            <div className="space-y-4">
              {budgetData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">{item.category}</span>
                    <span className="text-white">{Math.round((item.budget / totalBudget) * 100)}%</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${(item.budget / totalBudget) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>₮ {item.budget.toLocaleString()}</span>
                    <span>Төсвийн {Math.round((item.budget / totalBudget) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Тайлбар */}
        <div className="mt-8 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Төсвийн тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Төсвийг жил бүр шинэчлэн гаргана</li>
            <li>• Бодит зардлыг сар бүр шинэчлэн харьцуулна</li>
            <li>• Зөрүүний стандарт: ±5% дотор (Сайн), ±10% дотор (Дунд), ±10% -аас дээш (Муу)</li>
            <li>• Төсвийг улирлын эхэнд дахин тохируулна</li>
            <li>• Хэт их зарцуулалтыг онцгойлон хянана</li>
            <li>• Тайланг PDF, Excel форматаар татаж авах боломжтой</li>
          </ul>
        </div>
      </div>
    </div>
  );
}