# FormPilot - SaaS for creating forms and analytics dashboard

## Project Description

FormPilot is an advanced SaaS platform enabling users to create their own forms using drag-and-drop method, share them publicly or via iframe, and analyze collected responses in an administrative panel with charts and data export.

Project implemented as a full stack (Next.js + Prisma + PostgreSQL) with custom backend, authorization and API.

---

## PROJECT ROADMAP (MVP)

### STAGE 1: Environment Setup

Goal: launch a base project with basic login and structure functions

- Create Next.js project (`app router`, TypeScript, Tailwind, ESLint)
- Install and configure:
  - Prisma + PostgreSQL
  - Auth (NextAuth.js)
  - TailwindCSS + shadcn/ui
- Create dashboard layout (sidebar + topbar)
- Prisma models: `User`, `Form`, `Submission`
- Custom backend in Next.js API Routes:
  - `/api/forms` – create/edit forms
  - `/api/submissions` – save responses
  - `/api/user` – user data (authorization)

---

### STAGE 2: Form creation and editing

Goal: user can build and edit a form

- UI for form creation (name, description, tags)
- Adding fields (input, textarea, select, checkbox, etc.)
- Saving form to database (with JSON structure of fields)
- Form list view with "Edit" button
- `FormBuilder` component (React Hook Form + Zod)

---

### STAGE 3: Public form and submissions

Goal: form can be shared and filled out

- Public form URL (`/form/[formId]`)
- Dynamic form rendering based on JSON structure
- Data validation and submission save to database via API
- `EmbedCode` component (iframe/script to embed on other pages)

---

### STAGE 4: Dashboard + analytics

Goal: user sees data in a readable and attractive form

- Submissions view (table with sorting and filtering)
- Export to CSV (e.g., using `papaparse`)
- Charts (e.g., `Recharts`, `Tremor`)
  - Number of responses over time
  - Response distribution (for selects, checkboxes)

### STAGE 5: test account

- create test account, login as test and bypass authorization, blocked e.g. in .env
- create 59 random forms and responses, so there's something to show in the dashboard

### STAGE 6: final checking

- check the entire application and tests

---

## PROJECT STRUCTURE (base)

```
/app
  ├─ dashboard/
  │   ├─ page.tsx           # Form list
  │   └─ [formId]/          # Single form view + responses
  │       ├─ builder.tsx    # Form creator
  │       └─ responses.tsx  # Analytics / responses
  ├─ form/
  │   └─ [formId]/page.tsx  # Public form
  ├─ api/
  │   ├─ forms/             # CRUD forms
  │   └─ submissions/       # Save responses
  └─ middleware.ts          # API authorization
/lib
  └─ validators.ts          # Zod schemas
/components
  ├─ ui/                    # UI components (Button, Input, etc.)
  ├─ builder/               # FormBuilder, FieldEditor
  └─ analytics/             # Charts, statistics
/prisma
  └─ schema.prisma
```

---

## Prisma Models (MVP)

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
  fields      Json         // Dynamic form fields
  submissions Submission[]
  createdAt   DateTime     @default(now())
  user        User         @relation(fields: [userId], references: [id])
}

model Submission {
  id        String   @id @default(cuid())
  formId    String
  data      Json     // Form responses
  createdAt DateTime @default(now())
  form      Form     @relation(fields: [formId], references: [id])
}
```

---

## Backend API – Next.js App Router (Fullstack)

Example endpoints:

- `POST /api/forms` – create new form
- `GET /api/forms/:id` – get form
- `PUT /api/forms/:id` – edit form
- `POST /api/submissions` – save response
- `GET /api/user` – get current user data

Authorization using NextAuth (JWT + API middleware).

---

## Action Plan

1. Starter project on GitHub (Next.js + Tailwind + Prisma + Auth)
2. API and Prisma models implementation
3. Dashboard and forms creation
4. Visualizations and data export
5. Deployment: Vercel + Railway (PostgreSQL)

---

# Good luck and keep going! 🚀
