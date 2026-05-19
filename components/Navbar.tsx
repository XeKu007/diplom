"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AIChatbot from "./AIChatbot";



export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [parentStudentId, setParentStudentId] = useState("B211930019");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Determine user role based on pathname
  const isTeacherPage = pathname.startsWith("/teacher");
  const isParentPage = pathname.startsWith("/parent");
  const isAdminPage = pathname.startsWith("/admin");
  const isStudentPage = !isTeacherPage && !isParentPage && !isAdminPage;



  useEffect(() => {
    if (typeof window !== "undefined" && isParentPage) {
      const savedStudentId = localStorage.getItem("parentStudentId");
      if (savedStudentId) {
        setParentStudentId(savedStudentId);
      }
    }
  }, [isParentPage]);



  // User data based on role
  const userData = {
    student: {
      name: "Төртэмүүлэн",
      id: "B211930019",
      role: "Оюутан",
      avatar: "Т",
      profileLink: "/student/profile",
      notificationsLink: "/student/notifications"
    },
    teacher: {
      name: "Батбаяр багш",
      id: "T001",
      role: "Багш",
      avatar: "Б",
      profileLink: "/teacher/profile",
      notificationsLink: "/teacher/notifications"
    },
    parent: {
      name: parentStudentId === "B211930020" ? "Мөнхбат" : "Төртэмүүлэн",
      id: parentStudentId,
      role: "Оюутан",
      avatar: parentStudentId === "B211930020" ? "М" : "Т",
      profileLink: "/parent",
      notificationsLink: "/parent"
    },
    admin: {
      name: "Системийн админ",
      id: "admin",
      role: "Админ",
      avatar: "A",
      profileLink: "/admin/profile",
      notificationsLink: "/admin/dashboard"
    }
  };

  // Select user data based on current role
  const currentUser = isTeacherPage ? userData.teacher : 
                     isParentPage ? userData.parent : 
                     isAdminPage ? userData.admin :
                     userData.student;

  // Nav links based on role
  const getNavLinks = () => {
    if (isTeacherPage) {
      return [
        { label: "Миний хичээлүүд", href: "/teacher/courses" },
      ];
    } else if (isParentPage) {
      return [
        { label: "Оюутны мэдээлэл", href: "/parent" },
      ];
    } else if (pathname.startsWith("/admin")) {
      return [];
    } else {
      return [];
    }
  };

  const navLinks = getNavLinks();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      

    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-white/[0.07] bg-[#0a0118]/90 px-5 backdrop-blur-md">
      <Link href={currentUser.profileLink} className="flex shrink-0 items-center gap-3">
        <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-violet-400/35">
          <img
            src="/navbar-logo.jpg"
            alt="Indra Cyber"
            className="h-full w-full object-cover"
            onError={(event) => {
              const target = event.currentTarget as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.style.background =
                "linear-gradient(135deg, #d946ef, #f50303)";
              target.parentElement!.innerHTML =
                '<span style="font-size:11px;font-weight:600;color:white;display:flex;align-items:center;justify-content:center;height:100%">IC</span>';
            }}
          />
        </div>
        <div>
          <p className="text-[15px] font-semibold leading-none text-white">Indra Cyber</p>
          <p className="mt-1 text-xs leading-none text-white/40">Institute</p>
        </div>
      </Link>

      <div className="mx-1 h-5 w-px bg-white/10" />

      <nav className="scrollbar-none flex flex-1 items-center gap-1 overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || 
                          (link.href === "/teacher/home" && pathname.startsWith("/teacher")) ||
                          (link.href === "/parent" && pathname.startsWith("/parent")) ||
                          (link.href === "/home" && pathname === "/home");
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs transition-all ${
                isActive
                  ? "border-violet-400/25 bg-violet-600/15 text-violet-200"
                  : "border-transparent text-white/50 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>



      <div className="flex shrink-0 items-center gap-2">
        {/* Avatar + dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className={`h-8 w-8 overflow-hidden rounded-lg border transition-all ${
              open ? "border-violet-400/50" : "border-white/10 hover:border-violet-400/35"
            }`}
          >
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-800 to-violet-800 text-xs font-semibold text-white">
              {currentUser.avatar}
            </div>
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 top-[calc(100%+8px)] w-52 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1628]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-200 ${
              open
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            {/* User info */}
            <div className="border-b border-white/[0.07] px-4 py-3">
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="mt-0.5 text-[11px] text-white/35">{currentUser.id} · {currentUser.role}</p>
            </div>

            {/* Menu items */}
            <div className="p-1.5">
              <button
                onClick={() => { setOpen(false); router.push(currentUser.profileLink); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition-all hover:bg-white/[0.06] hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0 text-white/35">
                  <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M2 13c0-3 2.5-4.5 5.5-4.5S13 10 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Хувийн мэдээлэл
              </button>

              <button
                onClick={() => { 
                  setOpen(false); 
                  setShowPasswordModal(true);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/65 transition-all hover:bg-white/[0.06] hover:text-white"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0 text-white/35">
                  <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5 6.5V5a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="7.5" cy="10" r="1" fill="currentColor" />
                </svg>
                Нууц үг солих
              </button>

              {/* Divider */}
              <div className="my-1 h-px bg-white/[0.06]" />

              <button
                onClick={async () => { 
                  setOpen(false);
                  await fetch("/api/auth/logout", { method: "POST" });
                  router.replace("/login");
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400/80 transition-all hover:bg-red-500/10 hover:text-red-300"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0">
                  <path d="M5.5 7.5H13M10.5 5l2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 3H3a1 1 0 00-1 1v7a1 1 0 001 1h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Password Change Modal */}
    {showPasswordModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] shadow-2xl">
          {/* Modal Header */}
          <div className="relative overflow-hidden rounded-t-2xl border-b border-white/10 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 px-6 py-5">
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-white">Нууц үг солих</h2>
              <p className="mt-1 text-sm text-white/70">Шинэ нууц үгээ оруулна уу</p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Одоогийн нууц үг <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Одоогийн нууц үгээ оруулна уу"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Шинэ нууц үг <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Шинэ нууц үгээ оруулна уу"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              <p className="mt-2 text-xs text-white/50">
                💡 Нууц үг дор хаяж 8 тэмдэгт, том жижиг үсэг, тоо агуулсан байх ёстой
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Нууц үг баталгаажуулах <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Шинэ нууц үгээ дахин оруулна уу"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
              />
              {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="mt-2 text-xs text-red-400">
                  ⚠️ Нууц үг таарахгүй байна
                </p>
              )}
              {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                <p className="mt-2 text-xs text-emerald-400">
                  ✅ Нууц үг таарч байна
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 border-t border-white/10 bg-[#0a1628] px-6 py-4 rounded-b-2xl">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              Болих
            </button>
            <button
              onClick={() => {
                if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
                  alert("Бүх талбарыг бөглөнө үү!");
                  return;
                }
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                  alert("Шинэ нууц үг таарахгүй байна!");
                  return;
                }
                if (passwordData.newPassword.length < 8) {
                  alert("Нууц үг дор хаяж 8 тэмдэгт байх ёстой!");
                  return;
                }
                alert("Нууц үг амжилттай солигдлоо! Функц удахгүй нэмэгдэнэ.");
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
              className="flex-1 rounded-lg border border-blue-400/40 bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Солих
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
