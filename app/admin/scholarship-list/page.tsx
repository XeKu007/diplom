"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function ScholarshipList() {
  const [activeMenu, setActiveMenu] = useState("Тэтгэлгийн жагсаалт");
  const { getDashboardLink, getRoleLabel } = useAdminRole();

  const scholarshipData = [
    { id: 1, student: "Төртэмүүлэн", idNumber: "B211930019", type: "Төр засгийн тэтгэлэг", amount: "₮ 1,500,000", period: "2026 оны 1-р улирал", status: "Идэвхтэй", gpa: 3.8, startDate: "2026-01-15", endDate: "2026-06-30" },
    { id: 2, student: "Э.Батжаргал", idNumber: "B211930020", type: "Төр засгийн тэтгэлэг", amount: "₮ 1,500,000", period: "2026 оны 1-р улирал", status: "Идэвхтэй", gpa: 3.7, startDate: "2026-01-15", endDate: "2026-06-30" },
    { id: 3, student: "Ц.Мөнхбат", idNumber: "B211930021", type: "Сургуулийн тэтгэлэг", amount: "₮ 1,000,000", period: "2026 оны 1-р улирал", status: "Идэвхтэй", gpa: 3.9, startDate: "2026-01-15", endDate: "2026-06-30" },
    { id: 4, student: "Д.Сүхбат", idNumber: "B211930022", type: "Сургуулийн тэтгэлэг", amount: "₮ 1,000,000", period: "2026 оны 1-р улирал", status: "Идэвхтэй", gpa: 3.6, startDate: "2026-01-15", endDate: "2026-06-30" },
    { id: 5, student: "Б.Ганбаяр", idNumber: "B211930023", type: "Тусгай тэтгэлэг", amount: "₮ 800,000", period: "2026 оны 1-р улирал", status: "Идэвхтэй", gpa: 3.5, startDate: "2026-01-15", endDate: "2026-06-30" },
    { id: 6, student: "Н.Энхжаргал", idNumber: "B211930024", type: "Төр засгийн тэтгэлэг", amount: "₮ 1,500,000", period: "2026 оны 1-р улирал", status: "Дууссан", gpa: 3.4, startDate: "2025-09-01", endDate: "2025-12-31" },
    { id: 7, student: "Г.Бат-Эрдэнэ", idNumber: "B211930025", type: "Сургуулийн тэтгэлэг", amount: "₮ 1,000,000", period: "2026 оны 1-р улирал", status: "Идэвхтэй", gpa: 3.8, startDate: "2026-01-15", endDate: "2026-06-30" },
    { id: 8, student: "Л.Хүслэн", idNumber: "B211930026", type: "Тусгай тэтгэлэг", amount: "₮ 800,000", period: "2026 оны 1-р улирал", status: "Идэвхтэй", gpa: 3.7, startDate: "2026-01-15", endDate: "2026-06-30" },
  ];

  const summaryStats = {
    totalScholarships: "₮ 9,100,000",
    totalStudents: 8,
    averageAmount: "₮ 1,137,500",
    active: 7,
    completed: 1
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Идэвхтэй": return "bg-emerald-500/10 text-emerald-400";
      case "Дууссан": return "bg-blue-500/10 text-blue-400";
      case "Түр зогссон": return "bg-amber-500/10 text-amber-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Төр засгийн тэтгэлэг": return "bg-blue-500/10 text-blue-400 border-blue-400/20";
      case "Сургуулийн тэтгэлэг": return "bg-emerald-500/10 text-emerald-400 border-emerald-400/20";
      case "Тусгай тэтгэлэг": return "bg-purple-500/10 text-purple-400 border-purple-400/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-400/20";
    }
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.8) return "text-emerald-400";
    if (gpa >= 3.5) return "text-green-400";
    if (gpa >= 3.0) return "text-amber-400";
    return "text-red-400";
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
                <h1 className="text-2xl font-bold text-white">Тэтгэлгийн жагсаалт</h1>
                <p className="mt-1 text-sm text-white/50">Тэтгэлэгт хамрагдсан оюутнуудын мэдээлэл</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">{getRoleLabel()}</p>
                  <p className="text-xs text-white/40">Тэтгэлгийн жагсаалт</p>
                </div>
                <Link href={getDashboardLink()} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт тэтгэлэг", value: summaryStats.totalScholarships, icon: "💰", color: "bg-emerald-500" },
                { label: "Оюутны тоо", value: summaryStats.totalStudents, icon: "👥", color: "bg-blue-500" },
                { label: "Дундаж тэтгэлэг", value: summaryStats.averageAmount, icon: "📊", color: "bg-amber-500" },
                { label: "Идэвхтэй тэтгэлэг", value: summaryStats.active, icon: "✅", color: "bg-purple-500" },
              ].map((stat, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
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

            {/* Scholarship List */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Тэтгэлэгт хамрагдсан оюутнууд</h2>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                    Тайлан татах
                  </button>
                  <button className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                    Шинэ тэтгэлэг нэмэх
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Оюутан</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Тэтгэлгийн төрөл</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Дүн</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Хугацаа</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Дундаж дүн</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Эхлэх огноо</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Дуусах огноо</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholarshipData.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">{item.student.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.student}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-white">{item.idNumber}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-3 py-1 text-xs ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-emerald-400">{item.amount}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.period}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className={`text-sm font-bold ${getGPAColor(item.gpa)}`}>
                            {item.gpa.toFixed(1)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.startDate}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.endDate}</p>
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

            {/* Scholarship Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Type Distribution */}
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Тэтгэлгийн төрлийн тархалт</h2>
                <div className="space-y-4">
                  {[
                    { type: "Төр засгийн тэтгэлэг", count: 3, amount: "₮ 4,500,000", color: "from-blue-400 to-cyan-300" },
                    { type: "Сургуулийн тэтгэлэг", count: 3, amount: "₮ 3,000,000", color: "from-emerald-400 to-green-300" },
                    { type: "Тусгай тэтгэлэг", count: 2, amount: "₮ 1,600,000", color: "from-purple-400 to-pink-300" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{item.type}</p>
                        <span className="text-sm font-bold text-white">{item.count} оюутан</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                        <span>Нийт дүн: {item.amount}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${(item.count / scholarshipData.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GPA Analysis */}
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Дундаж дүнгийн шинжилгээ</h2>
                <div className="space-y-4">
                  {[
                    { range: "3.8-4.0", count: 3, students: ["Төртэмүүлэн", "Ц.Мөнхбат", "Г.Бат-Эрдэнэ"], color: "bg-emerald-500" },
                    { range: "3.5-3.7", count: 3, students: ["Э.Батжаргал", "Д.Сүхбат", "Л.Хүслэн"], color: "bg-green-500" },
                    { range: "3.0-3.4", count: 2, students: ["Б.Ганбаяр", "Н.Энхжаргал"], color: "bg-amber-500" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${item.color}`} />
                          <p className="text-sm font-medium text-white">{item.range}</p>
                        </div>
                        <span className="text-sm font-bold text-white">{item.count} оюутан</span>
                      </div>
                      <div className="text-xs text-white/50 mb-2">
                        {item.students.join(", ")}
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${(item.count / scholarshipData.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scholarship Requirements */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">Тэтгэлэг олгох шалгуур</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Төр засгийн тэтгэлэг", 
                    requirements: "Дундаж дүн 3.5+, гэр бүлийн орлого доогуур, ирц 90%+",
                    amount: "₮ 1,500,000",
                    period: "Улирал бүр",
                    icon: "🏛️",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Сургуулийн тэтгэлэг", 
                    requirements: "Дундаж дүн 3.8+, ирц 95%+, багшийн санал",
                    amount: "₮ 1,000,000",
                    period: "Улирал бүр",
                    icon: "🏫",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Тусгай тэтгэлэг", 
                    requirements: "Тусгай нөхцөлтэй, багшийн санал, сонгон шалгаруулалт",
                    amount: "₮ 800,000",
                    period: "Улирал бүр",
                    icon: "🎯",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Спортын тэтгэлэг", 
                    requirements: "Үндэсний түвшны амжилт, багшийн санал",
                    amount: "₮ 600,000",
                    period: "Улирал бүр",
                    icon: "⚽",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Урлагийн тэтгэлэг", 
                    requirements: "Үндэсний түвшны амжилт, багшийн санал",
                    amount: "₮ 600,000",
                    period: "Улирал бүр",
                    icon: "🎨",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Судалгааны тэтгэлэг", 
                    requirements: "Судалгааны ажил, багшийн санал, сонгон шалгаруулалт",
                    amount: "₮ 700,000",
                    period: "Улирал бүр",
                    icon: "🔬",
                    color: "from-rose-500 to-red-600"
                  },
                ].map((scholarship, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${scholarship.color} flex items-center justify-center`}>
                        <span className="text-lg">{scholarship.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{scholarship.name}</h3>
                        <p className="text-xs text-white/50">{scholarship.amount} / {scholarship.period}</p>
                      </div>
                    </div>
                    <div className="text-xs text-white/60 mb-3">
                      <p className="font-medium mb-1">Шалгуур:</p>
                      <p>{scholarship.requirements}</p>
                    </div>
                    <button className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                      Дэлгэрэнгүй
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Management Tools */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">Удирдлагын хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Тэтгэлэг нэмэх", 
                    description: "Шинэ тэтгэлэгт оюутан нэмэх",
                    icon: "➕",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Тэтгэлэг шинэчлэх", 
                    description: "Тэтгэлгийн мэдээлэл шинэчлэх",
                    icon: "🔄",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Тайлан гаргах", 
                    description: "Тэтгэлгийн тайлан үүсгэх",
                    icon: "📊",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Сонгон шалгаруулалт", 
                    description: "Тэтгэлэгт сонгон шалгаруулах",
                    icon: "🎯",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Баталгаажуулалт", 
                    description: "Тэтгэлгийн баталгаажуулалт",
                    icon: "✅",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Сургалтын алба руу мэдээлэх", 
                    description: "Тэтгэлэгтэй оюутнуудын мэдээлэл",
                    icon: "🏫",
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