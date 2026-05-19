"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function Backups() {
  const [activeMenu, setActiveMenu] = useState("Нөөц хуулбар");
  const [backupType, setBackupType] = useState("all");
  


  const backups = [
    {
      id: 1,
      name: "Өгөгдлийн сан - Бүрэн",
      type: "database",
      size: "2.4 GB",
      date: "2024-05-05 02:00",
      status: "completed",
      retention: "30 хоног",
      location: "Орон нутгийн сервер"
    },
    {
      id: 2,
      name: "Файлууд - Бүрэн",
      type: "files",
      size: "1.8 GB",
      date: "2024-05-05 01:00",
      status: "completed",
      retention: "30 хоног",
      location: "Орон нутгийн сервер"
    },
    {
      id: 3,
      name: "Өгөгдлийн сан - Өдөр тутмын",
      type: "database",
      size: "45 MB",
      date: "2024-05-04 02:00",
      status: "completed",
      retention: "7 хоног",
      location: "Cloud Storage"
    },
    {
      id: 4,
      name: "Лог файлууд",
      type: "logs",
      size: "120 MB",
      date: "2024-05-04 03:00",
      status: "completed",
      retention: "14 хоног",
      location: "Орон нутгийн сервер"
    },
    {
      id: 5,
      name: "Тохиргооны файлууд",
      type: "config",
      size: "15 MB",
      date: "2024-05-04 04:00",
      status: "completed",
      retention: "90 хоног",
      location: "Cloud Storage"
    },
    {
      id: 6,
      name: "Өгөгдлийн сан - Өдөр тутмын",
      type: "database",
      size: "42 MB",
      date: "2024-05-03 02:00",
      status: "completed",
      retention: "7 хоног",
      location: "Cloud Storage"
    },
    {
      id: 7,
      name: "Файлууд - Өдөр тутмын",
      type: "files",
      size: "65 MB",
      date: "2024-05-03 01:00",
      status: "completed",
      retention: "7 хоног",
      location: "Cloud Storage"
    },
    {
      id: 8,
      name: "Өгөгдлийн сан - Өдөр тутмын",
      type: "database",
      size: "38 MB",
      date: "2024-05-02 02:00",
      status: "failed",
      retention: "7 хоног",
      location: "Cloud Storage"
    },
    {
      id: 9,
      name: "Файлууд - Өдөр тутмын",
      type: "files",
      size: "58 MB",
      date: "2024-05-02 01:00",
      status: "completed",
      retention: "7 хоног",
      location: "Cloud Storage"
    },
    {
      id: 10,
      name: "Өгөгдлийн сан - Сар бүр",
      type: "database",
      size: "2.5 GB",
      date: "2024-05-01 02:00",
      status: "completed",
      retention: "365 хоног",
      location: "Орон нутгийн сервер"
    },
  ];

  const backupTypes = [
    { value: "all", label: "Бүх төрөл" },
    { value: "database", label: "Өгөгдлийн сан" },
    { value: "files", label: "Файлууд" },
    { value: "logs", label: "Лог файлууд" },
    { value: "config", label: "Тохиргоо" },
  ];

  const filteredBackups = backups.filter(backup => {
    return backupType === "all" || backup.type === backupType;
  });

  const getStatusColor = (status: string) => {
    return status === "completed" 
      ? "bg-emerald-500/10 text-emerald-400" 
      : "bg-red-500/10 text-red-400";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "database": return "from-blue-500 to-cyan-600";
      case "files": return "from-emerald-500 to-teal-600";
      case "logs": return "from-amber-500 to-orange-600";
      case "config": return "from-purple-500 to-pink-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database": return "💾";
      case "files": return "📁";
      case "logs": return "📊";
      case "config": return "⚙️";
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
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Нөөц хуулбар</h1>
                  <p className="mt-1 text-xs text-white/45">Өгөгдлийн нөөц хуулбар, сэргээлтийн удирдлага</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                    <p className="text-sm font-medium text-white">Бүрэн эрхт админ</p>
                    <p className="text-xs text-white/40">Нөөц хуулбар</p>
                  </div>
                  <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white">
                    Шинэ хуулбар үүсгэх
                  </button>
                  <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white">
                    Буцах
                  </Link>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-64">
                  <label className="block text-sm text-white/50 mb-2">Төрлөөр шүүх</label>
                  <select
                    value={backupType}
                    onChange={(e) => setBackupType(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-white/20 focus:outline-none"
                  >
                    {backupTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт хуулбар", value: "10", icon: "💾", color: "bg-blue-500" },
                { label: "Нийт хэмжээ", value: "4.5 GB", icon: "📊", color: "bg-emerald-500" },
                { label: "Амжилттай", value: "9", icon: "✅", color: "bg-amber-500" },
                { label: "Амжилтгүй", value: "1", icon: "❌", color: "bg-red-500" },
              ].map((stat, index) => (
                <div key={index} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
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

            {/* Backups List */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Нөөц хуулбарын жагсаалт</h2>
                <p className="text-sm text-white/50">{filteredBackups.length} хуулбар</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Хуулбар</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Төрөл</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Хэмжээ</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Огноо</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Статус</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Хадгалах хугацаа</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Байршил</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBackups.map(backup => (
                      <tr key={backup.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getTypeColor(backup.type)} flex items-center justify-center`}>
                              <span className="text-lg">{getTypeIcon(backup.type)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{backup.name}</p>
                              <p className="text-xs text-white/50">ID: {backup.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                            {backup.type === "database" ? "Өгөгдлийн сан" :
                             backup.type === "files" ? "Файлууд" :
                             backup.type === "logs" ? "Лог файлууд" : "Тохиргоо"}
                          </span>
                        </td>
                        <td className="py-4">
                          <p className="text-lg font-bold text-white">{backup.size}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-white">{backup.date}</p>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(backup.status)}`}>
                            {backup.status === "completed" ? "Амжилттай" : "Амжилтгүй"}
                          </span>
                        </td>
                        <td className="py-4">
                          <p className="text-white">{backup.retention}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm text-white/70">{backup.location}</p>
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2">
                            <button className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Сэргээх
                            </button>
                            <button className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                              Татаж авах
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredBackups.length === 0 && (
                <div className="py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Хуулбар олдсонгүй</h3>
                  <p className="text-sm text-white/50">Хайлтын үр дүнд тохирох нөөц хуулбар олдсонгүй</p>
                </div>
              )}
            </div>

            {/* Backup Schedule */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Хуулбарлах хуваарь</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Өгөгдлийн сан - Өдөр тутмын",
                    frequency: "Өдөр бүр",
                    time: "02:00 AM",
                    type: "автомат",
                    nextRun: "2024-05-06 02:00",
                    status: "идэвхтэй",
                    color: "from-blue-500 to-cyan-600"
                  },
                  {
                    name: "Файлууд - Өдөр тутмын",
                    frequency: "Өдөр бүр",
                    time: "01:00 AM",
                    type: "автомат",
                    nextRun: "2024-05-06 01:00",
                    status: "идэвхтэй",
                    color: "from-emerald-500 to-teal-600"
                  },
                  {
                    name: "Лог файлууд - Өдөр тутмын",
                    frequency: "Өдөр бүр",
                    time: "03:00 AM",
                    type: "автомат",
                    nextRun: "2024-05-06 03:00",
                    status: "идэв��тэй",
                    color: "from-amber-500 to-orange-600"
                  },
                  {
                    name: "Өгөгдлийн сан - Сар бүр",
                    frequency: "Сар бүр",
                    time: "02:00 AM",
                    type: "автомат",
                    nextRun: "2024-06-01 02:00",
                    status: "идэвхтэй",
                    color: "from-purple-500 to-pink-600"
                  },
                  {
                    name: "Бүрэн систем - Улирлын",
                    frequency: "Улирал бүр",
                    time: "04:00 AM",
                    type: "автомат",
                    nextRun: "2024-07-01 04:00",
                    status: "идэвхтэй",
                    color: "from-indigo-500 to-blue-600"
                  },
                  {
                    name: "Тохиргооны файлууд - Өдөр тутмын",
                    frequency: "Өдөр бүр",
                    time: "04:00 AM",
                    type: "автомат",
                    nextRun: "2024-05-06 04:00",
                    status: "идэвхтэй",
                    color: "from-cyan-500 to-blue-600"
                  },
                ].map((schedule, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${schedule.color} flex items-center justify-center`}>
                        <span className="text-lg">⏰</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{schedule.name}</h3>
                        <p className="text-sm text-white/50">{schedule.frequency} • {schedule.time}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Дараагийн ажиллагаа:</span>
                        <span className="text-sm text-white">{schedule.nextRun}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Төрөл:</span>
                        <span className="text-sm text-white">{schedule.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Статус:</span>
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                          {schedule.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Засах
                      </button>
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Устгах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Usage */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">Хадгалах багтаамж</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-3">Орон нутгийн сервер</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white/70">Ашигласан: 4.2 GB</span>
                        <span className="text-sm text-white/70">Чөлөөт: 45.8 GB</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full" style={{ width: "8.4%" }}></div>
                      </div>
                      <p className="text-xs text-white/50 mt-1">Нийт: 50 GB • 8.4% ашигласан</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-3">Cloud Storage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white/70">Ашигласан: 250 MB</span>
                        <span className="text-sm text-white/70">Чөлөөт: 9.75 GB</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: "2.5%" }}></div>
                      </div>
                      <p className="text-xs text-white/50 mt-1">Нийт: 10 GB • 2.5% ашигласан</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}