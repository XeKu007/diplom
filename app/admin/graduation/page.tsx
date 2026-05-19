"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useAdminRole } from "@/hooks/useAdminRole";

export default function GraduationAdminPage() {
  const [activeMenu, setActiveMenu] = useState("Төгсөлт");
  const { getDashboardLink, getRoleLabel } = useAdminRole();

  const graduationData = [
    { id: 1, student: "Төртэмүүлэн", program: "Програм хангамжийн инженерчлэл", year: "2026", status: "Төгсөхөд бэлэн", gpa: 3.8, credits: 120 },
    { id: 2, student: "Э.Батжаргал", program: "Програм хангамжийн инженерчлэл", year: "2026", status: "Төгсөхөд бэлэн", gpa: 3.5, credits: 120 },
    { id: 3, student: "Ц.Мөнхбат", program: "Сүлжээний технологи", year: "2026", status: "Төгсөхөд бэлэн", gpa: 3.2, credits: 120 },
    { id: 4, student: "Д.Сүхбат", program: "Сүлжээний технологи", year: "2026", status: "Төгсөхөд бэлэн", gpa: 3.6, credits: 120 },
    { id: 5, student: "Б.Ганбаяр", program: "Мэдээллийн аюулгүй байдал", year: "2026", status: "Төгсөхөд бэлэн", gpa: 3.9, credits: 120 },
    { id: 6, student: "Н.Энхжаргал", program: "Мэдээллийн аюулгүй байдал", year: "2026", status: "Төгсөхөд бэлэн", gpa: 3.7, credits: 120 },
  ];

  const upcomingCeremonies = [
    { id: 1, date: "2026-06-15", time: "10:00", location: "Үндсэн танхим", students: 45 },
    { id: 2, date: "2026-06-16", time: "14:00", location: "Үндсэн танхим", students: 38 },
  ];

  const getStatusColor = (status: string) => {
    return status === "Төгсөхөд бэлэн" 
      ? "bg-emerald-500/10 text-emerald-400" 
      : "bg-amber-500/10 text-amber-400";
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
                  <h1 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Төгсөлтийн удирдлага</h1>
                  <p className="mt-1 text-xs text-white/45">Төгсөгч оюутнуудын мэдээлэл, бүртгэл, удирдлага</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                    <p className="text-sm font-medium text-white">{getRoleLabel()}</p>
                    <p className="text-xs text-white/40">Төгсөлт</p>
                  </div>
                  <Link href={getDashboardLink()} className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white">
                    Буцах
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Төгсөгч оюутан", value: graduationData.length, icon: "🎓", color: "bg-blue-500" },
                { label: "Дундаж GPA", value: (graduationData.reduce((sum, g) => sum + g.gpa, 0) / graduationData.length).toFixed(1), icon: "📊", color: "bg-emerald-500" },
                { label: "Төгсөлтийн ёслол", value: upcomingCeremonies.length, icon: "🏛️", color: "bg-amber-500" },
                { label: "Нийт кредит", value: graduationData.reduce((sum, g) => sum + g.credits, 0), icon: "📚", color: "bg-purple-500" },
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

            {/* Graduation List */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Төгсөгч оюутнууд</h2>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white">
                    Тайлан татах
                  </button>
                  <button className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                    Төгсөлт бүртгэх
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Оюутан</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Хөтөлбөр</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Он</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">GPA</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Кредит</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Төлөв</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-white/70">Үйлдэл</th>
                    </tr>
                  </thead>
                  <tbody>
                    {graduationData.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">{item.student.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{item.student}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/70">{item.program}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-white">{item.year}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-white">{item.gpa}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-white/70">{item.credits}</p>
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

            {/* Upcoming Ceremonies */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Ceremony Schedule */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Төгсөлтийн ёслолууд</h2>
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    Бүгдийг харах
                  </button>
                </div>
                
                <div className="space-y-4">
                  {upcomingCeremonies.map((ceremony) => (
                    <div key={ceremony.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-white">{ceremony.date}</p>
                          <p className="text-xs text-white/50">{ceremony.time} - {ceremony.location}</p>
                        </div>
                        <span className="text-sm font-bold text-white">{ceremony.students} оюутан</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400">Төлөвлөгдсөн</span>
                        <button className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70 hover:text-white">
                          Дэлгэрэнгүй
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graduation Requirements */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Төгсөлтийн шаардлага</h2>
                  <button className="text-sm text-emerald-400 hover:text-emerald-300">
                    Дэлгэрэнгүй
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    { requirement: "Кредитийн шаардлага", value: "120 кредит", status: "Бүгд хангасан" },
                    { requirement: "GPA шаардлага", value: "2.0 ба түүнээс дээш", status: "Бүгд хангасан" },
                    { requirement: "Сүүлийн төлбөр", value: "Төлсөн", status: "Бүгд хангасан" },
                    { requirement: "Дипломын хүсэлт", value: "Илгээсэн", status: "Зарим дутуу" },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-white">{item.requirement}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "Бүгд хангасан" ? "bg-emerald-500/10 text-emerald-300" :
                          "bg-amber-500/10 text-amber-300"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span>{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Graduation Tools */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">Төгсөлтийн хэрэгслүүд</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { 
                    name: "Диплом бэлтгэх", 
                    description: "Диплом үүсгэх, хэвлэх",
                    icon: "📜",
                    color: "from-blue-500 to-cyan-600"
                  },
                  { 
                    name: "Төгсөлтийн ёслол", 
                    description: "Ёслол төлөвлөх, зохион байгуулах",
                    icon: "🏛️",
                    color: "from-emerald-500 to-teal-600"
                  },
                  { 
                    name: "Төгсөгчийн бүртгэл", 
                    description: "Төгсөгчийн мэдээлэл шинэчлэх",
                    icon: "📋",
                    color: "from-amber-500 to-orange-600"
                  },
                  { 
                    name: "Төгсөлтийн тайлан", 
                    description: "Төгсөлтийн статистик тайлан гаргах",
                    icon: "📊",
                    color: "from-purple-500 to-pink-600"
                  },
                ].map((tool, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
                        <span className="text-xl">{tool.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{tool.name}</h3>
                        <p className="text-sm text-white/50">{tool.description}</p>
                      </div>
                    </div>
                    <button className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white">
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