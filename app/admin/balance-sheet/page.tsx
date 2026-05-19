"use client";

import { useState } from "react";
import Link from "next/link";

export default function BalanceSheetPage() {
  const [year, setYear] = useState("2023");

  const backLink = "/admin/finance-dashboard";

  const years = ["2023", "2022", "2021", "2020", "2019"];

  const assets = [
    { name: "Бэлэн мөнгө", amount: 125000000 },
    { name: "Банкны данс", amount: 450000000 },
    { name: "Авлагын үлдэгдэл", amount: 85000000 },
    { name: "Нөөц материал", amount: 35000000 },
    { name: "Үндсэн хөрөнгө", amount: 1200000000 },
    { name: "Нийт хөрөнгө", amount: 1890000000 },
  ];

  const liabilities = [
    { name: "Өр төлбөр", amount: 65000000 },
    { name: "Банкны зээл", amount: 300000000 },
    { name: "Цалингийн өр", amount: 24580000 },
    { name: "Татварын өр", amount: 18500000 },
    { name: "Нийт өр төлбөр", amount: 408080000 },
  ];

  const equity = [
    { name: "Хувьцааны капитал", amount: 800000000 },
    { name: "Нөөц капитал", amount: 120000000 },
    { name: "Хуримтлагдсан ашиг", amount: 561920000 },
    { name: "Нийт өмчлөгчийн эрх", amount: 1481920000 },
  ];

  const totalAssets = assets[assets.length - 1].amount;
  const totalLiabilities = liabilities[liabilities.length - 1].amount;
  const totalEquity = equity[equity.length - 1].amount;

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
          <h1 className="text-3xl font-bold text-white mb-2">Балансын тайлан</h1>
          <p className="text-white/60">Хөрөнгө, өр төлбөр, өмчлөгчийн эрхийн балансын тайлан</p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-white/70 mb-2">Жил</label>
          <div className="flex flex-wrap gap-2">
            {years.map((y) => (
              <button key={y} onClick={() => setYear(y)} className={`px-4 py-2 text-sm rounded-lg transition-colors ${year === y ? "bg-violet-600 text-white" : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"}`}>
                {y} он
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Нийт хөрөнгө</h3><div className="p-2 bg-emerald-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {totalAssets.toLocaleString()}</div><div className="text-sm text-white/60">Нийт хөрөнгө</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Нийт өр төлбөр</h3><div className="p-2 bg-rose-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {totalLiabilities.toLocaleString()}</div><div className="text-sm text-white/60">Нийт өр төлбөр</div></div>
          </div>
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-white">Нийт өмчлөгчийн эрх</h3><div className="p-2 bg-blue-500/20 rounded-lg"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1v18M1 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div></div>
            <div className="space-y-2"><div className="text-2xl font-bold text-white">₮ {totalEquity.toLocaleString()}</div><div className="text-sm text-white/60">Нийт өмчлөгчийн эрх</div></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-semibold text-white mb-6">Хөрөнгө</h3>
            <div className="space-y-4">
              {assets.map((asset, index) => (
                <div key={index} className={`flex items-center justify-between p-3 ${index === assets.length - 1 ? "bg-white/[0.02] border-t border-white/10" : "bg-white/[0.02]"}`}>
                  <div className={`${index === assets.length - 1 ? "text-white font-semibold" : "text-white/80"}`}>{asset.name}</div>
                  <div className={`${index === assets.length - 1 ? "text-white font-bold" : "text-white"}`}>₮ {asset.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-xl font-semibold text-white mb-6">Өр төлбөр ба өмчлөгчийн эрх</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-4">Өр төлбөр</h4>
                <div className="space-y-3">
                  {liabilities.map((liability, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 ${index === liabilities.length - 1 ? "bg-white/[0.02] border-t border-white/10" : "bg-white/[0.02]"}`}>
                      <div className={`${index === liabilities.length - 1 ? "text-white font-semibold" : "text-white/80"}`}>{liability.name}</div>
                      <div className={`${index === liabilities.length - 1 ? "text-white font-bold" : "text-white"}`}>₮ {liability.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-4">Өмчлөгчийн эрх</h4>
                <div className="space-y-3">
                  {equity.map((eq, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 ${index === equity.length - 1 ? "bg-white/[0.02] border-t border-white/10" : "bg-white/[0.02]"}`}>
                      <div className={`${index === equity.length - 1 ? "text-white font-semibold" : "text-white/80"}`}>{eq.name}</div>
                      <div className={`${index === equity.length - 1 ? "text-white font-bold" : "text-white"}`}>₮ {eq.amount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-3">Балансын тайлангийн тайлбар</h4>
          <ul className="space-y-2 text-white/60 text-sm">
            <li>• Балансын тайланг жилийн эцэст гаргана</li>
            <li>• Хөрөнгө = Өр төлбөр + Өмчлөгчийн эрх</li>
            <li>• Хөрөнгө: Бэлэн мөнгө, Банкны данс, Авлага, Нөөц материал, Үндсэн хөрөнгө</li>
            <li>• Өр төлбөр: Өр, Банкны зээл, Цалингийн өр, Татварын өр</li>
            <li>• Өмчлөгчийн эрх: Хувьцааны капитал, Нөөц капитал, Хуримтлагдсан ашиг</li>
            <li>• Тайланг PDF, Excel форматаар татаж авах боломжтой</li>
          </ul>
        </div>
      </div>
    </div>
  );
}