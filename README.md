# Индра Коллеж — Сургуулийн Удирдлагын Систем

Next.js 14 + Prisma + PostgreSQL дээр суурилсан сургуулийн удирдлагын систем.

---

## Технологийн стек

| Давхарга | Технологи |
|---|---|
| Frontend | Next.js 14 (App Router), TailwindCSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (jose), httpOnly cookie |
| Deployment | Vercel |

---

## Локал орчинд ажиллуулах

### 1. Шаардлага

- Node.js 18+
- PostgreSQL 14+

### 2. Суулгах

```bash
git clone https://github.com/XeKu007/diplom.git
cd diplom
npm install
```

### 3. Орчны хувьсагч тохируулах

```bash
cp .env.local.example .env.local
```

`.env.local` файлд дараах утгуудыг өөрчилнө:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/indra_cyber"
JWT_SECRET="your-random-secret-min-32-chars"
```

### 4. Өгөгдлийн сан үүсгэх

```bash
npm run db:push
npm run db:seed
```

### 5. Ажиллуулах

```bash
npm run dev
```

`http://localhost:3000` дээр нээгдэнэ.

---

## Vercel-д deploy хийх

### 1. Vercel дээр шинэ project үүсгэх

[vercel.com](https://vercel.com) → New Project → GitHub repo сонгох

### 2. Environment Variables тохируулах

Vercel dashboard → Settings → Environment Variables:

| Нэр | Утга |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Санамсаргүй 64 тэмдэгт string |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |

### 3. JWT_SECRET үүсгэх

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Deploy

```bash
git push origin main
```

Vercel автоматаар build хийж deploy хийнэ.

---

## Нэвтрэх мэдээлэл (seed өгөгдөл)

| Роль | ID | Нууц үг |
|---|---|---|
| Бүрэн эрхт админ | `admin001` | `admin123` |
| Сургалтын алба | `training001` | `training123` |
| Санхүүгийн алба | `finance001` | `finance123` |
| Багш | `teacher001` | `teacher123` |
| Оюутан | `student001` | `student123` |

---

## Аюулгүй байдлын тохиргоо

- **JWT**: httpOnly cookie, 7 хоногийн хугацаа
- **Rate limiting**: Login-д 5 оролдлого/минут
- **Security headers**: CSP, X-Frame-Options, HSTS (production)
- **Input validation**: Бүх API route-д
- **Audit logging**: Нэвтрэлт, гарах бүртгэл

---

## Хавтасны бүтэц

```
diplom/
├── app/
│   ├── admin/          # Админы хуудсууд
│   ├── api/            # API routes
│   ├── student/        # Оюутны хуудсууд
│   ├── teacher/        # Багшийн хуудсууд
│   └── parent/         # Эцэг эхийн хуудсууд
├── components/         # Дахин ашиглах компонентууд
├── hooks/              # Custom React hooks
├── lib/                # Utility функцүүд
├── prisma/             # DB schema, seed
└── middleware.ts       # Auth middleware
```
