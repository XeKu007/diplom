"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function OrganizationStructure() {
  const [activeMenu, setActiveMenu] = useState("Байгууллагын бүтэц");
  


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
                <h1 className="text-2xl font-bold text-white">Байгууллагын бүтэц</h1>
                <p className="mt-1 text-sm text-white/50">Индра коллежийн байгууллагын бүтэц, хэлтэс, салбарууд</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">Бүрэн эрхт админ</p>
                  <p className="text-xs text-white/40">Байгууллагын бүтэц</p>
                </div>
                <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Content */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 text-center">Байгууллагын бүтэц</h2>
                <p className="text-sm text-white/50 mb-6 text-center">
                  Индра коллежийн байгууллагын бүтэц, хэлтэс, салбаруудын мэдээлэл
                </p>
                
                {/* Organization chart */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Байгууллагын бүтэцийн диаграм</h3>
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
                    <div className="flex flex-col items-center">
                      {/* Top level - Director */}
                      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">👨‍💼</span>
                          <div>
                            <p className="font-bold text-white">Захирал</p>
                            <p className="text-sm text-white/50">Д.Батбаяр</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Second level - Departments */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {[
                          { title: "Сургалтын алба", head: "Б.Ганбаатар", icon: "📚" },
                          { title: "Санхүүгийн алба", head: "Ц.Энхтуяа", icon: "💰" },
                          { title: "Хүний нөөцийн алба", head: "Л.Нямдаваа", icon: "👥" },
                        ].map((dept, index) => (
                          <div key={index} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xl">{dept.icon}</span>
                              <div>
                                <p className="font-bold text-white">{dept.title}</p>
                                <p className="text-sm text-white/50">{dept.head}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Third level - Sub-departments */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        {[
                          { title: "Програм хангамж", icon: "💻" },
                          { title: "Сүлжээний технологи", icon: "🌐" },
                          { title: "Мэдээллийн аюулгүй байдал", icon: "🔒" },
                          { title: "Мэдээлэл зүй", icon: "📊" },
                        ].map((sub, index) => (
                          <div key={index} className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{sub.icon}</span>
                              <p className="text-sm font-medium text-white">{sub.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Department details */}
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    {
                      title: "Сургалтын алба",
                      description: "Хичээлийн төлөвлөгөө, багш нарын удирдлага, оюутны бүртгэл",
                      stats: [
                        { label: "Багш нар", value: "48" },
                        { label: "Оюутнууд", value: "1,245" },
                        { label: "Хичээлүүд", value: "156" },
                      ],
                      icon: "📚"
                    },
                    {
                      title: "Санхүүгийн алба",
                      description: "Төлбөрийн мэдээлэл, цалин, төсөв төлөвлөлт, санхүүгийн тайлан",
                      stats: [
                        { label: "Төлбөр төлөлт", value: "92%" },
                        { label: "Төсөв", value: "₮ 2.4 тэрбум" },
                        { label: "Цалин", value: "₮ 450 сая" },
                      ],
                      icon: "💰"
                    },
                    {
                      title: "Хүний нөөцийн алба",
                      description: "Ажилчдын бүртгэл, цалин урамшуулал, сургалт хөгжил",
                      stats: [
                        { label: "Ажилчид", value: "86" },
                        { label: "Сургалт", value: "12" },
                        { label: "Гэрээ", value: "98" },
                      ],
                      icon: "👥"
                    },
                    {
                      title: "Технологийн алба",
                      description: "Системийн дэмжлэг, техник хангамж, програм хангамж",
                      stats: [
                        { label: "Систем", value: "8" },
                        { label: "Сервер", value: "12" },
                        { label: "Хэрэглэгч", value: "1,379" },
                      ],
                      icon: "💻"
                    },
                  ].map((dept, index) => (
                    <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{dept.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{dept.title}</h3>
                          <p className="text-sm text-white/50">{dept.description}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {dept.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="rounded-lg border border-white/10 bg-white/[0.06] p-3 text-center">
                            <p className="text-sm text-white/50 mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-white">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}