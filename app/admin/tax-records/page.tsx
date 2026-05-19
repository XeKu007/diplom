"use client";

import { useState } from "react";
import Link from "next/link";

export default function TaxRecordsPage() {
  const [year, setYear] = useState("2024");
  const [taxType, setTaxType] = useState("Бүгд");

  const backLink = "/admin/finance-dashboard";

  const years = ["2024", "2023", "2022", "2021"];
  const taxTypes = ["Бүгд", "НДШ", "ХХОАТ"];

  const taxData = [
    { employee: "Б. Ганбат", type: "НДШ", amount: 450000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "Б. Ганбат", type: "ХХОАТ", amount: 675000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "Ц. Энхтуяа", type: "НДШ", amount: 380000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "Ц. Энхтуяа", type: "ХХОАТ", amount: 570000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "Д. Батцэцэг", type: "НДШ", amount: 420000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "Д. Батцэцэг", type: "ХХОАТ", amount: 630000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "Н. Болд", type: "НДШ", amount: 320000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "Н. Болд", type: "ХХОАТ", amount: 480000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-05", status: "Төлөгдсөн" },
    { employee: "О. Цэцэгмаа", type: "НДШ", amount: 310000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-08", status: "Төлөгдсөн" },
    { employee: "О. Цэцэгмаа", type: "ХХОАТ", amount: 465000, month: "1-р сар", dueDate: "2024-02-10", paidDate: "2024-02-08", status: "Төлөгдсөн" },
  ];

  const filteredData = taxType === "Бүгд" 
    ? taxData 
    : taxData.filter(item => item.type === taxType);

  const totalNDSH = taxData.filter(item => item.type === "НДШ").reduce((sum, item) => sum + item.amount, 0);
  const totalHHOAT = taxData.filter(item => item.type === "ХХОАТ").reduce((sum, item) => sum + item.amount, 0);
  const totalTax = totalNDSH + totalHHOAT;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0118] to-[#1a0b2e] p-6">
      <div className="mx-auto max-w-6xl">
        {/* Буцах холбоос */}
        <div className="mb-6">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Буцах
          </Link>
        </div>

        {/* Гарчиг */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">НДШ, ХХОАТ бүртгэл</h1>
          <p className="text-white/60">
            Нийгмийн даатгалын шимтгэл, хөдөлмөрийн хөлсний орлогын албан татварын бүртгэл
          </p>
        </div>

        {/* Шүүлтүүр */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Жил
            </label>
            <div className="flex flex-wrap gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    year === y
                      ? "bg-violet-600 text-white"
                      : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {y} он
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-white/70 mb-2">
              Татварын төрөл
            </label>
            <select
              value={taxType}
              onChange={(e) => setTaxType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30"
            >
              {taxTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Нийт статистик */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Нийт НДШ</h3>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalNDSH.toLocaleString()}</div>
              <div className="text-sm text-white/60">5 ажилтнаас</div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Нийт ХХОАТ</h3>
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalHHOAT.toLocaleString()}</div>
              <div className="text-sm text-white/60">5 ажилтнаас</div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Нийт татвар</h3>
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalTax.toLocaleString()}</div>
              <div className="text-sm text-white/60">Нийт дүн</div>
            </div>
          </div>
        </div>

        {/* Татварын бүртгэлийн хүснэгт */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Татварын бүртгэлийн жагсаалт</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                Татвар төлөх
              </button>
              <button className="px-4 py-2 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">
                Тайлан татах
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/70 font-medium">Ажилтан</th>
                  <th className="text-left p-4 text-white/70 font-medium">Татварын төрөл</th>
                  <th className="text-left p-4 text-white/70 font-medium">Хэмжээ</th>
                  <th className="text-left p-4 text-white/70 font-medium">Сар</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөх эцсийн хугацаа</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлсөн огноо</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөв</th>
                  <th className="text-left p-4 text-white/70 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((tax, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{tax.employee}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        tax.type === "НДШ" ? "bg-blue-500/20 text-blue-300" : "bg-rose-500/20 text-rose-300"
                      }`}>
                        {tax.type}
                      </span>
                    </td>
                    <td className={`p-4 ${tax.type === "НДШ" ? "text-blue-300" : "text-rose-300"}`}>
                      ₮ {tax.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-white/70">{tax.month}</td>
                    <td className="p-4 text-white/70">{tax.dueDate}</td>
                    <td className="p-4 text-white/70">{tax.paidDate}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        tax.status === "Төлөгдсөн" ? "bg-emerald-500/20 text-emerald-300" :
                        "bg-amber-500/20 text-amber-300"
                      }`}>
                        {tax.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="px-3 py-1.5 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">
                        Дэлгэрэнгүй
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Татварын тайлбар */}
        <div className="mt-8 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Татварын бүртгэлийн тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• НДШ: Нийгмийн даатгалын шимтгэл (цалингийн 10%)</li>
            <li>• ХХОАТ: Хөдөлмөрийн хөлсний орлогын албан татвар (цалингийн 15%)</li>
            <li>• Татварыг сарын 10-ны өдөр төлөх ёстой</li>
            <li>• Татварын төлбөрийг автоматаар тооцоолно</li>
            <li>• Татварын түүхийг 5 жил хадгална</li>
            <li>• Татварын тайланг сар бүр татаж авах боломжтой</li>
          </ul>
        </div>
      </div>
    </div>
  );
}