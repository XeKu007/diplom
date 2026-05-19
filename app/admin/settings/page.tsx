"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("Тохиргоо");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const sections = [
    {
      title: "Хэрэглэгчийн удирдлага",
      icon: "👥",
      items: [
        { label: "Admin хэрэглэгчид",    desc: "Admin нэмэх, засах, устгах",    href: "/admin/role-management",  icon: "🔐" },
        { label: "Оюутны жагсаалт",      desc: "Оюутан нэмэх, засах, устгах",   href: "/admin/students",         icon: "👨‍🎓" },
        { label: "Багшийн жагсаалт",     desc: "Багш нэмэх, засах, устгах",     href: "/admin/teachers",         icon: "🧑‍🏫" },
      ],
    },
    {
      title: "Сургалтын тохиргоо",
      icon: "📚",
      items: [
        { label: "Хичээлүүд",            desc: "Хичээл нэмэх, засах, устгах",   href: "/admin/classes",          icon: "📖" },
        { label: "Хичээлийн хуваарь",    desc: "Хуваарь тохируулах",            href: "/admin/timetable",        icon: "📅" },
        { label: "Ирцийн бүртгэл",       desc: "Ирц удирдах",                   href: "/admin/attendance",       icon: "📋" },
        { label: "Дүнгийн бүртгэл",      desc: "Дүн удирдах",                   href: "/admin/grades",           icon: "📊" },
      ],
    },
    {
      title: "Санхүүгийн тохиргоо",
      icon: "💰",
      items: [
        { label: "Төлбөрийн бүртгэл",    desc: "Төлбөр удирдах",                href: "/admin/finance",          icon: "💳" },
        { label: "Цалингийн бүртгэл",    desc: "Цалин удирдах",                 href: "/admin/staff-salaries",   icon: "💵" },
      ],
    },
    {
      title: "Системийн тохиргоо",
      icon: "⚙️",
      items: [
        { label: "Миний профайл",         desc: "Нэр, нууц үг солих",            href: "/admin/profile",          icon: "👤" },
        { label: "Аналитик самбар",       desc: "Системийн статистик",           href: "/admin/analytics-dashboard", icon: "📈" },
      ],
    },
  ];

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-4xl space-y-6">

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Систем</p>
              <h1 className="mt-1 text-2xl font-semibold">Тохиргоо</h1>
              <p className="mt-1 text-sm text-white/50">Системийн бүх тохиргоог энд удирдана</p>
            </div>

            {success && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">✅ {success}</div>
            )}

            {sections.map((section) => (
              <div key={section.title} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{section.icon}</span>
                  <h2 className="text-sm font-semibold text-white/80">{section.title}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href}
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                      <span className="text-2xl shrink-0">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
                      </div>
                      <span className="ml-auto text-white/30 shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
