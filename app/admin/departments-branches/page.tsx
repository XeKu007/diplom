"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function DepartmentsBranches() {
  const [activeMenu, setActiveMenu] = useState("Тэнхим, салбар сургууль");
  


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
                <h1 className="text-2xl font-bold text-white">Тэнхим, салбар сургууль</h1>
                <p className="mt-1 text-sm text-white/50">Индра коллежийн тэнхим, салбар сургуулийн мэдээлэл</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">Бүрэн эрхт админ</p>
                  <p className="text-xs text-white/40">Тэнхим, салбар</p>
                </div>
                <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
              <div className="max-w-6xl mx-auto">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">Тэнхим, салбар сургууль</h2>
                <p className="text-sm text-white/50 mb-6 text-center">
                  Индра коллежийн тэнхим, салбар сургуулийн бүрэн мэдээлэл
                </p>
                
                {/* Departments */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Тэнхимүүд</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        name: "Програм хангамжийн тэнхим",
                        head: "Д.Энхбаяр",
                        students: "420",
                        teachers: "12",
                        icon: "💻",
                        color: "from-blue-500 to-cyan-600"
                      },
                      {
                        name: "Сүлжээний технологийн тэнхим",
                        head: "Б.Батбаяр",
                        students: "380",
                        teachers: "10",
                        icon: "🌐",
                        color: "from-emerald-500 to-teal-600"
                      },
                      {
                        name: "Мэдээллийн аюулгүй байдлын тэнхим",
                        head: "Ц.Ганбаатар",
                        students: "280",
                        teachers: "8",
                        icon: "🔒",
                        color: "from-amber-500 to-orange-600"
                      },
                      {
                        name: "Мэдээлэл зүйн тэнхим",
                        head: "Л.Нямдаваа",
                        students: "320",
                        teachers: "9",
                        icon: "📊",
                        color: "from-purple-500 to-pink-600"
                      },
                      {
                        name: "Дижитал маркетингийн тэнхим",
                        head: "С.Эрдэнэтуяа",
                        students: "240",
                        teachers: "7",
                        icon: "📱",
                        color: "from-rose-500 to-red-600"
                      },
                      {
                        name: "Системийн инженерийн тэнхим",
                        head: "Ж.Батжаргал",
                        students: "190",
                        teachers: "6",
                        icon: "⚙️",
                        color: "from-indigo-500 to-blue-600"
                      },
                    ].map((dept, index) => (
                      <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                            <span className="text-xl">{dept.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{dept.name}</h4>
                            <p className="text-sm text-white/50">Тэнхимийн эрхлэгч: {dept.head}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-center">
                            <p className="text-sm text-white/50 mb-1">Оюутнууд</p>
                            <p className="text-lg font-bold text-white">{dept.students}</p>
                          </div>
                          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-center">
                            <p className="text-sm text-white/50 mb-1">Багш нар</p>
                            <p className="text-lg font-bold text-white">{dept.teachers}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Branches */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Салбар сургуулиуд</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      {
                        name: "Хан-Уул дүүргийн салбар",
                        address: "Хан-Уул дүүрэг, 1-р хороо",
                        manager: "Б.Гантулга",
                        students: "650",
                        established: "2018",
                        icon: "🏫",
                        color: "from-blue-500 to-cyan-600"
                      },
                      {
                        name: "Баянгол дүүргийн салбар",
                        address: "Баянгол дүүрэг, 5-р хороо",
                        manager: "Ц.Энхтуяа",
                        students: "480",
                        established: "2020",
                        icon: "🏢",
                        color: "from-emerald-500 to-teal-600"
                      },
                      {
                        name: "Сүхбаатар дүүргийн салбар",
                        address: "Сүхбаатар дүүрэг, 3-р хороо",
                        manager: "Л.Нямдаваа",
                        students: "520",
                        established: "2019",
                        icon: "🏛️",
                        color: "from-amber-500 to-orange-600"
                      },
                      {
                        name: "Чингэлтэй дүүргийн салбар",
                        address: "Чингэлтэй дүүрэг, 2-р хороо",
                        manager: "Д.Батбаяр",
                        students: "420",
                        established: "2021",
                        icon: "🏘️",
                        color: "from-purple-500 to-pink-600"
                      },
                    ].map((branch, index) => (
                      <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${branch.color} flex items-center justify-center`}>
                            <span className="text-xl">{branch.icon}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{branch.name}</h4>
                            <p className="text-sm text-white/50">{branch.address}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-center">
                            <p className="text-sm text-white/50 mb-1">Захирал</p>
                            <p className="text-sm font-bold text-white">{branch.manager}</p>
                          </div>
                          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-center">
                            <p className="text-sm text-white/50 mb-1">Оюутнууд</p>
                            <p className="text-lg font-bold text-white">{branch.students}</p>
                          </div>
                          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-center">
                            <p className="text-sm text-white/50 mb-1">Үүсгэсэн</p>
                            <p className="text-lg font-bold text-white">{branch.established}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Statistics */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Статистик мэдээлэл</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      { label: "Нийт тэнхим", value: "6", icon: "🏛️", change: "+0" },
                      { label: "Нийт салбар", value: "4", icon: "🏫", change: "+1" },
                      { label: "Нийт оюутан", value: "2,450", icon: "👨‍🎓", change: "+120" },
                      { label: "Нийт багш", value: "52", icon: "👨‍🏫", change: "+4" },
                    ].map((stat, index) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">{stat.icon}</span>
                          <div>
                            <p className="text-sm text-white/50">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                          </div>
                        </div>
                        <p className="text-sm text-emerald-400">{stat.change} сүүлийн улиралд</p>
                      </div>
                    ))}
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