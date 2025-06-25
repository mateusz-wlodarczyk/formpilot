
# 🚀 Setup projektu FormPilot (Next.js + Prisma + PostgreSQL + Auth + UI)

Pełen stack do projektu SaaS z kreatorem formularzy i dashboardem analitycznym.

---

## ✅ 1. Inicjalizacja projektu

```bash
npx create-next-app@latest formpilot \
  --typescript \
  --app \
  --tailwind \
  --eslint \
  --src-dir
cd formpilot
```

---

## ✅ 2. Instalacja zależności

### Prisma + PostgreSQL:

```bash
npm install prisma @prisma/client
```

### Autoryzacja (NextAuth.js):

```bash
npm install next-auth
```

### Walidacja danych:

```bash
npm install zod
```

### Formularze:

```bash
npm install react-hook-form
```

### shadcn/ui + CLI:

```bash
npm install -D @shadcn/ui
npx shadcn-ui@latest init
```

Podczas konfiguracji:
- Framework: `Next.js`
- Styling: `Tailwind CSS`
- Project dir: `./src`
- App dir: `true`

---

## ✅ 3. Inicjalizacja Prisma

```bash
npx prisma init
```

W `.env` zaktualizuj:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/formpilot"
```

---

## ✅ 4. Modele Prisma

W pliku `prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  forms     Form[]
}

model Form {
  id          String       @id @default(cuid())
  userId      String
  title       String
  description String?
  fields      Json
  submissions Submission[]
  createdAt   DateTime     @default(now())
  user        User         @relation(fields: [userId], references: [id])
}

model Submission {
  id        String   @id @default(cuid())
  formId    String
  data      Json
  createdAt DateTime @default(now())
  form      Form     @relation(fields: [formId], references: [id])
}
```

Następnie:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## ✅ 5. Konfiguracja NextAuth

Stwórz plik `src/app/api/auth/[...nextauth]/route.ts`.

Zainstaluj adapter Prisma:

```bash
npm install @next-auth/prisma-adapter
```

---

## ✅ 6. Dodanie komponentów UI

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
```

---

## ✅ 7. (Opcjonalnie) Narzędzia developerskie

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

W `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "format": "prettier --write ."
}
```

---

## ✅ 8. Uruchomienie dev serwera

```bash
npm run dev
```

---

Gotowe! Możesz działać dalej nad strukturą `/app`, API i UI.

🛠️ Powodzenia!
