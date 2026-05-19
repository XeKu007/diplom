"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function Inventory() {
  const [activeMenu, setActiveMenu] = useState("Эд хөрөнгийн бүртгэл");
  const { getDashboardLink, getRoleLabel } = useAdminRole();

  const inventoryData = [
    { id: 1, name: "Dell Latitude 5420", category: "Компьютер", quantity: 25, value: "₮ 75,000,000", location: "Програм хангамжийн тэнхим", status: "Ашиглагдаж", lastMaintenance: "2026-04-15", condition: "Сайн" },
    { id: 2, name: "HP ProBook 450 G8", category: "Компьютер", quantity: 20, value: "₮ 60,000,000", location: "Сүлжээний технологийн тэнхим", status: "Ашиглагдаж", lastMaintenance: "2026-04-10", condition: "Сайн" },
    { id: 3, name: "Cisco Catalyst 2960", category: "Сүлжээний тоног төхөөрөмж", quantity: 8, value: "₮ 40,000,000", location: "Сүлжээний лаборатори", status: "Ашиглагдаж", lastMaintenance: "2026-03-20", condition: "Сайн" },
    { id: 4, name: "Epson Projector", category: "Проектор", quantity: 12, value: "₮ 24,000,000", location: "Лекцийн танхимууд", status: "Ашиглагдаж", lastMaintenance: "2026-04-05", condition: "Дунд" },
    { id: 5, name: "Conference Table", category: "Тавилга", quantity: 15, value: "₮ 15,000,000", location: "Хурлын өрөө", status: "Ашиглагдаж", lastMaintenance: "2026-01-30", condition: "Сайн" },
    { id: 6, name: "Office Chair", category: "Тавилга", quantity: 50, value: "₮ 25,000,000", location: "Оффисууд", status: "Ашиглагдаж", lastMaintenance: "2026-02-15", condition: "Дунд" },
    { id: 7, name: "Canon Printer", category: "Хэвлэгч", quantity: 6, value: "₮ 12,000,000", location: "Оффисууд", status: "Засварт", lastMaintenance: "2026-03-10", condition: "Муу" },
    { id: 8, name: "Server Rack", category: "Серверийн тоног төхөөрөмж", quantity: 3, value: "₮ 30,000,000", location: "Мэдээллийн төв", status: "Ашиглагдаж", lastMaintenance: "2026-04-01", condition: "Сайн" },
  ];

  const summaryStats = {
    totalValue: "₮ 281,000,000",
    totalItems: 139,
    categories: 4,
    maintenanceDue: 2
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ашиглагдаж": return "bg-emerald-500/10 text-emerald-400";
      case "Засварт": return "bg-amber-500/10 text-amber-400";
      case "Хадгалалт": return "bg-blue-500/10 text-blue-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Сайн": return "text-emerald-400";
      case "Дунд": return "text-amber-400";
      case "Муу": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Компьютер": return "💻";
      case "Сүлжээний тоног төхөөрөмж": return "🌐";
      case "Проектор": return "📽️";
      case "Тавилга": return "🪑";
      case "Хэвлэгч": return "🖨️";
      case "Серверийн тоног төхөөрөмж": return "🖥️";
      default: return "📦";
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
                <h1 className="text-2xl font-bold text-white">Эд хөрөнгийн бүртгэл</h1>
                <p className="mt-1 text-sm text-white/50">Сургуулийн эд хөрөнгийн бүртгэл, хяналт</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">{getRoleLabel()}</p>
                  <p className="text-xs text-white/40">Эд хөрөнгийн бүртгэл</p>
                </div>
                <Link href={getDashboardLink()} className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт үнэ цэнэ", value: summaryStats.totalValue, icon: "💰", color: "bg-emerald-500" },
                { label: "Нийт тоо", value: summaryStats.totalItems, icon: "📦", color: "bg-blue-500" },
                { label: "Ангилал", value: summaryStats.categories, icon: "🏷️", color: "bg-amber-500" },
                { label: "Засвар шаардлагатай", value: summaryStats.maintenanceDue, icon: "🔧", color: "bg-red-500" },
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

            {/* Inventory List */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Эд хөрөнгийн жагсаалт</h2>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                    Тайлан татах
                  </button>
                  <button className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                    Шинэ эд хөрөнгө нэмэх
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Нэр</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Ангилал</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Тоо</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үнэ цэнэ</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Байршил</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Сүүлийн засвар</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Нөхцөл</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">{getCategoryIcon(item.category)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-white">{item.quantity}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-emerald-400">{item.value}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.location}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-3 py-1 text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.lastMaintenance}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className={`text-sm font-bold ${getConditionColor(item.condition)}`}>
                            {item.condition}
                          </p>
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

            {/* Inventory Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Category Distribution */}
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Ангиллын тархалт</h2>
                <div className="space-y-4">
                  {[
                    { category: "Компьютер", count: 45, value: "₮ 135,000,000", color: "from-blue-400 to-cyan-300" },
                    { category: "Сүлжээний тоног төхөөрөмж", count: 8, value: "₮ 40,000,000", color: "from-emerald-400 to-green-300" },
                    { category: "Проектор", count: 12, value: "₮ 24,000,000", color: "from-amber-400 to-yellow-300" },
                    { category: "Тавилга", count: 65, value: "₮ 40,000,000", color: "from-purple-400 to-pink-300" },
                    { category: "Хэвлэгч", count: 6, value: "₮ 12,000,000", color: "from-red-400 to-orange-300" },
                    { category: "Серверийн тоног төхөөрөмж", count: 3, value: "₮ 30,000,000", color: "from-indigo-400 to-blue-300" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{item.category}</p>
                        <span className="text-sm font-bold text-white">{item.count} ширхэг</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                        <span>Нийт үнэ: {item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${(item.count / summaryStats.totalItems) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition Analysis */}
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">Нөхцөлийн шинжилгээ</h2>
                <div className="space-y-4">
                  {[
                    { condition: "Сайн", count: 5, value: "₮ 220,000,000", color: "bg-emerald-500" },
                    { condition: "Дунд", count: 2, value: "₮ 49,000,000", color: "bg-amber-500" },
                    { condition: "Муу", count: 1, value: "₮ 12,000,000", color: "bg-red-500" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${item.color}`} />
                          <p className="text-sm font-medium text-white">{item.condition}</p>
                        </div>
                        <span className="text-sm font-bold text-white">{item.count} зүйл</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                        <span>Нийт үнэ: {item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${(item.count / inventoryData.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Maintenance Schedule */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">Засварын хуваарь</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Эд хөрөнгө</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Сүүлийн засвар</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Дараагийн засвар</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Засварын төрөл</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: "Canon Printer", last: "2026-03-10", next: "2026-05-10", type: "Гол засвар", status: "Хүлээгдэж", color: "bg-amber-500/10 text-amber-400" },
                      { item: "Epson Projector", last: "2026-04-05", next: "2026-07-05", type: "Түр засвар", status: "Төлөвлөгдсөн", color: "bg-blue-500/10 text-blue-400" },
                      { item: "Dell Latitude 5420", last: "2026-04-15", next: "2026-07-15", type: "Түр засвар", status: "Төлөвлөгдсөн", color: "bg-blue-500/10 text-blue-400" },
                      { item: "HP ProBook 450 G8", last: "2026-04-10", next: "2026-07-10", type: "Түр засвар", status: "Төлөвлөгдсөн", color: "bg-blue-500/10 text-blue-400" },
                      { item: "Cisco Catalyst 2960", last: "2026-03-20", next: "2026-06-20", type: "Түр засвар", status: "Төлөвлөгдсөн", color: "bg-blue-500/10 text-blue-400" },
                    ].map((item, index) => (
                      <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-white">{item.item}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.last}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.next}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/80">{item.type}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full border px-3 py-1 text-xs ${item.color}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Төлөвлөх
                            </button>
                            <button className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-500/25">
                              Засвар бүртгэх
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Management Tools */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">Эд хөрөнгийн удирдлагын хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Эд хөрөнгө нэмэх", 
                    description: "Шинэ эд хөрөнгө бүртгэх",
                    icon: "➕",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Эд хөрөнгө засах", 
                    description: "Эд хөрөнгийн мэдээлэл засах",
                    icon: "✏️",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Засвар бүртгэх", 
                    description: "Эд хөрөнгийн засвар бүртгэх",
                    icon: "🔧",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Тайлан гаргах", 
                    description: "Эд хөрөнгийн тайлан үүсгэх",
                    icon: "📊",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Хуваарилалт", 
                    description: "Эд хөрөнгө хуваарилах",
                    icon: "📋",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Хуучирсан эд хөрөнгө", 
                    description: "Хуучирсан эд хөрөнгийн жагсаалт",
                    icon: "🗑️",
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

            {/* Asset Depreciation */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-lg font-semibold text-white mb-4">Эд хөрөнгийн элэгдэл</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <span className="text-lg">📉</span>
                    </div>
                    <h3 className="font-bold text-white">Элэгдлийн тооцоо</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Компьютер: 3 жилийн ашиглалтын хугацаа</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Сүлжээний тоног төхөөрөмж: 5 жилийн ашиглалтын хугацаа</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Проектор: 4 жилийн ашиглалтын хугацаа</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>Тавилга: 8 жилийн ашиглалтын хугацаа</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-lg">💰</span>
                    </div>
                    <h3 className="font-bold text-white">Элэгдлийн дүн</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Жилийн элэгдэл: ₮ 56,200,000</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Нийт элэгдэл: ₮ 168,600,000</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Үлдэгдэл үнэ: ₮ 112,400,000</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>Элэгдлийн хувь: 60%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}