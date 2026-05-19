"use client";

import { useState, useEffect } from "react";

export type AdminRole = "admin" | "training" | "finance" | null;

/**
 * JWT session-аас admin role авах hook.
 * localStorage-ийн userType-ийг орлуулна.
 */
export function useAdminRole() {
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((me) => {
        if (me?.role) {
          setRole(me.role as AdminRole);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getDashboardLink = () => {
    if (role === "finance") return "/admin/finance-dashboard";
    if (role === "training") return "/admin/training-dashboard";
    return "/admin/dashboard";
  };

  const getRoleLabel = () => {
    if (role === "finance") return "Санхүүгийн админ";
    if (role === "training") return "Сургалтын админ";
    return "Бүрэн эрхт админ";
  };

  return { role, loading, getDashboardLink, getRoleLabel };
}
