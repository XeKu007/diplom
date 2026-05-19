"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function TrainingManagement() {
  const [activeMenu, setActiveMenu] = useState("Хөтөлбөр / Сургалтын төлөвлөгөө");
  


  const trainingPrograms = [
    {
      id: 1,
      name: "Програм хангамжийн инженерчлэл",
      department: "Програм хангамжийн тэнхим",
      duration: "4 жил",
      students: 420,
      teachers: 12,
      status: "active",
      budget: "₮ 1.2 тэрбум",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 2,
      name: "Сүлжээний технологи",
      department: "Сүлжээний технологийн тэнхим",
      duration: "4 жил",
      students: 380,
      teachers: 10,
      status: "active",
      budget: "₮ 1.1 тэрбум",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      name: "Мэдээллийн аюулгүй байдал",
      department: "Мэдээллийн аюулгүй байдлын тэнхим",
      duration: "4 жил",
      students: 280,
      teachers: 8,
      status: "active",
      budget: "₮ 900 сая",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 4,
      name: "Мэдээлэл зүй",
      department: "Мэдээлэл зүйн тэнхим",
      duration: "4 жил",
      students: 320,
      teachers: 9,
      status: "active",
      budget: "₮ 950 сая",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 5,
      name: "Дижитал маркетинг",
      department: "Дижитал маркетингийн тэнхим",
      duration: "3 жил",
      students: 240,
      teachers: 7,
      status: "active",
      budget: "₮ 750 сая",
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      name: "Системийн инженеринг",
      department: "Системийн инженерийн тэнхим",
      duration: "4 жил",
      students: 190,
      teachers: 6,
      status: "planning",
      budget: "₮ 650 сая",
      color: "from-rose-500 to-red-600"
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-emerald-500/10 text-emerald-400" 
      : "bg-amber-500/10 text-amber-400";
  };

  const getStatusText = (status: string) => {
    return status === "active" ? "Идэвхтэй" : "Төлөвлөгдөж байгаа";
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
                <h1 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Хөтөлбөр / Сургалтын төлөвлөгөө</h1>
                <p className="mt-1 text-xs text-white/45">Бүрэн эрхт админы сургалтын хөтөлбөр, төлөвлөгөөний удирдлага</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">Бүрэн эрхт админ</p>
                  <p className="text-xs text-white/40">Сургалтын удирдлага</p>
                </div>
                <button className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Шинэ хөтөлбөр нэмэх
                </button>
                <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт хөтөлбөр", value: "6", icon: "📚", color: "bg-blue-500" },
                { label: "Нийт оюутан", value: "1,830", icon: "👨‍🎓", color: "bg-emerald-500" },
                { label: "Нийт багш", value: "52", icon: "👨‍🏫", color: "bg-amber-500" },
                { label: "Нийт төсөв", value: "₮ 5.6 тэрбум", icon: "💰", color: "bg-purple-500" },
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

            {/* Training Programs List */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Сургалтын хөтөлбөрүүд</h2>
                <p className="text-sm text-white/50">{trainingPrograms.length} хөтөлбөр</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trainingPrograms.map(program => (
                  <div key={program.id} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${program.color} flex items-center justify-center`}>
                          <span className="text-lg">📚</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{program.name}</h3>
                          <p className="text-sm text-white/50">{program.department}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(program.status)}`}>
                        {getStatusText(program.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Хугацаа:</span>
                        <span className="text-sm text-white">{program.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Оюутнууд:</span>
                        <span className="text-sm text-white">{program.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Багш нар:</span>
                        <span className="text-sm text-white">{program.teachers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Төсөв:</span>
                        <span className="text-sm text-white">{program.budget}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Дэлгэрэнгүй
                      </button>
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Засах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Distribution */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">Тэнхимийн сургалтын тархалт</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { department: "Програм хангамжийн тэнхим", programs: 3, students: 420, budget: "₮ 1.2 тэрбум", color: "bg-blue-500" },
                  { department: "Сүлжээний технологийн тэнхим", programs: 2, students: 380, budget: "₮ 1.1 тэрбум", color: "bg-emerald-500" },
                  { department: "Мэдээллийн аюулгүй байдлын тэнхим", programs: 2, students: 280, budget: "₮ 900 сая", color: "bg-amber-500" },
                  { department: "Мэдээлэл зүйн тэнхим", programs: 2, students: 320, budget: "₮ 950 сая", color: "bg-purple-500" },
                  { department: "Дижитал маркетингийн тэнхим", programs: 1, students: 240, budget: "₮ 750 сая", color: "bg-indigo-500" },
                  { department: "Системийн инженерийн тэнхим", programs: 1, students: 190, budget: "₮ 650 сая", color: "bg-rose-500" },
                ].map((item, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-white">{item.department}</p>
                        <p className="text-sm text-white/50">{item.programs} хөтөлбөр</p>
                      </div>
                      <div className={`h-10 w-10 rounded-full ${item.color} flex items-center justify-center`}>
                        <span className="text-lg">🏛️</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Оюутнууд:</span>
                        <span className="text-sm text-white">{item.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Төсөв:</span>
                        <span className="text-sm text-white">{item.budget}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Management Tools */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">Сургалтын удирдлагын хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { 
                    name: "Хөтөлбөр бүртгэл", 
                    description: "Шинэ сургалтын хөтөлбөр бүртгэх, засах",
                    icon: "📝",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Төлөвлөгөө үүсгэх", 
                    description: "Сургалтын төлөвлөгөө, хуваарь үүсгэх",
                    icon: "📅",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Нөөцийн хуваарилалт", 
                    description: "Багш, анги, тоног төхөөрөмжийн хуваарилалт",
                    icon: "👨‍🏫",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Төсөв төлөвлөлт", 
                    description: "Сургалтын төсөв төлөвлөх, хянах",
                    icon: "💰",
                    color: "from-purple-500 to-pink-600"
                  },
                  { 
                    name: "Гүйцэтгэлийн үнэлгээ", 
                    description: "Сургалтын гүйцэтгэлийн үнэлгээ хийх",
                    icon: "📊",
                    color: "from-indigo-500 to-blue-600"
                  },
                  { 
                    name: "Тайлан үүсгэх", 
                    description: "Сургалтын тайлан, статистик үүсгэх",
                    icon: "📈",
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