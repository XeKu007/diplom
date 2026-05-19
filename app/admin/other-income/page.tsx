"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function OtherIncome() {
  const [activeMenu, setActiveMenu] = useState("Нэмэлт орлого");
  const [incomeType, setIncomeType] = useState("all");
  


  const incomeItems = [
    {
      id: "INC-2024-001245",
      type: "retake",
      description: "Дахин шалгалтын төлбөр - Програм хангамж",
      amount: "₮ 150,000",
      student: "Б.Бат-Эрдэнэ",
      date: "2024-05-05",
      status: "received",
      category: "Дахин шалгалтын төлбөр",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: "INC-2024-001246",
      type: "library",
      description: "Номын сангийн торгууль - Хугацаа хэтэрсэн",
      amount: "₮ 25,000",
      student: "Ц.Энхтулга",
      date: "2024-05-04",
      status: "received",
      category: "Номын сангийн торгууль",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: "INC-2024-001247",
      type: "certificate",
      description: "Гэрчилгээний хуулбар - Төгсөлтийн гэрчилгээ",
      amount: "₮ 50,000",
      graduate: "Л.Нямдаваа",
      date: "2024-05-03",
      status: "received",
      category: "Гэрчилгээний хуулбар",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: "INC-2024-001248",
      type: "event",
      description: "Технологийн өдрийн арга хэмжээ - Оролцооны хураамж",
      amount: "₮ 200,000",
      participant: "Голомт компани",
      date: "2024-05-02",
      status: "pending",
      category: "Арга хэмжээний орлого",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: "INC-2024-001249",
      type: "training",
      description: "Нэмэлт сургалт - Мэдээллийн аюулгүй байдал",
      amount: "₮ 500,000",
      participant: "Төрийн банк",
      date: "2024-05-01",
      status: "received",
      category: "Сургалтын орлого",
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: "INC-2024-001250",
      type: "equipment",
      description: "Тоног төхөөрөмжийн түрээс - Проектор түрээс",
      amount: "₮ 100,000",
      renter: "Багш Д.Энхбаяр",
      date: "2024-04-30",
      status: "received",
      category: "Тоног төхөөрөмжийн түрээс",
      color: "from-rose-500 to-red-600"
    },
    {
      id: "INC-2024-001251",
      type: "consulting",
      description: "Зөвлөх үйлчилгээ - Системийн зөвлөх",
      amount: "₮ 750,000",
      client: "Хаан банк",
      date: "2024-04-28",
      status: "received",
      category: "Зөвлөх үйлчилгээ",
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: "INC-2024-001252",
      type: "sponsorship",
      description: "Ивээн тэтгэлэг - Голомт банкны ивээн тэтгэлэг",
      amount: "₮ 2,000,000",
      sponsor: "Голомт банк",
      date: "2024-04-25",
      status: "received",
      category: "Ивээн тэтгэлэг",
      color: "from-lime-500 to-green-600"
    },
    {
      id: "INC-2024-001253",
      type: "donation",
      description: "Хандив - Сурагчдын хандив",
      amount: "₮ 350,000",
      donor: "Оюутнуудын холбоо",
      date: "2024-04-20",
      status: "received",
      category: "Хандив",
      color: "from-violet-500 to-purple-600"
    },
    {
      id: "INC-2024-001254",
      type: "other",
      description: "Бусад орлого - Тэмдэглэлүүдийн борлуулалт",
      amount: "₮ 75,000",
      source: "Оюутны төв",
      date: "2024-04-15",
      status: "pending",
      category: "Бусад орлого",
      color: "from-gray-500 to-gray-600"
    },
  ];

  const incomeTypes = [
    { value: "all", label: "Бүх төрөл" },
    { value: "retake", label: "Дахин шалгалтын төлбөр" },
    { value: "library", label: "Номын сангийн торгууль" },
    { value: "certificate", label: "Гэрчилгээний хуулбар" },
    { value: "event", label: "Арга хэмжээний орлого" },
    { value: "training", label: "Сургалтын орлого" },
    { value: "equipment", label: "Тоног төхөөрөмжийн түрээс" },
    { value: "consulting", label: "Зөвлөх үйлчилгээ" },
    { value: "sponsorship", label: "Ивээн тэтгэлэг" },
    { value: "donation", label: "Хандив" },
    { value: "other", label: "Бусад орлого" },
  ];

  const filteredIncome = incomeItems.filter(item => {
    return incomeType === "all" || item.type === incomeType;
  });

  const getStatusColor = (status: string) => {
    return status === "received" 
      ? "bg-emerald-500/10 text-emerald-400" 
      : "bg-amber-500/10 text-amber-400";
  };

  const getStatusText = (status: string) => {
    return status === "received" ? "Хүлээн авсан" : "Хүлээгдэж байгаа";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "retake": return "📝";
      case "library": return "📚";
      case "certificate": return "📄";
      case "event": return "🎪";
      case "training": return "🎓";
      case "equipment": return "💻";
      case "consulting": return "💼";
      case "sponsorship": return "🤝";
      case "donation": return "❤️";
      case "other": return "💰";
      default: return "💵";
    }
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
                <h1 className="text-2xl font-bold text-white">Нэмэлт орлого</h1>
                <p className="mt-1 text-sm text-white/50">Дахин шалгалтын төлбөр, номын сангийн торгууль, бусад хураамж</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">Санхүүгийн албаны админ</p>
                  <p className="text-xs text-white/40">Нэмэлт орлого</p>
                </div>
                <button className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Шинэ орлого бүртгэх
                </button>
                <Link href="/admin/finance-dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-64">
                  <label className="block text-sm text-white/50 mb-2">Төрлөөр шүүх</label>
                  <select
                    value={incomeType}
                    onChange={(e) => setIncomeType(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5 text-white focus:border-white/20 focus:outline-none"
                  >
                    {incomeTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт орлого", value: "₮ 4.2M", icon: "💰", color: "bg-blue-500" },
                { label: "Нийт бүртгэл", value: "10", icon: "📊", color: "bg-emerald-500" },
                { label: "Хүлээн авсан", value: "8", icon: "✅", color: "bg-amber-500" },
                { label: "Хүлээгдэж байгаа", value: "2", icon: "⏳", color: "bg-purple-500" },
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

            {/* Income List */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Орлогын жагсаалт</h2>
                <p className="text-sm text-white/50">{filteredIncome.length} орлого</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Орлогын дугаар</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Тайлбар</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Дүн</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Хамааралтай</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Огноо</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Ангилал</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Статус</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncome.map(item => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                              <span className="text-lg">{getTypeIcon(item.type)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{item.id}</p>
                              <p className="text-xs text-white/50">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm text-white/70 max-w-xs">{item.description}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-lg font-bold text-white">{item.amount}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-white">
                            {item.student || item.graduate || item.participant || item.renter || item.client || item.sponsor || item.donor || item.source}
                          </p>
                        </td>
                        <td className="py-4">
                          <p className="text-white">{item.date}</p>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Харах
                            </button>
                            <button className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Засах
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredIncome.length === 0 && (
                <div className="py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Орлого олдсонгүй</h3>
                  <p className="text-sm text-white/50">Хайлтын үр дүнд тохирох нэмэлт орлого олдсонгүй</p>
                </div>
              )}
            </div>

            {/* Income Distribution */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Орлогын төрлийн тархалт</h2>
                <div className="space-y-4">
                  {[
                    { type: "Ивээн тэтгэлэг", amount: "₮ 2,000,000", percentage: 48, color: "bg-lime-500" },
                    { type: "Зөвлөх үйлчилгээ", amount: "₮ 750,000", percentage: 18, color: "bg-cyan-500" },
                    { type: "Сургалтын орлого", amount: "₮ 500,000", percentage: 12, color: "bg-indigo-500" },
                    { type: "Хандив", amount: "₮ 350,000", percentage: 8, color: "bg-violet-500" },
                    { type: "Дахин шалгалтын төлбөр", amount: "₮ 150,000", percentage: 4, color: "bg-blue-500" },
                    { type: "Бусад", amount: "₮ 450,000", percentage: 11, color: "bg-gray-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm text-white/70">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white/50 w-24 text-right">{item.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Сар бүрийн орлогын тренд</h2>
                <div className="space-y-4">
                  {[
                    { month: "1-р сар", income: "₮ 3,200,000", color: "bg-blue-500" },
                    { month: "2-р сар", income: "₮ 2,800,000", color: "bg-blue-500" },
                    { month: "3-р сар", income: "₮ 3,500,000", color: "bg-blue-500" },
                    { month: "4-р сар", income: "₮ 4,200,000", color: "bg-emerald-500" },
                    { month: "5-р сар", income: "₮ 1,050,000", color: "bg-blue-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-20">
                        <span className="text-sm text-white/70">{item.month}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div 
                              className={`h-full ${item.color} rounded-full`}
                              style={{ width: `${(parseInt(item.income.replace(/[^0-9]/g, '')) / 5000000) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white/50 w-24 text-right">{item.income}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Income Management Tools */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">Орлогын удирдлагын хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Дахин шалгалтын төлбөр", 
                    description: "Дахин шалгалтын төлбөр тооцох, нэхэмжлэх үүсгэх",
                    icon: "📝",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Номын сангийн торгууль", 
                    description: "Номын сангийн торгууль тооцох, мэдэгдэх",
                    icon: "📚",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Гэрчилгээний хуулбар", 
                    description: "Гэрчилгээний хуулбарын төлбөр тооцох",
                    icon: "📄",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Арга хэмжээний орлого", 
                    description: "Арга хэмжээний орлого бүртгэх, удирдах",
                    icon: "🎪",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Сургалтын орлого", 
                    description: "Нэмэлт сургалтын орлого бүртгэх",
                    icon: "🎓",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Тоног төхөөрөмжийн түрээс", 
                    description: "Тоног төхөөрөмжийн түрээсийн орлого бүртгэх",
                    icon: "💻",
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