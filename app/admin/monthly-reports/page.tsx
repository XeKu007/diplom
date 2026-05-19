"use client";

import { useState } from "react";
import Link from "next/link";

export default function MonthlyReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-03");

  const backLink = "/admin/finance-dashboard";

  const months = ["2024-03", "2024-02", "2024-01", "2023-12", "2023-11", "2023-10"];

  const monthlyData = {
    income: 225000000,
    expenses: 147000000,
    profit: 78000000,
    students: 1350,
    newStudents: 45,
    dropouts: 12,
    teachers: 24,
    newTeachers: 2,
  };

  const reportTypes = [
    { name: "Санхүүгийн тайлан", status: "Бэлэн", size: "2.4 MB", date: "2024-03-31" },
    { name: "Оюутны тайлан", status: "Бэлэн", size: "1.8 MB", date: "2024-03-31" },
    { name: "Багш нарын тайлан", status: "Бэлэн", size: "1.2 MB", date: "2024-03-31" },
    { name: "Зардлын тайлан", status: "Бэлэн", size: "3.1 MB", date: "2024-03-31" },
    { name: "Ирцийн тайлан", status: "Хийгдэж байгаа", size: "0.9 MB", date: "2024-04-02" },
    { name: "Дүнгийн тайлан", status: "Хийгдэж байгаа", size: "1.5 MB", date: "2024-04-02" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] to-[#1a0b2e] p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href={backLink} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Буцах
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Сар бүрийн тайлан</h1>
          <p className="text-white/60">Сар бүрийн санхүүгийн, оюутны, багш нарын тайлан</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-white/70 mb-2">Сар</label>
          <div className="flex flex-wrap gap-2">
            {months.map((month) => (
              <button key={month} onClick={() => setSelectedMonth(month)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${selectedMonth === month ? "bg-violet-600 text-white" : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"}`}>
                {month}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Орлого</h3><div className="p-2 bg-emerald-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {monthlyData.income.toLocaleString()}</div><div className="text-sm text-white/60">Энэ сар</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Зардал</h3><div className="p-2 bg-rose-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {monthlyData.expenses.toLocaleString()}</div><div className="text-sm text-white/60">Энэ сар</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Цэвэр ашиг</h3><div className="p-2 bg-violet-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {monthlyData.profit.toLocaleString()}</div><div className="text-sm text-white/60">Энэ сар</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Оюутан</h3><div className="p-2 bg-blue-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" /><path d="M15 16c0-2.5-2-4-5-4s-5 1.5-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">{monthlyData.students}</div><div className="text-sm text-white/60">+{monthlyData.newStudents} шинэ</div></div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Тайлангийн жагсаалт</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Тайлан үүсгэх</button>
              <button className="px-4 py-2 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">Бүгдийг татах</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/70 font-medium">Тайлангийн нэр</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөв</th>
                  <th className="text-left p-4 text-white/70 font-medium">Хэмжээ</th>
                  <th className="text-left p-4 text-white/70 font-medium">Үүсгэсэн огноо</th>
                  <th className="text-left p-4 text-white/70 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {reportTypes.map((report, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{report.name}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${report.status === "Бэлэн" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/70">{report.size}</td>
                    <td className="p-4 text-white/70">{report.date}</td>
                    <td className="p-4">
                      <button className="px-3 py-1.5 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">Татах</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Сар бүрийн тайлангийн тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Сар бүрийн тайланг сарын эцэст автоматаар үүсгэнэ</li>
            <li>• Тайлангууд: Санхүүгийн, Оюутны, Багш нарын, Зардлын, Ирцийн, Дүнгийн</li>
            <li>• Тайлангуудыг PDF, Excel форматаар татаж авах боломжтой</li>
            <li>• Тайлангуудыг 5 жил хадгална</li>
            <li>• Тайлангуудыг цахим гарын үсэгтэй гаргана</li>
          </ul>
        </div>
      </div>
    </div>
  );
}