"use client";

import Link from "next/link";

export default function MaintenanceCostsPage() {
  const backLink = "/admin/finance-dashboard";

  const maintenanceData = [
    { item: "Компьютер засвар", amount: 500000, date: "2024-03-01", vendor: "TechFix Co.", status: "Дууссан", type: "Тоног төхөөрөмж" },
    { item: "Кондиционер засвар", amount: 1200000, date: "2024-02-15", vendor: "AirCool Co.", status: "Дууссан", type: "Дулаан хангамж" },
    { item: "Цахилгаан шугам засвар", amount: 800000, date: "2024-02-10", vendor: "PowerLine Co.", status: "Дууссан", type: "Цахилгаан" },
    { item: "Ханын будлага", amount: 1500000, date: "2024-03-05", vendor: "PaintMaster Co.", status: "Хийгдэж байгаа", type: "Барилга" },
    { item: "Шалны засвар", amount: 2000000, date: "2024-03-10", vendor: "FloorExpert Co.", status: "Төлөвлөгдсөн", type: "Барилга" },
    { item: "Лифт засвар", amount: 3000000, date: "2024-03-15", vendor: "ElevatorPro Co.", status: "Төлөвлөгдсөн", type: "Тээвэр" },
  ];

  const totalCost = maintenanceData.reduce((sum, item) => sum + item.amount, 0);
  const completedCost = maintenanceData.filter(item => item.status === "Дууссан").reduce((sum, item) => sum + item.amount, 0);
  const plannedCost = maintenanceData.filter(item => item.status === "Төлөвлөгдсөн").reduce((sum, item) => sum + item.amount, 0);

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
          <h1 className="text-3xl font-bold text-white mb-2">Засвар үйлчилгээ</h1>
          <p className="text-white/60">Засвар үйлчилгээний зардлын мэдээлэл, удирдлага</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Нийт зардал</h3><div className="p-2 bg-rose-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {totalCost.toLocaleString()}</div><div className="text-sm text-white/60">6 засвараас</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Дууссан</h3><div className="p-2 bg-emerald-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 6l-8 8-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {completedCost.toLocaleString()}</div><div className="text-sm text-white/60">3 засвар</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Төлөвлөгдсөн</h3><div className="p-2 bg-amber-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {plannedCost.toLocaleString()}</div><div className="text-sm text-white/60">3 засвар</div></div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Засварын зардлын жагсаалт</h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Засвар нэмэх</button>
              <button className="px-4 py-2 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">Тайлан татах</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/70 font-medium">Засварын нэр</th>
                  <th className="text-left p-4 text-white/70 font-medium">Хэмжээ</th>
                  <th className="text-left p-4 text-white/70 font-medium">Огноо</th>
                  <th className="text-left p-4 text-white/70 font-medium">Гүйцэтгэгч</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төрөл</th>
                  <th className="text-left p-4 text-white/70 font-medium">Төлөв</th>
                  <th className="text-left p-4 text-white/70 font-medium">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceData.map((item, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 text-white">{item.item}</td>
                    <td className="p-4 text-rose-300">₮ {item.amount.toLocaleString()}</td>
                    <td className="p-4 text-white/70">{item.date}</td>
                    <td className="p-4 text-white/70">{item.vendor}</td>
                    <td className="p-4 text-white/70">{item.type}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        item.status === "Дууссан" ? "bg-emerald-500/20 text-emerald-300" :
                        item.status === "Хийгдэж байгаа" ? "bg-amber-500/20 text-amber-300" :
                        "bg-blue-500/20 text-blue-300"
                      }`}>{item.status}</span>
                    </td>
                    <td className="p-4">
                      <button className="px-3 py-1.5 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors">Дэлгэрэнгүй</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Засварын зардлын тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Засварын зардлыг сар бүр шинэчлэн гаргана</li>
            <li>• Засварын төрлүүд: Тоног төхөөрөмж, Барилга, Цахилгаан, Дулаан хангамж, Тээвэр</li>
            <li>• Гүйцэтгэгч компаниудын мэдээллийг бүртгэнэ</li>
            <li>• Засварын түүхийг 3 жил хадгална</li>
            <li>• Төлбөрийг засвар дууссаны дараа хийнэ</li>
          </ul>
        </div>
      </div>
    </div>
  );
}