"use client";

import Link from "next/link";

export default function UtilityBillsPage() {
  const backLink = "/admin/finance-dashboard";

  const utilityBillsData = [
    { type: "Цахилгаан", amount: 2500000, month: "1-р сар", dueDate: "2024-02-15", paidDate: "2024-02-10", status: "Төлөгдсөн", usage: "15,000 kWh" },
    { type: "Ус", amount: 800000, month: "1-р сар", dueDate: "2024-02-15", paidDate: "2024-02-10", status: "Төлөгдсөн", usage: "2,500 m³" },
    { type: "Дулаан", amount: 3500000, month: "1-р сар", dueDate: "2024-02-15", paidDate: "2024-02-12", status: "Төлөгдсөн", usage: "120 Gcal" },
    { type: "Цахилгаан", amount: 2400000, month: "2-р сар", dueDate: "2024-03-15", paidDate: "2024-03-10", status: "Төлөгдсөн", usage: "14,500 kWh" },
    { type: "Ус", amount: 750000, month: "2-р сар", dueDate: "2024-03-15", paidDate: "2024-03-10", status: "Төлөгдсөн", usage: "2,300 m³" },
    { type: "Дулаан", amount: 3200000, month: "2-р сар", dueDate: "2024-03-15", paidDate: "2024-03-12", status: "Төлөгдсөн", usage: "110 Gcal" },
    { type: "Цахилгаан", amount: 2300000, month: "3-р сар", dueDate: "2024-04-15", paidDate: null, status: "Хүлээгдэж буй", usage: "14,000 kWh" },
    { type: "Ус", amount: 700000, month: "3-р сар", dueDate: "2024-04-15", paidDate: null, status: "Хүлээгдэж буй", usage: "2,200 m³" },
    { type: "Дулаан", amount: 2800000, month: "3-р сар", dueDate: "2024-04-15", paidDate: null, status: "Хүлээгдэж буй", usage: "95 Gcal" },
  ];

  const totalMonthly = utilityBillsData
    .filter(item => item.month === "3-р сар")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPaid = utilityBillsData
    .filter(item => item.status === "Төлөгдсөн")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalPending = utilityBillsData
    .filter(item => item.status === "Хүлээгдэж буй")
    .reduce((sum, item) => sum + item.amount, 0);

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
          <h1 className="text-3xl font-bold text-white mb-2">Байрны зардал</h1>
          <p className="text-white/60">
            Цахилгаан, ус, дулааны зардлын мэдээлэл, удирдлага
          </p>
        </div>

        {/* Нийт статистик */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Энэ сарын зардал</h3>
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalMonthly.toLocaleString()}</div>
              <div className="text-sm text-white/60">3-р сар</div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Төлөгдсөн</h3>
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16 6l-8 8-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalPaid.toLocaleString()}</div>
              <div className="text-sm text-white/60">2 сараас</div>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Хүлээгдэж буй</h3>
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">₮ {totalPending.toLocaleString()}</div>
              <div className="text-sm text-white/60">3-р сар</div>
            </div>
          </div>
        </div>

        {/* Байрны зардлын хүснэгт */}
        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Байрны зардлын жагсаалт</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                Зардал нэмэх
              </button>
              <button className="px-4 py-2 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">
                Тайлан т��тах
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/70 font-medium">Зардлын төрөл</th>
                  <th className="text-left p-4 text-white/70 font-medium">Хэмжээ</th>
                  <th className="text-left p-4 text-white/70 font-medium">Сар</th>
                  <th className="text-left p-4 text-white/70 font-medium">Хэрэглээ</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөх эцсийн хугацаа</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлсөн огноо</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөв</th>
                  <th className="text-left p-4 text-white/70 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {utilityBillsData.map((bill, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{bill.type}</td>
                    <td className="p-4 text-rose-300">₮ {bill.amount.toLocaleString()}</td>
                    <td className="p-4 text-white/70">{bill.month}</td>
                    <td className="p-4 text-white/70">{bill.usage}</td>
                    <td className="p-4 text-white/70">{bill.dueDate}</td>
                    <td className="p-4 text-white/70">{bill.paidDate || "-"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        bill.status === "Төлөгдсөн" ? "bg-emerald-500/20 text-emerald-300" :
                        "bg-amber-500/20 text-amber-300"
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="px-3 py-1.5 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">
                        Төлбөр төлөх
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Тайлбар */}
        <div className="mt-8 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Байрны зардлын тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Байрны зардлыг сар бүр шинэчлэн гаргана</li>
            <li>• Төлбөрийн эцсийн хугацаа: сарын 15</li>
            <li>• Хэрэглээний хэмжээг тоолуураар бүртгэнэ</li>
            <li>• Зардлын төрлүүд: Цахилгаан, Ус, Дулаан, Хог хаягдал, Цэвэрлэгээ</li>
            <li>• Төлбөрийг автоматаар тооцоолно</li>
            <li>• Зардлын түүхийг 3 жил хадгална</li>
          </ul>
        </div>
      </div>
    </div>
  );
}