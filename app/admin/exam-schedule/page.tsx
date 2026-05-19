"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function ExamScheduleAdminPage() {
  const [activeMenu, setActiveMenu] = useState("Шалгалтын хуваарь");
  const [userType, setUserType] = useState<"admin" | "training" | "finance" | null>(null);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExam, setNewExam] = useState({
    course: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    invigilator: "",
    type: ""
  });
  const [showExamDetailModal, setShowExamDetailModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [showEditExamModal, setShowEditExamModal] = useState(false);
  const [editExam, setEditExam] = useState({
    course: "",
    date: "",
    startTime: "",
    endTime: "",
    invigilator: "",
    type: ""
  });
  const [dbCourses, setDbCourses] = useState<string[]>([]);

  useEffect(() => {
    // Load courses from DB
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDbCourses(data.map((c: { name: string }) => c.name));
        }
      })
      .catch(() => {});
  }, []);

  const getBackLink = () => {
    if (userType === "training") return "/admin/training-dashboard";
    if (userType === "finance") return "/admin/finance-dashboard";
    return "/admin/dashboard";
  };

  const getAdminTitle = () => {
    if (userType === "training") return "Сургалтын админ";
    if (userType === "finance") return "Санхүүгийн админ";
    return "Бүрэн эрхт админ";
  };

  const exams = [
    { id: 1, course: "Python үндэс", date: "2026-05-15", time: "09:00-11:00", room: "301", invigilator: "Б.Ганбат", type: "Эцсийн шалгалт" },
    { id: 2, course: "JavaScript", date: "2026-05-16", time: "09:00-11:00", room: "302", invigilator: "Ц.Энхтуяа", type: "Эцсийн шалгалт" },
    { id: 3, course: "Database Systems", date: "2026-05-17", time: "09:00-11:00", room: "303", invigilator: "Д.Батжаргал", type: "Эцсийн шалгалт" },
    { id: 4, course: "Networking", date: "2026-05-18", time: "09:00-11:00", room: "304", invigilator: "Э.Түмэн", type: "Эцсийн шалгалт" },
    { id: 5, course: "Cybersecurity", date: "2026-05-19", time: "09:00-11:00", room: "305", invigilator: "Х.Сүхбат", type: "Эцсийн шалгалт" },
    { id: 6, course: "Mobile App Development", date: "2026-05-20", time: "09:00-11:00", room: "306", invigilator: "Л.Эрдэнэ", type: "Эцсийн шалгалт" },
  ];

  // Available courses - from DB or fallback
  const availableCourses = dbCourses.length > 0 ? dbCourses : [
    "Python үндэс", "JavaScript", "Database Systems", "Networking",
    "Cybersecurity", "Mobile App Development", "Web Development",
    "Data Structures", "Algorithms", "Machine Learning"
  ];

  const upcomingExams = exams.filter(exam => new Date(exam.date) > new Date());

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
            {/* Exam Schedule Cards */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Шалгалтын хуваарь</h2>
                <button 
                  onClick={() => setShowAddExamModal(true)}
                  className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/25"
                >
                  Шинэ шалгалт нэмэх
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exams.map(exam => (
                  <div key={exam.id} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">{exam.course.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{exam.course}</h3>
                          <p className="text-sm text-white/50">{exam.type}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        new Date(exam.date) > new Date() 
                          ? 'bg-emerald-500/10 text-emerald-300' 
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {new Date(exam.date) > new Date() ? 'Дараагийн' : 'Өнгөрсөн'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Огноо:</span>
                        <span className="text-sm text-white">{exam.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Цаг:</span>
                        <span className="text-sm text-white">{exam.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/50">Хянагч:</span>
                        <span className="text-sm text-white">{exam.invigilator}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setSelectedExam(exam);
                        setShowExamDetailModal(true);
                      }}
                      className="mt-4 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white"
                    >
                      Дэлгэрэнгүй
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Exam Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-[#0a1628] shadow-2xl">
            {/* Modal Header */}
            <div className="relative overflow-hidden rounded-t-2xl border-b border-white/10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-6 py-5">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white">Шинэ шалгалт нэмэх</h2>
                <p className="mt-1 text-sm text-white/70">Шалгалтын мэдээллийг оруулна уу</p>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Course */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Хичээл <span className="text-red-400">*</span>
                </label>
                <select
                  value={newExam.course}
                  onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                >
                  <option value="" className="bg-[#0a1628]">Хичээл сонгох</option>
                  {availableCourses.map((course, index) => (
                    <option key={index} value={course} className="bg-[#0a1628]">{course}</option>
                  ))}
                </select>
              </div>

              {/* Exam Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Шалгалтын төрөл <span className="text-red-400">*</span>
                </label>
                <select
                  value={newExam.type}
                  onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                >
                  <option value="" className="bg-[#0a1628]">Төрөл сонгох</option>
                  <option value="Эцсийн шалгалт" className="bg-[#0a1628]">Эцсийн шалгалт</option>
                  <option value="Дунд шалгалт" className="bg-[#0a1628]">Дунд шалгалт</option>
                  <option value="Бие даасан ажил" className="bg-[#0a1628]">Бие даасан ажил</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Огноо <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              {/* Time */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Эхлэх цаг <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={newExam.startTime}
                    onChange={(e) => setNewExam({ ...newExam, startTime: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Дуусах цаг <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={newExam.endTime}
                    onChange={(e) => setNewExam({ ...newExam, endTime: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
              </div>
              {newExam.startTime && newExam.endTime && (
                <p className="text-xs text-blue-400">
                  Шалгалтын үргэлжлэх хугацаа: {newExam.startTime} - {newExam.endTime}
                </p>
              )}

              {/* Invigilator */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Хянагч <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newExam.invigilator}
                  onChange={(e) => setNewExam({ ...newExam, invigilator: e.target.value })}
                  placeholder="Жишээ: Б.Ганбат"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-white/10 bg-[#0a1628] px-6 py-4 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowAddExamModal(false);
                  setNewExam({ course: "", date: "", startTime: "", endTime: "", room: "", invigilator: "", type: "" });
                }}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/20 hover:text-white transition-all"
              >
                Болих
              </button>
              <button
                onClick={() => {
                  if (!newExam.course || !newExam.date || !newExam.startTime || !newExam.endTime || !newExam.invigilator || !newExam.type) {
                    alert("Бүх талбарыг бөглөнө үү!");
                    return;
                  }
                  const timeRange = `${newExam.startTime}-${newExam.endTime}`;
                  alert(`Шинэ шалгалт нэмэгдлээ:\n\nХичээл: ${newExam.course}\nТөрөл: ${newExam.type}\nОгноо: ${newExam.date}\nЦаг: ${timeRange}\nХянагч: ${newExam.invigilator}`);
                  setShowAddExamModal(false);
                  setNewExam({ course: "", date: "", startTime: "", endTime: "", room: "", invigilator: "", type: "" });
                }}
                className="flex-1 rounded-lg border border-blue-400/40 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Нэмэх
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Detail Modal */}
      {showExamDetailModal && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0a1628] shadow-2xl">
            {/* Modal Header */}
            <div className="relative overflow-hidden rounded-t-2xl border-b border-white/10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-6 py-5">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white">{selectedExam.course}</h2>
                <p className="mt-1 text-sm text-white/70">Шалгалтын дэлгэрэнгүй мэдээлэл</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/50 mb-1">Хичээл</p>
                  <p className="text-lg font-semibold text-white">{selectedExam.course}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/50 mb-1">Төрөл</p>
                  <p className="text-lg font-semibold text-white">{selectedExam.type}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/50 mb-1">Огноо</p>
                  <p className="text-lg font-semibold text-white">{selectedExam.date}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/50 mb-1">Цаг</p>
                  <p className="text-lg font-semibold text-white">{selectedExam.time}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/50 mb-1">Хянагч</p>
                  <p className="text-lg font-semibold text-white">{selectedExam.invigilator}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/50 mb-1">Өрөө</p>
                  <p className="text-lg font-semibold text-white">{selectedExam.room}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-white/10 bg-[#0a1628] px-6 py-4 rounded-b-2xl">
              <button
                onClick={() => {
                  if (confirm(`${selectedExam.course} шалгалтыг устгах уу?`)) {
                    alert("Шалгалт устгагдлаа!");
                    setShowExamDetailModal(false);
                    setSelectedExam(null);
                  }
                }}
                className="rounded-lg border border-red-400/40 bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-red-500/20"
              >
                Устгах
              </button>
              <button
                onClick={() => {
                  const [startTime, endTime] = selectedExam.time.split('-');
                  setEditExam({
                    course: selectedExam.course,
                    date: selectedExam.date,
                    startTime: startTime,
                    endTime: endTime,
                    invigilator: selectedExam.invigilator,
                    type: selectedExam.type
                  });
                  setShowExamDetailModal(false);
                  setShowEditExamModal(true);
                }}
                className="flex-1 rounded-lg border border-blue-400/40 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Засах
              </button>
              <button
                onClick={() => {
                  setShowExamDetailModal(false);
                  setSelectedExam(null);
                }}
                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/20 hover:text-white transition-all"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {showEditExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-white/10 bg-[#0a1628] shadow-2xl">
            {/* Modal Header */}
            <div className="relative overflow-hidden rounded-t-2xl border-b border-white/10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-6 py-5">
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white">Шалгалт засах</h2>
                <p className="mt-1 text-sm text-white/70">Шалгалтын мэдээллийг шинэчлэх</p>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Course */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Хичээл <span className="text-red-400">*</span>
                </label>
                <select
                  value={editExam.course}
                  onChange={(e) => setEditExam({ ...editExam, course: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                >
                  <option value="" className="bg-[#0a1628]">Хичээл сонгох</option>
                  {availableCourses.map((course, index) => (
                    <option key={index} value={course} className="bg-[#0a1628]">{course}</option>
                  ))}
                </select>
              </div>

              {/* Exam Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Шалгалтын төрөл <span className="text-red-400">*</span>
                </label>
                <select
                  value={editExam.type}
                  onChange={(e) => setEditExam({ ...editExam, type: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                >
                  <option value="" className="bg-[#0a1628]">Төрөл сонгох</option>
                  <option value="Эцсийн шалгалт" className="bg-[#0a1628]">Эцсийн шалгалт</option>
                  <option value="Дунд шалгалт" className="bg-[#0a1628]">Дунд шалгалт</option>
                  <option value="Бие даасан ажил" className="bg-[#0a1628]">Бие даасан ажил</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Огноо <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={editExam.date}
                  onChange={(e) => setEditExam({ ...editExam, date: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>

              {/* Time */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Эхлэх цаг <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={editExam.startTime}
                    onChange={(e) => setEditExam({ ...editExam, startTime: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">
                    Дуусах цаг <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={editExam.endTime}
                    onChange={(e) => setEditExam({ ...editExam, endTime: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
              </div>

              {/* Invigilator */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Хянагч <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editExam.invigilator}
                  onChange={(e) => setEditExam({ ...editExam, invigilator: e.target.value })}
                  placeholder="Жишээ: Б.Ганбат"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 border-t border-white/10 bg-[#0a1628] px-6 py-4 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowEditExamModal(false);
                  setEditExam({ course: "", date: "", startTime: "", endTime: "", invigilator: "", type: "" });
                }}
                className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/20 hover:text-white transition-all"
              >
                Болих
              </button>
              <button
                onClick={() => {
                  if (!editExam.course || !editExam.date || !editExam.startTime || !editExam.endTime || !editExam.invigilator || !editExam.type) {
                    alert("Бүх талбарыг бөглөнө үү!");
                    return;
                  }
                  const timeRange = `${editExam.startTime}-${editExam.endTime}`;
                  alert(`Шалгалт шинэчлэгдлээ:\n\nХичээл: ${editExam.course}\nТөрөл: ${editExam.type}\nОгноо: ${editExam.date}\nЦаг: ${timeRange}\nХянагч: ${editExam.invigilator}`);
                  setShowEditExamModal(false);
                  setEditExam({ course: "", date: "", startTime: "", endTime: "", invigilator: "", type: "" });
                }}
                className="flex-1 rounded-lg border border-blue-400/40 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Хадгалах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}