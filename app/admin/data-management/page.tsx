"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function DataManagement() {
  const [activeMenu, setActiveMenu] = useState("Өгөгдлийн менежмент");
  const [selectedTable, setSelectedTable] = useState("all");
  


  const databaseTables = [
    {
      id: 1,
      name: "users",
      description: "Хэрэглэгчийн мэдээлэл",
      rows: 2195,
      size: "45 MB",
      lastUpdated: "2024-05-05 14:30",
      growth: "+12",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 2,
      name: "students",
      description: "Оюутны мэдээлэл",
      rows: 1245,
      size: "28 MB",
      lastUpdated: "2024-05-05 13:15",
      growth: "+8",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      name: "teachers",
      description: "Багш нарын мэдээлэл",
      rows: 48,
      size: "2 MB",
      lastUpdated: "2024-05-05 11:45",
      growth: "+1",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 4,
      name: "courses",
      description: "Хичээлийн мэдээлэл",
      rows: 156,
      size: "5 MB",
      lastUpdated: "2024-05-05 10:20",
      growth: "+3",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 5,
      name: "attendance",
      description: "Ирцийн бүртгэл",
      rows: 24580,
      size: "120 MB",
      lastUpdated: "2024-05-05 09:05",
      growth: "+156",
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      name: "grades",
      description: "Дүнгийн мэдээлэл",
      rows: 18420,
      size: "85 MB",
      lastUpdated: "2024-05-05 08:40",
      growth: "+98",
      color: "from-rose-500 to-red-600"
    },
    {
      id: 7,
      name: "payments",
      description: "Төлбөрийн мэдээлэл",
      rows: 8920,
      size: "42 MB",
      lastUpdated: "2024-05-05 07:25",
      growth: "+45",
      color: "from-cyan-500 to-blue-600"
    },
    {
      id: 8,
      name: "salary",
      description: "Цалингийн мэдээлэл",
      rows: 480,
      size: "8 MB",
      lastUpdated: "2024-05-05 06:10",
      growth: "+12",
      color: "from-lime-500 to-green-600"
    },
    {
      id: 9,
      name: "audit_logs",
      description: "Аудитын бүртгэл",
      rows: 12560,
      size: "65 MB",
      lastUpdated: "2024-05-05 05:00",
      growth: "+85",
      color: "from-gray-500 to-gray-600"
    },
    {
      id: 10,
      name: "system_settings",
      description: "Системийн тохиргоо",
      rows: 120,
      size: "1 MB",
      lastUpdated: "2024-05-05 04:30",
      growth: "+0",
      color: "from-violet-500 to-purple-600"
    },
  ];

  const dataOperations = [
    {
      id: 1,
      operation: "Өгөгдлийн нөөц хуулбар",
      type: "backup",
      status: "completed",
      size: "2.4 GB",
      time: "2024-05-05 02:00",
      duration: "45 минут"
    },
    {
      id: 2,
      operation: "Өгөгдлийн цэвэрлэгээ",
      type: "cleanup",
      status: "completed",
      size: "120 MB",
      time: "2024-05-04 03:00",
      duration: "15 минут"
    },
    {
      id: 3,
      operation: "Өгөгдлийн шинэчлэлт",
      type: "update",
      status: "completed",
      size: "45 MB",
      time: "2024-05-04 14:30",
      duration: "8 минут"
    },
    {
      id: 4,
      operation: "Өгөгдлийн импорт",
      type: "import",
      status: "completed",
      size: "85 MB",
      time: "2024-05-03 10:15",
      duration: "25 минут"
    },
    {
      id: 5,
      operation: "Өгөгдлийн экспорт",
      type: "export",
      status: "completed",
      size: "320 MB",
      time: "2024-05-03 16:45",
      duration: "38 минут"
    },
    {
      id: 6,
      operation: "Өгөгдлийн индекс шинэчлэлт",
      type: "index",
      status: "failed",
      size: "N/A",
      time: "2024-05-02 04:00",
      duration: "N/A"
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "completed" 
      ? "bg-emerald-500/10 text-emerald-400" 
      : "bg-red-500/10 text-red-400";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "backup": return "from-blue-500 to-cyan-600";
      case "cleanup": return "from-emerald-500 to-teal-600";
      case "update": return "from-amber-500 to-orange-600";
      case "import": return "from-purple-500 to-pink-600";
      case "export": return "from-indigo-500 to-blue-600";
      case "index": return "from-gray-500 to-gray-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "backup": return "💾";
      case "cleanup": return "🧹";
      case "update": return "🔄";
      case "import": return "📥";
      case "export": return "📤";
      case "index": return "📊";
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
                <h1 className="text-2xl font-bold text-white">Өгөгдлийн менежмент</h1>
                <p className="mt-1 text-sm text-white/50">Өгөгдлийн сангийн удирдлага, нөөц хуулбар, цэвэрлэгээ</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">Бүрэн ��рхт админ</p>
                  <p className="text-xs text-white/40">Өгөгдлийн менежмент</p>
                </div>
                <button className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Шинэ үйлдэл
                </button>
                <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт хүснэгт", value: "10", icon: "📊", color: "bg-blue-500" },
                { label: "Нийт мөр", value: "68,724", icon: "📈", color: "bg-emerald-500" },
                { label: "Нийт хэмжээ", value: "401 MB", icon: "💾", color: "bg-amber-500" },
                { label: "Өдрийн өсөлт", value: "+420", icon: "📈", color: "bg-purple-500" },
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

            {/* Database Tables */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Өгөгдлийн сангийн хүснэгтүүд</h2>
                <p className="text-sm text-white/50">{databaseTables.length} хүснэгт</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Хүснэгт</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Тайлбар</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Мөр</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Хэмжээ</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Сүүлд шинэчлэгдсэн</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Өсөлт</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databaseTables.map(table => (
                      <tr key={table.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${table.color} flex items-center justify-center`}>
                              <span className="text-lg">📋</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{table.name}</p>
                              <p className="text-xs text-white/50">ID: {table.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="text-sm text-white/70">{table.description}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-lg font-bold text-white">{table.rows.toLocaleString()}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-white">{table.size}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-white">{table.lastUpdated}</p>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            {table.growth}
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
            </div>

            {/* Data Operations */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Өгөгдлийн үйлдлүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dataOperations.map(operation => (
                  <div key={operation.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getTypeColor(operation.type)} flex items-center justify-center`}>
                        <span className="text-lg">{getTypeIcon(operation.type)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{operation.operation}</h3>
                        <p className="text-sm text-white/50">{operation.time}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Төрөл:</span>
                        <span className="text-sm text-white">{operation.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Хэмжээ:</span>
                        <span className="text-sm text-white">{operation.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Үргэлжлэх хугацаа:</span>
                        <span className="text-sm text-white">{operation.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Статус:</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(operation.status)}`}>
                          {operation.status === "completed" ? "Амжилттай" : "Амжилтгүй"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Дэлгэрэнгүй
                      </button>
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Дахин гүйцэтгэх
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Database Statistics */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Хүснэгтийн хэмжээний тархалт</h2>
                <div className="space-y-4">
                  {[
                    { table: "attendance", size: 120, percentage: 30, color: "bg-indigo-500" },
                    { table: "grades", size: 85, percentage: 21, color: "bg-rose-500" },
                    { table: "audit_logs", size: 65, percentage: 16, color: "bg-gray-500" },
                    { table: "payments", size: 42, percentage: 10, color: "bg-cyan-500" },
                    { table: "users", size: 45, percentage: 11, color: "bg-blue-500" },
                    { table: "Бусад", size: 44, percentage: 11, color: "bg-emerald-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm text-white/70">{item.table}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white/50 w-16 text-right">{item.size} MB</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Өгөгдлийн өсөлтийн тренд</h2>
                <div className="space-y-4">
                  {[
                    { month: "1-р сар", growth: 1250, color: "bg-blue-500" },
                    { month: "2-р сар", growth: 1420, color: "bg-blue-500" },
                    { month: "3-р сар", growth: 1680, color: "bg-blue-500" },
                    { month: "4-р сар", growth: 1950, color: "bg-blue-500" },
                    { month: "5-р сар", growth: 2240, color: "bg-emerald-500" },
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
                              style={{ width: `${(item.growth / 2500) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white/50 w-16 text-right">{item.growth.toLocaleString()} мөр</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Maintenance Tools */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Засвар үйлчилгээний хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { 
                    name: "Өгөгдлийн нөөц хуулбар", 
                    description: "Бүрэн өгөгдлийн нөөц хуулбар үүсгэх",
                    icon: "💾",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Өгөгдлийн цэвэрлэгээ", 
                    description: "Хэрэггүй өгөгдлийг цэвэрлэх",
                    icon: "🧹",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Өгөгдлийн сэргээлт", 
                    description: "Нөөц хуулбараас өгөгдөл сэргээх",
                    icon: "🔄",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Өгөгдлийн шинжилгээ", 
                    description: "Өгөгдлийн чанар, бүрэн бүтэн байдлыг шалгах",
                    icon: "📊",
                    color: "from-purple-500 to-pink-600"
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
                      Ажиллуулах
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