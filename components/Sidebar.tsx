"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const studentSubItems = [
  { label: "Дүнгийн мэдээлэл", href: "/student/grades" },
  { label: "Төлбөрийн мэдээлэл", href: "/student/payment" },
  { label: "Сорил шалгалтын оноо", href: "/student/scores" },
  { label: "Шалгалтын хуваарь", href: "/student/schedule" },
  { label: "Төгсөгч тойрох хуудас", href: "/student/graduate" },
  { label: "My Project", href: "/student/project" },
];

const teacherSubItems = [
  { label: "Миний хичээлүүд", href: "/teacher/courses" },
  { label: "Ирц бүртгэл", href: "/teacher/attendance" },
  { label: "Дүнгийн жагсаалт", href: "/teacher/grades" },
  { label: "Хичээлийн хуваарь", href: "/teacher/schedule" },
  { label: "Цалин урамшуулал", href: "/teacher/salary" },
  { label: "Сургалтын хуанли", href: "/teacher/calendar" },
];

const courseSubItems = [
  { label: "Хичээлийн хуваарь", href: "/course-info/timetable" },
  { label: "Ирц бүртгэл", href: "/course-info/attendance" },
  { label: "Сургалтын төлөвлөгөө", href: "/course-info/training-plan" },
];



const studentMenuItems = [
  {
    label: "Нүүр хуудас",
    href: "/home",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Оюутан",
    href: null,
    sub: studentSubItems,
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 13c0-3 2.5-4.5 5.5-4.5S13 10 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Хичээл",
    href: null,
    sub: courseSubItems,
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="2" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 13h5M7.5 11v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Мэдэгдэл",
    href: "/student/notifications",
    badge: 3,
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1.5C5 1.5 3 3.5 3 6c0 3.5-2 4-2 4h13s-2-.5-2-4c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6.2 12.5a1.3 1.3 0 002.6 0" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Цахим сургалт",
    href: "/course/python-basics",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.1 1.1M11 11l1.1 1.1M2.9 12.1L4 11M11 4l1.1-1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Тэтгэлэг",
    href: "/student/scholarship",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 2h9a1 1 0 011 1v10l-4.5-2.5L4 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Дотуур байр",
    href: "/student/dormitory",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 2h9a1 1 0 011 1v10l-4.5-2.5L4 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Дадлага",
    href: "/student/internship",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 2h9a1 1 0 011 1v10l-4.5-2.5L4 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Гэрээ, хэлэлцэл",
    href: "/student/contract",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 2h9a1 1 0 011 1v10l-4.5-2.5L4 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Сургалтын алба",
    href: "/student/office",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 2h9a1 1 0 011 1v10l-4.5-2.5L4 13V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const parentMenuItems = [
  {
    label: "Нүүр хуудас",
    href: "/parent",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Дүнгийн мэдээлэл",
    href: "/parent/grades",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 7h12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Ирцийн мэдээлэл",
    href: "/parent/attendance",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M3 8l2.5 2.5L12 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="1.5" y="1.5" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Төлбөрийн мэдээлэл",
    href: "/parent/payment",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="4" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 7h12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    label: "Хичээлийн хуваарь",
    href: "/parent/schedule",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 1.8v2.4M10.5 1.8v2.4M2 6h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Шалгалтын хуваарь",
    href: "/parent/exams",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M4 2h6l2 2v9H4V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6 7h4M6 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Мэдэгдэл",
    href: "/parent/messages",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1.5C5 1.5 3 3.5 3 6c0 3.5-2 4-2 4h13s-2-.5-2-4c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6.2 12.5a1.3 1.3 0 002.6 0" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
];

const teacherMenuItems = [
  {
    label: "Нүүр хуудас",
    href: "/teacher/home",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Багш",
    href: null,
    sub: teacherSubItems,
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 13c0-3 2.5-4.5 5.5-4.5S13 10 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Мэдэгдэл",
    href: "/teacher/notifications",
    badge: 2,
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 1.5C5 1.5 3 3.5 3 6c0 3.5-2 4-2 4h13s-2-.5-2-4c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M6.2 12.5a1.3 1.3 0 002.6 0" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
];

// Бүрэн эрхт админы цэс - бүх системийн удирдлага
const adminMenuItems = [
  {
    label: "Хяналтын самбар",
    href: "/admin/dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Удирдлага (Governance)",
    href: null,
    sub: [
      { label: "Аналитик самбар", href: "/admin/analytics-dashboard" },
      { label: "Байгууллагын бүтэц", href: "/admin/organization-structure" },
      { label: "Тэнхим, салбар сургууль", href: "/admin/departments-branches" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="2" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 13h5M7.5 11v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Сургалтын удирдлага",
    href: null,
    sub: [
      { label: "Хөтөлбөр / Сургалтын төлөвлөгөө", href: "/admin/training-management" },
      { label: "Анги / Бүлэг", href: "/admin/classes" },
      { label: "Хичээлийн хуваарь", href: "/admin/timetable" },
      { label: "Шалгалтын хуваарь", href: "/admin/exam-schedule" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Санхүүгийн удирдлага",
    href: null,
    sub: [
      { label: "Төлбөрийн мэдээлэл", href: "/admin/finance-management" },
      { label: "Санхүүгийн тайлан", href: "/admin/financial-reports-management" },
      { label: "Төсөв төлөвлөлт", href: "/admin/budget-management" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 6.5V5a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="7.5" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Оюутны удирдлага",
    href: null,
    sub: [
      { label: "Оюутны жагсаалт", href: "/admin/students" },
      { label: "Ирцийн бүртгэл", href: "/admin/attendance" },
      { label: "Дүнгийн хуудас", href: "/admin/grades" },
      { label: "Төгсөлт", href: "/admin/graduation" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 13c0-3 2.5-4.5 5.5-4.5S13 10 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Хэрэглэгч & Эрх",
    href: null,
    sub: [
      { label: "Хэрэглэгчийн эрх", href: "/admin/user-permissions" },
      { label: "Роль удирдлага", href: "/admin/role-management" },
      { label: "Системийн бүртгэл", href: "/admin/audit-logs" },
      { label: "Нэвтрэх түүх", href: "/admin/login-history" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.1 1.1M11 11l1.1 1.1M2.9 12.1L4 11M11 4l1.1-1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Тохиргоо (Settings)",
    href: null,
    sub: [
      { label: "Системийн тохиргоо", href: "/admin/settings" },
      { label: "Нөөц хуулбар", href: "/admin/backups" },
      { label: "Системийн мониторинг", href: "/admin/system-monitoring" },
      { label: "Өгөгдлийн менежмент", href: "/admin/data-management" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 1.8v2.4M10.5 1.8v2.4M2 6h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

// Сургалтын албаны цэс - зөвхөн сургалтын удирдлага
const trainingMenuItems = [
  {
    label: "Хяналтын самбар",
    href: "/admin/training-dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Хичээлийн удирдлага",
    href: null,
    sub: [
      { label: "Сургалтын төлөвлөгөө", href: "/admin/training-plan" },
      { label: "Анги / Бүлэг", href: "/admin/classes" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Хуваарь",
    href: null,
    sub: [
      { label: "Хичээлийн хуваарь", href: "/admin/timetable" },
      { label: "Шалгалтын хуваарь", href: "/admin/exam-schedule" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 1.8v2.4M10.5 1.8v2.4M2 6h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Оюутны удирдлага",
    href: null,
    sub: [
      { label: "Оюутны жагсаалт", href: "/admin/students" },
      { label: "Ирцийн бүртгэл", href: "/admin/attendance" },
      { label: "Дүнгийн хуудас", href: "/admin/grades" },
      { label: "Төгсөлт", href: "/admin/graduation" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 13c0-3 2.5-4.5 5.5-4.5S13 10 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Багш нарын удирдлага",
    href: null,
    sub: [
      { label: "Багшийн жагсаалт", href: "/admin/teachers" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Санхүүгийн албаны цэс - 4 үндсэн ангилалд хуваасан
const financeMenuItems = [
  {
    label: "Хяналтын самбар",
    href: "/admin/finance-dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Оюутан",
    href: null,
    sub: [
      { label: "Оюутны жагсаалт", href: "/admin/students" },
      { label: "Төлбөрийн нэхэмжлэх", href: "/admin/tuition-invoices" },
      { label: "Төлбөрийн үлдэгдэл", href: "/admin/payment-balance" },
      { label: "Төлбөр төлөлтийн явц", href: "/admin/payment-progress" },
      { label: "Хугацаа хэтэрсэн төлбөр", href: "/admin/overdue-payments" },
      { label: "Гүйлгээний түүх", href: "/admin/payment-history" },
      { label: "Хөнгөлөлтийн удирдлага", href: "/admin/discount-management" },
      { label: "Тэтгэлгийн жагсаалт", href: "/admin/scholarship-list" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2 13c0-3 2.5-4.5 5.5-4.5S13 10 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Багш",
    href: null,
    sub: [
      { label: "Багшийн жагсаалт", href: "/admin/teachers" },
      { label: "Багш, ажилчдын цалин", href: "/admin/staff-salaries" },
      { label: "Урамшуулал, суутгал", href: "/admin/bonus-deductions" },
      { label: "НДШ, ХХОАТ бүртгэл", href: "/admin/tax-records" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Орлого / Зардал",
    href: null,
    sub: [
      { label: "Төлбөрийн мэдээлэл", href: "/admin/finance" },
      { label: "Эд хөрөнгийн бүртгэл", href: "/admin/inventory" },
      { label: "Төсөв төлөвлөлт", href: "/admin/budget-planning" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2.5" y="6.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 6.5V5a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="7.5" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Хяналт / Шалгалт",
    href: null,
    sub: [
      { label: "Хяналтын мэдээлэл", href: "/admin/audit" },
      { label: "Шалгалтын тайлан", href: "/admin/audit-reports" },
      { label: "Дотоод хяналт", href: "/admin/internal-audit" },
      { label: "Гадаад хяналт", href: "/admin/external-audit" },
    ],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.9 2.9l1.1 1.1M11 11l1.1 1.1M2.9 12.1L4 11M11 4l1.1-1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (key: string) => void;
}

export default function Sidebar({ activeMenu, onMenuChange }: SidebarProps) {
  const pathname = usePathname();
  const [studentOpen, setStudentOpen] = useState(
    pathname.startsWith("/student")
  );
  const [courseOpen, setCourseOpen] = useState(
    pathname.startsWith("/course-info")
  );
  const [teacherOpen, setTeacherOpen] = useState(
    pathname.startsWith("/teacher")
  );
  // Admin dropdown states - each dropdown has its own state
  const [adminDropdowns, setAdminDropdowns] = useState<Record<string, boolean>>({});
  const [trainingDropdowns, setTrainingDropdowns] = useState<Record<string, boolean>>({});
  const [financeDropdowns, setFinanceDropdowns] = useState<Record<string, boolean>>({});
  
  // Determine user type and role
  const [userType, setUserType] = useState<"training" | "finance" | "admin" | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedType = localStorage.getItem("userType") as "training" | "finance" | "admin" | null;
      setUserType(savedType);
    }
  }, [pathname]); // Re-check when pathname changes (e.g., after logout)



  const isTeacherPage = pathname.startsWith("/teacher");
  const isAdminPage = pathname.startsWith("/admin");
  const isParentPage = pathname.startsWith("/parent");
  
  // Determine which menu items to show based on user type and pathname
  let menuItems = studentMenuItems;
  
  if (isAdminPage) {
    // On admin pages, show department-specific menu based on userType
    if (userType === "admin") {
      menuItems = adminMenuItems;
    } else if (userType === "training") {
      menuItems = trainingMenuItems;
    } else if (userType === "finance") {
      menuItems = financeMenuItems;
    } else {
      // No userType selected on admin pages - show only "Нүүр хуудас"
      menuItems = [
        {
          label: "Нүүр хуудас",
          href: "/admin/dashboard",
          icon: (
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M1.5 6L7.5 1.5L13.5 6V13H9.5V9.5H5.5V13H1.5V6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          ),
        },
      ];
    }
  } else if (isTeacherPage) {
    // Teacher pages: show teacher menu
    menuItems = teacherMenuItems;
  } else if (isParentPage) {
    menuItems = parentMenuItems;
  }
  // For student/home pages, always show student menu
  // (userType is ignored on non-admin pages)

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-64px)] w-52 shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0118] px-2 py-3">
      <p className="mb-2 px-3 text-[10px] uppercase tracking-widest text-white/30">
        {isAdminPage ? (
          userType === "admin" ? "Админы цэс" : 
          userType === "training" ? "Сургалтын цэс" :
          userType === "finance" ? "Санхүүгийн цэс" : "Цэс"
        ) : isTeacherPage ? "Багшийн цэс" : "Цэс"}
      </p>

      <nav className="flex flex-col gap-0.5 overflow-y-auto scrollbar-none">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.label;
          
          // Check if this is a dropdown item (has sub items)
          if (item.sub) {
            // For teacher dropdown on teacher pages
            if (item.label === "Багш" && isTeacherPage) {
              const isParentActive = pathname.startsWith("/teacher");
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setTeacherOpen((v: boolean) => !v)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                      isParentActive
                        ? "border-violet-400/20 bg-violet-600/15 text-violet-200"
                        : "border-transparent text-white/50 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span className={isParentActive ? "text-violet-200" : "text-white/40 group-hover:text-white/70"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`shrink-0 transition-transform duration-200 ${teacherOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: teacherOpen ? `${item.sub.length * 36}px` : "0px" }}
                  >
                    <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-white/[0.06] pl-3">
                      {item.sub.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => onMenuChange(sub.label)}
                            className={`rounded-lg px-2 py-1.5 text-xs transition-all ${
                              isSubActive
                                ? "bg-violet-600/15 text-violet-200"
                                : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            
            // For student dropdown on student pages
            if (item.label === "Оюутан" && !isTeacherPage && !isAdminPage) {
              const isParentActive = pathname.startsWith("/student");
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setStudentOpen((v: boolean) => !v)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                      isParentActive
                        ? "border-violet-400/20 bg-violet-600/15 text-violet-200"
                        : "border-transparent text-white/50 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span className={isParentActive ? "text-violet-200" : "text-white/40 group-hover:text-white/70"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`shrink-0 transition-transform duration-200 ${studentOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: studentOpen ? `${item.sub.length * 36}px` : "0px" }}
                  >
                    <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-white/[0.06] pl-3">
                      {item.sub.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => onMenuChange(sub.label)}
                            className={`rounded-lg px-2 py-1.5 text-xs transition-all ${
                              isSubActive
                                ? "bg-violet-600/15 text-violet-200"
                                : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            
            // For course dropdown on student pages
            if (item.label === "Хичээл" && !isTeacherPage && !isAdminPage) {
              const isParentActive = pathname.startsWith("/course-info");
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setCourseOpen((v: boolean) => !v)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                      isParentActive
                        ? "border-violet-400/20 bg-violet-600/15 text-violet-200"
                        : "border-transparent text-white/50 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span className={isParentActive ? "text-violet-200" : "text-white/40 group-hover:text-white/70"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`shrink-0 transition-transform duration-200 ${courseOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: courseOpen ? `${item.sub.length * 36}px` : "0px" }}
                  >
                    <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-white/[0.06] pl-3">
                      {item.sub.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => onMenuChange(sub.label)}
                            className={`rounded-lg px-2 py-1.5 text-xs transition-all ${
                              isSubActive
                                ? "bg-violet-600/15 text-violet-200"
                                : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            
            // For admin dropdown items on admin pages
            if (isAdminPage && item.sub) {
              // Determine which dropdown state to use based on user type
              let dropdownsState = adminDropdowns;
              let setDropdownsState = setAdminDropdowns;
              
              if (userType === "training") {
                dropdownsState = trainingDropdowns;
                setDropdownsState = setTrainingDropdowns;
              } else if (userType === "finance") {
                dropdownsState = financeDropdowns;
                setDropdownsState = setFinanceDropdowns;
              }
              
              const isDropdownOpen = dropdownsState[item.label] || false;
              
              const toggleDropdown = () => {
                setDropdownsState(prev => ({
                  ...prev,
                  [item.label]: !prev[item.label]
                }));
              };
              
              const isParentActive = pathname.startsWith("/admin");
              return (
                <div key={item.label}>
                  <button
                    onClick={toggleDropdown}
                    className={`group flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                      isParentActive
                        ? "border-violet-400/20 bg-violet-600/15 text-violet-200"
                        : "border-transparent text-white/50 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <span className={isParentActive ? "text-violet-200" : "text-white/40 group-hover:text-white/70"}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isDropdownOpen ? `${item.sub.length * 36}px` : "0px" }}
                  >
                    <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-white/[0.06] pl-3">
                      {item.sub.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => onMenuChange(sub.label)}
                            className={`rounded-lg px-2 py-1.5 text-xs transition-all ${
                              isSubActive
                                ? "bg-violet-600/15 text-violet-200"
                                : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
          }
          
          // Normal link item
          return (
            <Link
              key={item.label}
              href={item.href || "#"}
              onClick={() => onMenuChange(item.label)}
              className={`group flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                isActive
                  ? "border-violet-400/20 bg-violet-600/15 text-violet-200"
                  : "border-transparent text-white/50 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <span className={isActive ? "text-violet-200" : "text-white/40 group-hover:text-white/70"}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-pink-500/80 px-1.5 py-0.5 text-[10px] text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="rounded-xl border border-violet-400/20 bg-violet-600/10 p-1">
          <p className="mt-0.5 text-center text-[12px] leading-relaxed text-white/40">
            2025-2026
          </p>
        </div>
      </div>
    </aside>
  );
}
