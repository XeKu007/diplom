"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function SystemMonitoring() {
  const [activeMenu, setActiveMenu] = useState("Системийн мониторинг");
  const [cpuUsage, setCpuUsage] = useState(42);
  const [memoryUsage, setMemoryUsage] = useState(68);
  const [diskUsage, setDiskUsage] = useState(24);
  const [networkUsage, setNetworkUsage] = useState(12);
  
  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCpuUsage(prev => {
        const change = Math.random() * 10 - 5;
        const newValue = prev + change;
        return Math.max(10, Math.min(90, newValue));
      });
      setMemoryUsage(prev => {
        const change = Math.random() * 8 - 4;
        const newValue = prev + change;
        return Math.max(20, Math.min(85, newValue));
      });
      setNetworkUsage(prev => {
        const change = Math.random() * 15 - 7.5;
        const newValue = prev + change;
        return Math.max(5, Math.min(40, newValue));
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const servers = [
    {
      id: 1,
      name: "Үндсэн сервер",
      type: "Database",
      status: "online",
      cpu: cpuUsage,
      memory: memoryUsage,
      disk: diskUsage,
      network: networkUsage,
      uptime: "45 хоног 12 цаг",
      ip: "192.168.1.10",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 2,
      name: "Веб сервер",
      type: "Application",
      status: "online",
      cpu: 28,
      memory: 45,
      disk: 18,
      network: 8,
      uptime: "32 хоног 8 цаг",
      ip: "192.168.1.11",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: 3,
      name: "Файл сервер",
      type: "Storage",
      status: "online",
      cpu: 15,
      memory: 32,
      disk: 65,
      network: 5,
      uptime: "60 хоног 3 цаг",
      ip: "192.168.1.12",
      color: "from-amber-500 to-orange-600"
    },
    {
      id: 4,
      name: "Резерв сервер",
      type: "Backup",
      status: "standby",
      cpu: 5,
      memory: 12,
      disk: 42,
      network: 2,
      uptime: "90 хоног 20 цаг",
      ip: "192.168.1.13",
      color: "from-purple-500 to-pink-600"
    },
    {
      id: 5,
      name: "Мониторинг сервер",
      type: "Monitoring",
      status: "online",
      cpu: 18,
      memory: 28,
      disk: 22,
      network: 3,
      uptime: "28 хоног 15 цаг",
      ip: "192.168.1.14",
      color: "from-indigo-500 to-blue-600"
    },
    {
      id: 6,
      name: "Тест сервер",
      type: "Development",
      status: "offline",
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
      uptime: "0 хоног 0 цаг",
      ip: "192.168.1.15",
      color: "from-gray-500 to-gray-600"
    },
  ];

  const alerts = [
    {
      id: 1,
      title: "CPU ачаалал өндөр",
      description: "Үндсэн сервер дээр CPU ачаалал 80%-с давсан",
      severity: "high",
      time: "5 минутын өмнө",
      server: "Үндсэн сервер"
    },
    {
      id: 2,
      title: "Санах ой дутагдаж байна",
      description: "Веб сервер дээр санах ой 85%-с давсан",
      severity: "medium",
      time: "15 минутын өмнө",
      server: "Веб сервер"
    },
    {
      id: 3,
      title: "Сүлжээний хурд буурсан",
      description: "Сүлжээний хурд 50% буурсан",
      severity: "low",
      time: "30 минутын өмнө",
      server: "Үндсэн сервер"
    },
    {
      id: 4,
      title: "Сервер унтарсан",
      description: "Тест сервер унтарсан",
      severity: "high",
      time: "2 цагийн өмнө",
      server: "Тест сервер"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-emerald-500/10 text-emerald-400";
      case "standby": return "bg-amber-500/10 text-amber-400";
      case "offline": return "bg-red-500/10 text-red-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/10 text-red-400";
      case "medium": return "bg-amber-500/10 text-amber-400";
      case "low": return "bg-blue-500/10 text-blue-400";
      default: return "bg-gray-500/10 text-gray-400";
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "bg-red-500";
    if (usage >= 60) return "bg-amber-500";
    return "bg-emerald-500";
  };

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
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Системийн мониторинг</h1>
                <p className="mt-1 text-sm text-white/50">Сервер, сүлжээ, нөөцийн бодит цагийн мониторинг</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2">
                  <p className="text-sm font-medium text-white">Бүрэн эрхт админ</p>
                  <p className="text-xs text-white/40">Системийн мониторинг</p>
                </div>
                <Link href="/admin/dashboard" className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/70 hover:text-white">
                  Буцах
                </Link>
              </div>
            </div>

            {/* Real-time Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "CPU ашиглалт", value: `${cpuUsage.toFixed(1)}%`, icon: "⚡", color: getUsageColor(cpuUsage) },
                { label: "Санах ой ашиглалт", value: `${memoryUsage.toFixed(1)}%`, icon: "💾", color: getUsageColor(memoryUsage) },
                { label: "Диск ашиглалт", value: `${diskUsage}%`, icon: "💿", color: getUsageColor(diskUsage) },
                { label: "Сүлжээний ашиглалт", value: `${networkUsage.toFixed(1)}%`, icon: "🌐", color: getUsageColor(networkUsage) },
              ].map((stat, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} rounded-full`}
                      style={{ width: stat.value }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Servers */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Серверүүд</h2>
                <p className="text-sm text-white/50">{servers.filter(s => s.status === "online").length} / {servers.length} идэвхтэй</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {servers.map(server => (
                  <div key={server.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${server.color} flex items-center justify-center`}>
                          <span className="text-lg">🖥️</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{server.name}</h3>
                          <p className="text-sm text-white/50">{server.type}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(server.status)}`}>
                        {server.status === "online" ? "Идэвхтэй" : 
                         server.status === "standby" ? "Бэлэн" : "Идэвхгүй"}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white/50">CPU</span>
                          <span className="text-sm text-white">{server.cpu}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className={`h-full ${getUsageColor(server.cpu)} rounded-full`}
                            style={{ width: `${server.cpu}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white/50">Санах ой</span>
                          <span className="text-sm text-white">{server.memory}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className={`h-full ${getUsageColor(server.memory)} rounded-full`}
                            style={{ width: `${server.memory}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white/50">Диск</span>
                          <span className="text-sm text-white">{server.disk}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className={`h-full ${getUsageColor(server.disk)} rounded-full`}
                            style={{ width: `${server.disk}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-white/50">IP хаяг</p>
                          <p className="text-white">{server.ip}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/50">Ажиллах хугацаа</p>
                          <p className="text-white">{server.uptime}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Дэлгэрэнгүй
                      </button>
                      <button className="flex-1 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs text-white/70 hover:text-white">
                        Удирдах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Анхааруулга</h2>
                <p className="text-sm text-white/50">{alerts.length} шинэ анхааруулга</p>
              </div>
              
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-white">{alert.title}</h3>
                        <p className="text-sm text-white/50 mt-1">{alert.description}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === "high" ? "Дээд" : 
                         alert.severity === "medium" ? "Дунд" : "Доод"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="text-white/50">{alert.time}</span>
                        <span className="text-white">•</span>
                        <span className="text-white">{alert.server}</span>
                      </div>
                      <button className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/70 hover:text-white">
                        Шийдвэрлэх
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Health */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Системийн эрүүл мэндийн үзүүлэлт</h2>
                <div className="space-y-4">
                  {[
                    { component: "Өгөгдлийн сан", health: 95, status: "сайн", color: "bg-emerald-500" },
                    { component: "Веб сервис", health: 88, status: "сайн", color: "bg-emerald-500" },
                    { component: "Файл систем", health: 92, status: "сайн", color: "bg-emerald-500" },
                    { component: "Сүлжээний холболт", health: 78, status: "дунд", color: "bg-amber-500" },
                    { component: "Нөөц хуулбар", health: 85, status: "сайн", color: "bg-emerald-500" },
                    { component: "Мониторинг систем", health: 98, status: "маш сайн", color: "bg-emerald-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                        <span className="text-sm text-white/70">{item.component}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-32 rounded-full bg-white/[0.06] overflow-hidden">
                          <div 
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.health}%` }}
                          ></div>
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-sm text-white/50">{item.health}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Сүүлийн 24 цагийн үйл ажиллагаа</h2>
                <div className="space-y-4">
                  {[
                    { time: "00:00", requests: 120, errors: 2 },
                    { time: "04:00", requests: 85, errors: 1 },
                    { time: "08:00", requests: 450, errors: 5 },
                    { time: "12:00", requests: 680, errors: 8 },
                    { time: "16:00", requests: 520, errors: 4 },
                    { time: "20:00", requests: 320, errors: 3 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="w-16">
                        <span className="text-sm text-white/70">{item.time}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"
                              style={{ width: `${(item.requests / 700) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-white/50 w-16 text-right">{item.requests} хүсэлт</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 to-pink-600 rounded-full"
                              style={{ width: `${(item.errors / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-red-400/70 w-16 text-right">{item.errors} алдаа</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}