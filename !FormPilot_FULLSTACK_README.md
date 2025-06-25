# FormPilot - SaaS do tworzenia formularzy i dashboard analityczny

## Opis projektu

FormPilot to zaawansowana platforma SaaS umożliwiająca użytkownikom tworzenie własnych formularzy metodą drag-and-drop, udostępnianie ich publicznie lub przez iframe oraz analizowanie zebranych odpowiedzi w panelu administracyjnym z wykresami i eksportem danych.

Projekt zrealizowany jako pełny stack (Next.js + Prisma + PostgreSQL) z własnym backendem, autoryzacją i API.

---

## ROADMAPA PROJEKTU (MVP)

### ETAP 1: Przygotowanie środowiska

Cel: uruchomić bazowy projekt z podstawowymi funkcjami logowania i struktury

- Utwórz projekt Next.js (`app router`, TypeScript, Tailwind, ESLint)
- Zainstaluj i skonfiguruj:
  - Prisma + PostgreSQL
  - Auth (NextAuth.js)
  - TailwindCSS + shadcn/ui
- Utwórz layout dashboardu (sidebar + topbar)
- Modele Prisma: `User`, `Form`, `Submission`
- Własny backend w Next.js API Routes:
  - `/api/forms` – tworzenie/edycja formularzy
  - `/api/submissions` – zapis odpowiedzi
  - `/api/user` – dane użytkownika (autoryzacja)

---

### ETAP 2: Tworzenie i edycja formularzy

Cel: użytkownik może zbudować i edytować formularz

- UI do tworzenia formularza (nazwa, opis, tagi)
- Dodawanie pól (input, textarea, select, checkbox, etc.)
- Zapisywanie formularza do bazy (ze strukturą JSON pól)
- Widok listy formularzy z przyciskiem "Edytuj"
- Komponent `FormBuilder` (React Hook Form + Zod)

---

### ETAP 3: Publiczny formularz i submissiony

Cel: formularz można udostępnić i wypełnić

- Publiczny URL formularza (`/form/[formId]`)
- Renderowanie formularza dynamicznie na podstawie JSON ze struktury
- Walidacja danych i zapis submissiona do bazy danych przez API
- Komponent `EmbedCode` (iframe/skrypt do wklejenia na inne strony)

---

### ETAP 4: Dashboard + analityka

Cel: użytkownik widzi dane w czytelnej i atrakcyjnej formie

- Widok submissionów (tabela z sortowaniem i filtrowaniem)
- Export do CSV (np. za pomocą `papaparse`)
- Wykresy (np. `Recharts`, `Tremor`)
  - Liczba odpowiedzi w czasie
  - Rozkład odpowiedzi (dla selectów, checkboxów)
- Prosty plan subskrypcyjny (Stripe – free do 5 formularzy)

---

## STRUKTURA PROJEKTU (bazowa)

```
/app
  ├─ dashboard/
  │   ├─ page.tsx           # Lista formularzy
  │   └─ [formId]/          # Widok 1 formularza + odpowiedzi
  │       ├─ builder.tsx    # Kreator formularzy
  │       └─ responses.tsx  # Analityka / odpowiedzi
  ├─ form/
  │   └─ [formId]/page.tsx  # Publiczny formularz
  ├─ api/
  │   ├─ forms/             # CRUD formularzy
  │   └─ submissions/       # Zapisywanie odpowiedzi
  └─ middleware.ts          # Autoryzacja API
/lib
  └─ validators.ts          # Zod schematy
/components
  ├─ ui/                    # Komponenty UI (Button, Input, itd.)
  ├─ builder/               # FormBuilder, FieldEditor
  └─ analytics/             # Wykresy, statystyki
/prisma
  └─ schema.prisma
```

---

## Modele Prisma (MVP)

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
  fields      Json         // Dynamiczne pola formularza
  submissions Submission[]
  createdAt   DateTime     @default(now())
  user        User         @relation(fields: [userId], references: [id])
}

model Submission {
  id        String   @id @default(cuid())
  formId    String
  data      Json     // Odpowiedzi na formularz
  createdAt DateTime @default(now())
  form      Form     @relation(fields: [formId], references: [id])
}
```

---

## Backend API – Next.js App Router (Fullstack)

Przykładowe endpointy:

- `POST /api/forms` – utwórz nowy formularz
- `GET /api/forms/:id` – pobierz formularz
- `PUT /api/forms/:id` – edytuj formularz
- `POST /api/submissions` – zapisz odpowiedź
- `GET /api/user` – pobierz dane aktualnego użytkownika

Autoryzacja za pomocą NextAuth (JWT + middleware API).

---

## Plan działania

1. Starter project na GitHubie (Next.js + Tailwind + Prisma + Auth)
2. Implementacja API i modeli Prisma
3. Tworzenie dashboardu i formularzy
4. Wizualizacje i eksport danych
5. Deployment: Vercel + Railway (PostgreSQL)

---

# Powodzenia i działaj dalej! 🚀
