"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function DiscountManagement() {
  const [activeMenu, setActiveMenu] = useState("Хөнгөлөлтийн удирдлага");
  const { getDashboardLink, getRoleLabel } = useAdminRole();

  const discountData = [
    { id: 1, type: "Олон хүүхэд", description: "2 ба түүнээс дээш хүүхэдтэй эцэг эх", percentage: 15, students: 24, totalDiscount: "₮ 36,000,000", status: "Идэвхтэй" },
    { id: 2, type: "Амжилт", description: "Шилдэг амжилттай оюутнууд", percentage: 20, students: 12, totalDiscount: "₮ 24,000,000", status: "Идэвхтэй" },
    { id: 3, type: "Ажилчдын хүүхэд", description: "Ажилчдын хүүхдүүд", percentage: 25, students: 8, totalDiscount: "₮ 20,000,000", status: "Идэвхтэй" },
    { id: 4, type: "Төгсөгчдийн хүүхэд", description: "Төгсөгчдийн хүүхдүүд", percentage: 10, students: 15, totalDiscount: "₮ 15,000,000", status: "Идэвхтэй" },
    { id: 5, type: "Гэр бүлийн хөнгөлөлт", description: "Нэг гэр бүлээс 2 ба түүнээс дээш оюутан", percentage: 10, students: 18, totalDiscount: "₮ 18,000,000", status: "Идэвхтэй" },
    { id: 6, type: "Эрт бүртгэл", description: "Эрт бүртгүүлсэн оюутнууд", percentage: 5, students: 32, totalDiscount: "₮ 16,000,000", status: "Идэвхтэй" },
    { id: 7, type: "Тусгай хөнгөлөлт", description: "Тусгай нөхцөлтэй оюутнууд", percentage: 30, students: 6, totalDiscount: "₮ 18,000,000", status: "Идэвхтэй" },
    { id: 8, type: "Улирлын хөнгөлөлт", description: "Улирлын эхэнд бүртгүүлсэн", percentage: 8, students: 25, totalDiscount: "₮ 20,000,000", status: "Идэвхтэй" },
  ];

  const summaryStats = {
    totalDiscounts: "₮ 167,000,000",
    totalStudents: 140,
    averageDiscount: "₮ 1,192,857",
    activeTypes: 8
  };

  const getStatusColor = (status: string) => {
    return status === "Идэвхтэй" 
      ? "bg-emerald-500/10 text-emerald-400" 
      : "bg-gray-500/10 text-gray-400";
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 25) return "text-emerald-400";
    if (percentage >= 15) return "text-green-400";
    if (percentage >= 10) return "text-amber-400";
    return "text-blue-400";
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
                <h1 className="text-2xl font-bold text-white">Хөнгөлөлтийн удирдлага</h1>
                <p className="mt-1 text-sm text-white/50">Оюутны хөнгөлөлтийн төрлүүдийн удирдлага</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">{getRoleLabel()}</p>
                  <p className="text-xs text-white/40">Хөнгөлөлтийн удирдлага</p>
                </div>
                <Link href={getDashboardLink()} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт хөнгөлөлт", value: summaryStats.totalDiscounts, icon: "💰", color: "bg-emerald-500" },
                { label: "Оюутны тоо", value: summaryStats.totalStudents, icon: "👥", color: "bg-blue-500" },
                { label: "Дундаж хөнгөлөлт", value: summaryStats.averageDiscount, icon: "📊", color: "bg-amber-500" },
                { label: "Хөнгөлөлтийн төрөл", value: summaryStats.activeTypes, icon: "🎯", color: "bg-purple-500" },
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

            {/* Discount List */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Хөнгөлөлтийн төрлүүд</h2>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                    Тайлан татах
                  </button>
                  <button className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                    Шинэ хөнгөлөлт нэмэх
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төрөл</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Тайлбар</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Хөнгөлөлт</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Оюутны тоо</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Нийт хөнгөлөлт</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discountData.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">🎯</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/70">{item.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className={`text-sm font-bold ${getPercentageColor(item.percentage)}`}>
                            {item.percentage}%
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.students} оюутан</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-emerald-400">{item.totalDiscount}</p>
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

            {/* Discount Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Discount Distribution */}
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Хөнгөлөлтийн тархалт</h2>
                <div className="space-y-4">
                  {[
                    { range: "5-10%", count: 3, students: 75, amount: "₮ 51,000,000", color: "from-blue-400 to-cyan-300" },
                    { range: "11-15%", count: 2, students: 36, amount: "₮ 51,000,000", color: "from-emerald-400 to-green-300" },
                    { range: "16-20%", count: 1, students: 12, amount: "₮ 24,000,000", color: "from-amber-400 to-yellow-300" },
                    { range: "21%+", count: 2, students: 17, amount: "₮ 41,000,000", color: "from-purple-400 to-pink-300" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{item.range}</p>
                        <span className="text-sm font-bold text-white">{item.count} төрөл</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                        <span>Оюутны тоо: {item.students}</span>
                        <span>Нийт: {item.amount}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${(item.count / discountData.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Distribution */}
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Оюутны тархалт</h2>
                <div className="space-y-4">
                  {discountData.map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{item.type}</p>
                        <span className="text-sm font-bold text-white">{item.students} оюутан</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                        <span>Нийт: {Math.round((item.students / summaryStats.totalStudents) * 100)}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300"
                          style={{ width: `${(item.students / summaryStats.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Discount Rules */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">Хөнгөлөлтийн дүрэм журам</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Олон хүүхэд", 
                    description: "2 ба түүнээс дээш хүүхэдтэй эцэг эх",
                    requirements: "Хүүхдийн төрсний гэрчилгээ, иргэний үнэмлэх",
                    icon: "👨‍👩‍👧‍👦",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Амжилт", 
                    description: "Шилдэг амжилттай оюутнууд",
                    requirements: "Өмнөх сургалтын дүнгийн хуудас, багшийн санал",
                    icon: "🏆",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Ажилчдын хүүхэд", 
                    description: "Ажилчдын хүүхдүүд",
                    requirements: "Ажилтны гэрчилгээ, хүүхдийн төрсний гэрчилгээ",
                    icon: "👨‍💼",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Төгсөгчдийн хүүхэд", 
                    description: "Төгсөгчдийн хүүхдүүд",
                    requirements: "Төгсөлтийн гэрчилгээ, хүүхдийн төрсний гэрчилгээ",
                    icon: "🎓",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Гэр бүлийн хөнгөлөлт", 
                    description: "Нэг гэр бүлээс 2 ба түүнээс дээш оюутан",
                    requirements: "Гэр бүлийн гишүүдийн иргэний үнэмлэх",
                    icon: "🏠",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Эрт бүртгэл", 
                    description: "Эрт бүртгүүлсэн оюутнууд",
                    requirements: "Бүртгэлийн огноо, гэрээний хугацаа",
                    icon: "📅",
                    color: "from-rose-500 to-red-600"
                  },
                ].map((rule, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${rule.color} flex items-center justify-center`}>
                        <span className="text-lg">{rule.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{rule.name}</h3>
                        <p className="text-xs text-white/50">{rule.description}</p>
                      </div>
                    </div>
                    <div className="text-xs text-white/60 mb-3">
                      <p className="font-medium mb-1">Шаардлага:</p>
                      <p>{rule.requirements}</p>
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
                    name: "Хөнгөлөлт нэмэх", 
                    description: "Шинэ хөнгөлөлтийн төрөл нэмэх",
                    icon: "➕",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Оюутан оноох", 
                    description: "Оюутны хөнгөлөлт оноох",
                    icon: "👤",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Тайлан гаргах", 
                    description: "Хөнгөлөлтийн тайлан үүсгэх",
                    icon: "📊",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Дүрэм журам", 
                    description: "Хөнгөлөлтийн дүрэм засах",
                    icon: "⚖️",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Баталгаажуулалт", 
                    description: "Хөнгөлөлтийн баталгаажуулалт",
                    icon: "✅",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Сургалтын алба руу мэдээлэх", 
                    description: "Хөнгөлөлттэй оюутнуудын мэдээлэл",
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