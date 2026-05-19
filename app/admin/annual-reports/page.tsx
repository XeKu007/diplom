"use client";

import { useState } from "react";
import Link from "next/link";

export default function AnnualReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2023");

  const backLink = "/admin/finance-dashboard";

  const years = ["2023", "2022", "2021", "2020", "2019"];

  const annualData = {
    income: 2700000000,
    expenses: 1764000000,
    profit: 936000000,
    students: 1350,
    newStudents: 450,
    graduates: 320,
    teachers: 24,
    courses: 45,
    research: 12,
  };

  const reportTypes = [
    { name: "Жилийн санхүүгийн тайлан", status: "Бэлэн", size: "12.5 MB", date: "2024-01-31" },
    { name: "Жилийн академик тайлан", status: "Бэлэн", size: "10.8 MB", date: "2024-01-31" },
    { name: "Жилийн хөгжлийн тайлан", status: "Бэлэн", size: "8.6 MB", date: "2024-01-31" },
    { name: "Жилийн судалгааны тайлан", status: "Бэлэн", size: "6.9 MB", date: "2024-01-31" },
    { name: "Жилийн стратегийн тайлан", status: "Бэлэн", size: "5.2 MB", date: "2024-01-31" },
    { name: "Жилийн чанарын тайлан", status: "Бэлэн", size: "4.8 MB", date: "2024-01-31" },
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
          <h1 className="text-3xl font-bold text-white mb-2">Жилийн тайлан</h1>
          <p className="text-white/60">Жилийн санхүүгийн, академик, стратегийн тайлан</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-white/70 mb-2">Жил</label>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <button key={year} onClick={() => setSelectedYear(year)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${selectedYear === year ? "bg-violet-600 text-white" : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"}`}>
                {year} он
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Орлого</h3><div className="p-2 bg-emerald-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {annualData.income.toLocaleString()}</div><div className="text-sm text-white/60">Жил</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Зардал</h3><div className="p-2 bg-rose-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {annualData.expenses.toLocaleString()}</div><div className="text-sm text-white/60">Жил</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Цэвэр ашиг</h3><div className="p-2 bg-violet-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {annualData.profit.toLocaleString()}</div><div className="text-sm text-white/60">Жил</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Төгсөгчид</h3><div className="p-2 bg-blue-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 6l-8 8-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">{annualData.graduates}</div><div className="text-sm text-white/60">Оюутан</div></div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden mb-8">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Жилийн тайлангийн жагсаалт</h3>
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
          <h4 className="text-lg font-semibold text-white mb-3">Жилийн тайлангийн тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Жилийн тайланг жилийн эцэст автоматаар үүсгэнэ</li>
            <li>• Тайлангууд: Санхүүгийн, Академик, Хөгжлийн, Судалгааны, Стратегийн, Чанарын</li>
            <li>• Тайлангуудыг PDF, Excel форматаар татаж авах боломжтой</li>
            <li>• Тайлангуудыг 15 жил хадгална</li>
            <li>• Тайлангуудыг удирдлагын зөвлөл, Төрийн байгууллагад танилцуулна</li>
          </ul>
        </div>
      </div>
    </div>
  );
}