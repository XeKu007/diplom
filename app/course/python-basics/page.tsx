"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function PythonBasicsCourse() {
  const [activeMenu, setActiveMenu] = useState("Python Basics");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [userType, setUserType] = useState<"student" | "teacher" | "parent" | null>(null);

  useEffect(() => {
    // Course pages default to student view
    setUserType("student");
  }, []);

  const weeks = [
    { id: 0, title: "Долоо хоног 1", description: "Python суулгах, орчин бэлтгэх", status: "Дууссан" },
    { id: 1, title: "Долоо хоног 2", description: "Өгөгдлийн төрлүүд, хувьсагч", status: "Дууссан" },
    { id: 2, title: "Долоо хоног 3", description: "Нөхцөл, операторууд", status: "Дууссан" },
    { id: 3, title: "Долоо хоног 4", description: "Давталт", status: "Дууссан" },
    { id: 4, title: "Долоо хоног 5", description: "Функц бичих", status: "Дууссан" },
    { id: 5, title: "Долоо хоног 6", description: "List, tuple, dictionary", status: "Дууссан" },
    { id: 6, title: "Долоо хоног 7", description: "Файл уншиж бичих", status: "Дууссан" },
    { id: 7, title: "Долоо хоног 8", description: "Дундын шалгалт", status: "Дууссан" },
    { id: 8, title: "Долоо хоног 9", description: "Exception handling", status: "Дууссан" },
    { id: 9, title: "Долоо хоног 10", description: "Module, package", status: "Дууссан" },
    { id: 10, title: "Долоо хоног 11", description: "OOP үндэс", status: "Дууссан" },
    { id: 11, title: "Долоо хоног 12", description: "Inheritance, polymorphism", status: "Дууссан" },
    { id: 12, title: "Долоо хоног 13", description: "Database холболт", status: "Дууссан" },
    { id: 13, title: "Долоо хоног 14", description: "Web scraping", status: "Явж буй" },
    { id: 14, title: "Долоо хоног 15", description: "Төслийн дадлага", status: "Дараагийн" },
    { id: 15, title: "Долоо хоног 16", description: "Эцсийн шалгалт", status: "Дараагийн" },
  ];

  const weekDetails = [
    {
      title: "Python суулгах, орчин бэлтгэх",
      topics: ["Python суулгах", "IDE сонгох", "Эхний програм"],
      resources: [
        { type: "📚", name: "Лекцийн слайд", href: "#" },
        { type: "🎬", name: "Видео хичээл", href: "#" },
        { type: "💻", name: "Жишээ код", href: "#" }
      ],
      assignments: [
        { name: "Бие даалт 1", deadline: "3 хоног", description: "Энэ долоо хоногийн сэдвүүдэд суурилсан даалгавар" }
      ]
    },
    {
      title: "Өгөгдлийн төрлүүд, хувьсагч",
      topics: ["Өгөгдлийн төрлүүд", "Хувьсагч зарлах", "Төрөл хувиргалт"],
      resources: [
        { type: "📚", name: "Лекцийн слайд", href: "#" },
        { type: "🎬", name: "Видео хичээл", href: "#" },
        { type: "💻", name: "Жишээ код", href: "#" }
      ],
      assignments: [
        { name: "Бие даалт 2", deadline: "3 хоног", description: "Өгөгдлийн төрлүүд, хувьсагчийн даалгавар" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    if (status === "Дууссан") return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
    if (status === "Явж буй") return "border-blue-400/20 bg-blue-500/10 text-blue-300";
    return "border-gray-400/20 bg-gray-500/10 text-gray-300";
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
            {/* Course & Instructor Information */}
            <div className="grid gap-6 md:grid-cols-[70fr_30fr]">
              {/* Instructor Information */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">Багшийн мэдээлэл</h2>
                <div className="grid gap-6 md:grid-cols-[216px_minmax(0,1fr)] md:items-center">
                  <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-blue-600 to-blue-800 p-3 md:h-52 md:w-52">
                    <span className="text-5xl font-semibold text-white">БГ</span>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.28em] text-white/45">Овог нэр</p>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90">Б.Ганбат</div>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.28em] text-white/45">Албан тушаал</p>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90">Python програмчлалын багш</div>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.28em] text-white/45">Имэйл</p>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                          📧 ganbat@indra.edu.mn
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] uppercase tracking-[0.28em] text-white/45">Утас</p>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                          📱 +976 9999-9999
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Description */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md flex flex-col">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">Хичээлийн тайлбар</h2>
                <div className="flex-1 flex items-center">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 w-full">
                    <p className="text-sm text-white/80 leading-relaxed text-center">
                      Энэхүү хичээл нь Python програмчлалын хэлийг суралцах анхны алхам бөгөөд үндсэн ойлголт, практик ур чадварыг эзэмшихэд чиглэгдсэн.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Overview */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Долоо хоногийн төлөвлөгөө</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/50">Харагдац:</span>
                  <select 
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  >
                    {weeks.map((week) => (
                      <option key={week.id} value={week.id}>
                        {week.title}: {week.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2">
                  {weeks.map((week) => (
                    <button 
                      key={week.id}
                      onClick={() => setSelectedWeek(week.id)}
                      className={`flex shrink-0 flex-col items-center rounded-[16px] border p-3 transition-all ${selectedWeek === week.id ? 'border-violet-400/30 bg-violet-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      style={{ minWidth: '120px' }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                        <span className="text-sm font-medium text-white">{week.title}</span>
                      </div>
                      <span className="text-xs text-white/50">{week.description}</span>
                      <div className={`mt-2 rounded-full border px-2 py-0.5 text-xs ${getStatusColor(week.status)}`}>
                        {week.status}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Week Details */}
              <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
                <div className="mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">{weeks[selectedWeek].title}: {weeks[selectedWeek].description}</h3>
                    <div className="mt-2 flex items-center gap-3">
                      <div className={`rounded-full border px-3 py-1 text-sm ${getStatusColor(weeks[selectedWeek].status)}`}>
                        {weeks[selectedWeek].status}
                      </div>
                      <span className="text-sm text-white/50">{weekDetails[selectedWeek % 2]?.topics.length || 3} сэдэв</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-white/70">Сэдвүүд:</h4>
                    <div className="space-y-3">
                      {(weekDetails[selectedWeek % 2]?.topics || weekDetails[0].topics).map((topic, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-[12px] border border-white/10 bg-white/5 p-3">
                          <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-400/20">
                            <span className="text-xs text-white/60">{index + 1}</span>
                          </div>
                          <span className="text-sm text-white/80">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-white/70">Нөөц материал:</h4>
                    <div className="space-y-2">
                      {(weekDetails[selectedWeek % 2]?.resources || weekDetails[0].resources).map((resource, index) => (
                        <a 
                          key={index}
                          href={resource.href}
                          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/70 hover:bg-white/10"
                        >
                          <span className="text-lg">{resource.type}</span>
                          {resource.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-white/70">Даалгаврууд:</h4>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {(weekDetails[selectedWeek % 2]?.assignments || weekDetails[0].assignments).map((assignment, index) => (
                        <div key={index} className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white">{assignment.name}</span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/50">
                              {assignment.deadline}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-white/50">{assignment.description}</p>
                          <button className="mt-3 w-full rounded-lg border border-violet-400/30 bg-violet-500/15 py-2 text-sm font-medium text-violet-200 transition-colors hover:bg-violet-500/25">
                            Даалгавар хийх
                          </button>
                        </div>
                      ))}
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
