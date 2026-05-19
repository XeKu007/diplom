"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function UserPermissions() {
  const [activeMenu, setActiveMenu] = useState("Хэрэглэгчийн эрх");
  


  const roles = [
    {
      id: 1,
      name: "Бүрэн эрхт админ",
      description: "Бүх системийн удирдлага, тохиргоо, хэрэглэгчийн эрх",
      permissions: ["Бүх эрх", "Системийн тохиргоо", "Хэрэглэгчийн удирдлага", "Тайлан", "Өгөгдлийн удирдлага"],
      userCount: 3,
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 2,
      name: "Сургалтын албаны админ",
      description: "Сургалтын удирдлага, оюутны бүртгэл, хичээлийн хуваарь",
      permissions: ["Оюутны удирдлага", "Багш нарын удирдлага", "Хичээлийн хуваарь", "Ирцийн бүртгэл", "Дүнгийн бүртгэл"],
      userCount: 5,
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 3,
      name: "Санхүүгийн албаны админ",
      description: "Төлбөрийн мэдээлэл, цалин, санхүүгийн тайлан, төсөв",
      permissions: ["Төлбөрийн мэдээлэл", "Цалин удирдлага", "Санхүүгийн тайлан", "Төсөв төлөвлөлт", "Тэтгэлэг хөнгөлөлт"],
      userCount: 4,
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 4,
      name: "Багш",
      description: "Хичээл заах, ирц бүртгэх, дүн оруулах, сургалтын материал",
      permissions: ["Хичээлийн удирдлага", "Ирцийн бүртгэл", "Дүнгийн бүртгэл", "Сургалтын материал", "Оюутны мэдээлэл"],
      userCount: 48,
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 5,
      name: "Оюутан",
      description: "Хичээл үзэх, дүн харах, төлбөрийн мэдээлэл, ирцийн мэдээлэл",
      permissions: ["Хичээл үзэх", "Дүн харах", "Төлбөрийн мэдээлэл", "Ирцийн мэдээлэл", "Профайл засах"],
      userCount: 1245,
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      name: "Эцэг/эх",
      description: "Хүүхдийн дүн, ирцийн мэдээлэл, төлбөрийн мэдээлэл, мэдэгдэл",
      permissions: ["Хүүхдийн дүн", "Ирцийн мэдээлэл", "Төлбөрийн мэдээлэл", "Мэдэгдэл", "Профайл засах"],
      userCount: 890,
      color: "from-rose-500 to-red-600"
    },
  ];

  const permissions = [
    { id: 1, name: "Системийн тохиргоо", description: "Системийн ерөнхий тохиргоог өөрчлөх" },
    { id: 2, name: "Хэрэглэгчийн удирдлага", description: "Хэрэглэгч нэмэх, засах, устгах" },
    { id: 3, name: "Роль удирдлага", description: "Роль нэмэх, засах, устгах" },
    { id: 4, name: "Эрх удирдлага", description: "Эрх нэмэх, засах, устгах" },
    { id: 5, name: "Оюутны удирдлага", description: "Оюутан нэмэх, засах, устгах" },
    { id: 6, name: "Багш нарын удирдлага", description: "Багш нэмэх, засах, устгах" },
    { id: 7, name: "Хичээлийн удирдлага", description: "Хичээл нэмэх, засах, устгах" },
    { id: 8, name: "Төлбөрийн удирдлага", description: "Төлбөрийн мэдээлэл нэмэх, засах" },
    { id: 9, name: "Цалин удирдлага", description: "Цалингийн мэдээлэл нэмэх, засах" },
    { id: 10, name: "Тайлан үзэх", description: "Төрөл бүрийн тайлан үзэх" },
    { id: 11, name: "Өгөгдлийн удирдлага", description: "Өгөгдлийн сангийн удирдлага" },
    { id: 12, name: "Системийн мониторинг", description: "Системийн мониторинг хийх" },
  ];

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
                <h1 className="text-2xl font-bold text-white">Хэрэглэгчийн эрх</h1>
                <p className="mt-1 text-sm text-white/50">Роль, эрхийн удирдлага, хандалтын хяналт</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">Бүрэн эрхт админ</p>
                  <p className="text-xs text-white/40">Эрхийн удирдлага</p>
                </div>
                <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт роль", value: "6", icon: "👥", color: "bg-blue-500" },
                { label: "Нийт эрх", value: "12", icon: "🔑", color: "bg-emerald-500" },
                { label: "Нийт хэрэглэгч", value: "2,195", icon: "👤", color: "bg-amber-500" },
                { label: "Идэвхтэй эрх", value: "48", icon: "✅", color: "bg-purple-500" },
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

            {/* Roles */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Роль</h2>
                <button className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Шинэ роль нэмэх
                </button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map(role => (
                  <div key={role.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                        <span className="text-xl">👑</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{role.name}</h3>
                        <p className="text-sm text-white/50">{role.userCount} хэрэглэгч</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/50 mb-4">{role.description}</p>
                    <div className="space-y-2">
                      {role.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          <span className="text-xs text-white/70">{permission}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Засах
                      </button>
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Эрх засах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Эрхүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {permissions.map(permission => (
                  <div key={permission.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">{permission.name}</h3>
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300">
                        ID: {permission.id}
                      </span>
                    </div>
                    <p className="text-sm text-white/50 mb-4">{permission.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                        <span className="text-xs text-white/50">Идэвхтэй</span>
                      </div>
                      <div className="flex gap-1">
                        <button className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-xs text-white/70 hover:text-white">
                          Засах
                        </button>
                        <button className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 text-xs text-white/70 hover:text-white">
                          Устгах
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Log */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4">Сүүлийн эрх өөрчлөлтүүд</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Огноо</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Хэрэглэгч</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Үйлдэл</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Роль</th>
                      <th className="pb-3 text-left text-sm font-medium text-white/50">Гүйцэтгэгч</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { date: "2024-05-05 14:30", user: "Б.Ганбаатар", action: "Роль нэмэв", role: "Сургалтын албаны админ", admin: "Д.Батбаяр" },
                      { date: "2024-05-04 11:15", user: "Ц.Энхтуяа", action: "Эрх өөрчилсөн", role: "Санхүүгийн албаны админ", admin: "Д.Батбаяр" },
                      { date: "2024-05-03 09:45", user: "Д.Энхбаяр", action: "Роль зассан", role: "Багш", admin: "Б.Ганбаатар" },
                      { date: "2024-05-02 16:20", user: "Б.Батбаяр", action: "Эрх нэмэв", role: "Багш", admin: "Б.Ганбаатар" },
                      { date: "2024-05-01 13:10", user: "Ц.Ганбаатар", action: "Роль зассан", role: "Багш", admin: "Б.Ганбаатар" },
                    ].map((log, index) => (
                      <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="py-3">
                          <p className="text-white">{log.date}</p>
                        </td>
                        <td className="py-3">
                          <p className="text-white">{log.user}</p>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3">
                          <p className="text-white">{log.role}</p>
                        </td>
                        <td className="py-3">
                          <p className="text-white">{log.admin}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}