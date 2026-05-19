"use client";

import { useState } from "react";
import Link from "next/link";

export default function SystemReportsPage() {
  const [reportType, setReportType] = useState("Системийн ашиглалт");
  const [period, setPeriod] = useState("Энэ сар");

  const backLink = "/admin/dashboard";

  const reportTypes = ["Системийн ашиглалт", "Хэрэглэгчийн үйл ажиллагаа", "Гүйцэтгэлийн тайлан", "Аюулгүй байдлын тайлан"];
  const periods = ["Энэ сар", "Өнгөрсөн сар", "Энэ улирал", "Өнгөрсөн улирал", "Энэ жил", "Өнгөрсөн жил"];

  const systemUsageData = [
    { metric: "Нэвтрэх тоо", value: 12540, change: 12.5, unit: "удаа" },
    { metric: "Идэвхтэй хэрэглэгч", value: 1240, change: 8.3, unit: "хүн" },
    { metric: "Хуудас үзсэн", value: 85620, change: 15.2, unit: "удаа" },
    { metric: "Дундаж сессийн хугацаа", value: 18.5, change: 2.1, unit: "минут" },
    { metric: "Алдааны тоо", value: 42, change: -5.6, unit: "удаа" },
    { metric: "Дундаж хариу үйлдэл", value: 1.2, change: -0.3, unit: "секунд" },
  ];

  const userActivityData = [
    { role: "Оюутан", active: 1200, inactive: 150, total: 1350, growth: 5.2 },
    { role: "Багш", active: 24, inactive: 2, total: 26, growth: 8.3 },
    { role: "Эцэг/эх", active: 850, inactive: 120, total: 970, growth: 3.7 },
    { role: "Админ", active: 3, inactive: 0, total: 3, growth: 0.0 },
  ];

  const performanceData = [
    { endpoint: "/api/login", requests: 12540, avgResponse: 0.8, errorRate: 0.2, status: "Сайн" },
    { endpoint: "/api/courses", requests: 8560, avgResponse: 1.2, errorRate: 0.5, status: "Сайн" },
    { endpoint: "/api/attendance", requests: 6420, avgResponse: 1.5, errorRate: 0.8, status: "Дунд" },
    { endpoint: "/api/grades", requests: 5230, avgResponse: 2.1, errorRate: 1.2, status: "Дунд" },
    { endpoint: "/api/payments", requests: 3120, avgResponse: 2.8, errorRate: 2.5, status: "Анхаарал" },
    { endpoint: "/api/reports", requests: 1850, avgResponse: 3.5, errorRate: 3.8, status: "Анхаарал" },
  ];

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
          <h1 className="text-3xl font-bold text-white mb-2">Системийн тайлан</h1>
          <p className="text-white/60">
            Системийн ашиглалт, гүйцэтгэл, хэрэглэгчийн үйл ажиллагааны тайлан
          </p>
        </div>

        {/* Шүүлтүүр */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Тайлангийн төрөл
            </label>
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    reportType === type
                      ? "bg-violet-600 text-white"
                      : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Хугацаа
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
            >
              {periods.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Системийн үзүүлэлтүүд */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {systemUsageData.slice(0, 3).map((item, index) => (
            <div key={index} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{item.metric}</h3>
                <div className={`p-2 ${item.change >= 0 ? "bg-emerald-500/20" : "bg-rose-500/20"} rounded-lg`}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-white">{item.value.toLocaleString()} {item.unit}</div>
                <div className={`text-sm ${item.change >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                  {item.change >= 0 ? "+" : ""}{item.change}% өмнөх сараас
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Системийн ашиглалтын хүснэгт */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Системийн ашиглалтын тайлан</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                PDF тайлан татах
              </button>
              <button className="px-4 py-2 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">
                Excel тайлан татах
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/70 font-medium">Үзүүлэлт</th>
                  <th className="text-left p-4 text-white/70 font-medium">Утга</th>
                  <th className="text-left p-4 text-white/70 font-medium">Өөрчлөлт</th>
                  <th className="text-left p-4 text-white/70 font-medium">Нэгж</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {systemUsageData.map((item, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{item.metric}</td>
                    <td className="p-4 text-white">{item.value.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        item.change >= 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                      }`}>
                        {item.change >= 0 ? "+" : ""}{item.change}%
                      </span>
                    </td>
                    <td className="p-4 text-white/70">{item.unit}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        item.change >= 10 ? "bg-emerald-500/20 text-emerald-300" :
                        item.change >= 0 ? "bg-amber-500/20 text-amber-300" :
                        "bg-rose-500/20 text-rose-300"
                      }`}>
                        {item.change >= 10 ? "Сайн" : item.change >= 0 ? "Дунд" : "Муу"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Хэрэглэгчийн үйл ажиллагаа */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-semibold text-white mb-6">Хэрэглэгчийн үйл ажиллагаа</h3>
            <div className="space-y-4">
              {userActivityData.map((user, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">{user.role}</span>
                    <span className="text-white">{user.active} идэвхтэй ({Math.round((user.active / user.total) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${(user.active / user.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Нийт: {user.total} хүн</span>
                    <span className={user.growth >= 0 ? "text-emerald-300" : "text-rose-300"}>
                      {user.growth >= 0 ? "+" : ""}{user.growth}% өсөлт
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-semibold text-white mb-6">API гүйцэтгэлийн тайлан</h3>
            <div className="space-y-4">
              {performanceData.map((api, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">{api.endpoint}</span>
                    <span className="text-white">{api.avgResponse.toFixed(1)}s</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        api.avgResponse < 1 ? "bg-emerald-500" :
                        api.avgResponse < 2 ? "bg-amber-500" :
                        "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(api.avgResponse * 20, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>{api.requests.toLocaleString()} хүсэлт</span>
                    <span className={api.errorRate < 1 ? "text-emerald-300" : api.errorRate < 3 ? "text-amber-300" : "text-rose-300"}>
                      {api.errorRate.toFixed(1)}% алдаа
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Аюулгүй байдлын тайлан */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">Аюулгүй байдлын тайлан</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Нэвтрэх оролдлого", count: 24, change: -15, status: "Буурсан" },
              { title: "Хандалтын алдаа", count: 8, change: -5, status: "Буурсан" },
              { title: "Хэвийн бус үйлдэл", count: 3, change: 0, status: "Тогтвортой" },
              { title: "Блоклогдсон IP", count: 12, change: 2, status: "Өссөн" },
            ].map((security, index) => (
              <div key={index} className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">{security.title}</h4>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold text-white">{security.count}</div>
                  <div className={`text-sm ${security.change < 0 ? "text-emerald-300" : security.change > 0 ? "text-rose-300" : "text-amber-300"}`}>
                    {security.change > 0 ? "+" : ""}{security.change}%
                  </div>
                </div>
                <div className="text-xs text-white/50 mt-2">{security.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Тайлбар */}
        <div className="mt-8 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Системийн тайлангийн тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Системийн тайланг өдөр бүр автоматаар үүсгэнэ</li>
            <li>• Ашиглалтын үзүүлэлтүүд цаг бүр шинэчлэгдэнэ</li>
            <li>• Гүйцэтгэлийн стандарт: API хариу үйлдэл 2 секундээс бага</li>
            <li>• Алдааны түвшин 3%-аас бага байх ёстой</li>
            <li>• Аюулгүй байдлын үйл явдлыг бодит цагт хянана</li>
            <li>• Тайланг PDF, Excel форматаар татаж авах боломжтой</li>
          </ul>
        </div>
      </div>
    </div>
  );
}