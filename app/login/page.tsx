"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const roles = [
  { key: "student", label: "Оюутан", icon: "🎓", color: "from-violet-500/20 to-violet-600/10", border: "border-violet-500/20", text: "text-violet-300" },
  { key: "teacher", label: "Багш", icon: "🧑‍🏫", color: "from-blue-500/20 to-blue-600/10", border: "border-blue-500/20", text: "text-blue-300" },
  { key: "parent", label: "Эцэг/эх", icon: "👨‍👩‍👧", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-500/20", text: "text-yellow-300" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !pass) {
      setError("ID болон нууц үгээ оруулна уу.");
      return;
    }

    // ID формат шалгах
    if ((role === "student" || role === "parent") && !/^B\d{9}$/.test(id)) {
      setError("Оюутны ID буруу форматтай. Жишээ: B211930019");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pass, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Нэвтрэх үед алдаа гарлаа.");
        return;
      }

      router.replace(data.redirect);
    } catch {
      setError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!id) {
      setError("Нууц үг сэргээхийн тулд ID-ээ оруулна уу.");
      return;
    }
    
    setLoading(true);
    
    // Frontend simulation хийх
    setTimeout(() => {
      setLoading(false);
      alert(`${id} ID-тэй хэрэглэгчид нууц үг сэргээх линк имэйл хаяг руу илгээгдлээ.`);
    }, 600);
  };

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#06030f] text-white font-sans">
      {/* Background with indra-building.jpg */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(8, 14, 30, 0.85), rgba(8, 12, 24, 0.9)), url('/indra-building.jpg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-8">
        <div className="max-w-md w-full">
          {/* Login Form Card */}
          <div className="rounded-3xl border border-white/10 bg-[#081120]/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md sm:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-xs">
                  ✦
                </div>
                <span className="text-xs text-violet-400 font-semibold">
                  Системд нэвтрэх
                </span>
              </div>

              <h1 className="font-['Syne'] text-3xl font-extrabold leading-tight mb-2">
                Нэвтрэх
              </h1>
              <p className="text-sm text-white/50">
                Indra Cyber LMS системд тавтай морил
              </p>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <p className="text-xs text-white/40 font-medium mb-3">
                Эрхийн төрөл сонгох
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    className={`flex min-h-[82px] flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all duration-200 ${
                      role === r.key 
                        ? `${r.border} ${r.color} opacity-100` 
                        : "border-white/10 bg-white/[0.02] opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{r.icon}</span>
                    <span className={`text-xs font-semibold ${
                      role === r.key ? r.text : "text-white/60"
                    }`}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* ID Input */}
              <div>
                <label className="block text-xs text-white/40 font-medium mb-2">
                  {role === "student" || role === "parent" ? "Оюутны ID" : "Хэрэглэгчийн ID"}
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder={role === "student" || role === "parent" ? "B211930019" : "Хэрэглэгчийн ID"}
                  className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] text-white text-sm outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-white/[0.06]"
                />
                {(role === "student" || role === "parent") && id && !/^B\d{9}$/.test(id) && (
                  <p className="text-xs text-yellow-400 mt-2">
                    Оюутны ID формат: B + 9 оронтой тоо (жишээ: B211930019)
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-white/40 font-medium">
                    Нууц үг
                  </label>
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors duration-200 disabled:opacity-50"
                  >
                    Нууц үг мартсан?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="Нууц үгээ оруулна уу"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-white/10 bg-white/[0.04] text-white text-sm outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-white/[0.06]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors duration-200"
                  >
                    {showPass ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`p-4 rounded-xl border ${
                  error.includes("хөгжүүлэгдэж байна") 
                    ? "border-yellow-500/30 bg-yellow-500/10" 
                    : "border-red-500/30 bg-red-500/10"
                } flex items-center gap-3`}>
                  <span className="text-lg">
                    {error.includes("хөгжүүлэгдэж байна") ? "⚠️" : "❌"}
                  </span>
                  <span className={`text-sm ${
                    error.includes("хөгжүүлэгдэж байна") ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {error}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-800 text-white text-sm font-bold hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_8px_32px_rgba(124,58,237,0.35)] hover:shadow-[0_12px_40px_rgba(124,58,237,0.5)] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Нэвтэрч байна...
                  </>
                ) : (
                  <>
                    Нэвтрэх
                    <span className="text-lg">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Back to Landing */}
            <button
              onClick={() => router.push("/")}
              className="w-full mt-6 py-3 rounded-xl border border-white/10 bg-white/[0.04] text-white/60 text-sm font-semibold hover:text-white hover:bg-white/[0.08] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-lg">←</span>
              Нүүр хуудас руу буцах
            </button>

            {/* Help Info */}
            <div className="mt-8 pt-6 border-t border-white/[0.07]">
              <p className="text-xs text-white/40 font-medium mb-3">
                Туршилтын мэдээлэл
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/30 mb-1">Оюутан ID</p>
                  <p className="text-sm font-semibold text-violet-300">B211930019</p>
                  <p className="text-xs text-white/20 mt-0.5">student123</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/30 mb-1">Багш ID</p>
                  <p className="text-sm font-semibold text-blue-300">T001</p>
                  <p className="text-xs text-white/20 mt-0.5">teacher123</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/30 mb-1">Эцэг/эх ID</p>
                  <p className="text-sm font-semibold text-yellow-300">B211930019</p>
                  <p className="text-xs text-white/20 mt-0.5">parent123</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-xs text-white/30 mb-1">Оюутан 2</p>
                  <p className="text-sm font-semibold text-violet-300">B211930020</p>
                  <p className="text-xs text-white/20 mt-0.5">student123</p>
                </div>
              </div>
              
              {/* Admin Login Button */}
              <button
                type="button"
                onClick={() => router.push("/admin/login")}
                className="w-full mt-4 text-xs text-white/20 hover:text-purple-400/60 text-center transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span className="text-sm">👑</span>
                <span>Админы эрхээр нэвтрэх</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#0a0118]/80 px-4 py-8 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center font-['Syne'] text-xs font-extrabold">
              IC
            </div>
            <span className="text-xs text-white/35">
              © 2007–2026 Indra Cyber Institute · Улаанбаатар
            </span>
          </div>
          <div className="flex gap-6">
            {[
              ["indracyberinstitute.com", "https://www.indracyberinstitute.com"],
              ["amjilt.com", "https://amjilt.com"]
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 hover:text-white/50 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
