# FormPilot

FormPilot is a full-stack SaaS platform for creating customizable forms and analyzing responses with a modern analytics dashboard. Built with Next.js, Prisma, PostgreSQL, and shadcn/ui, it enables users to design forms, share them publicly, and gain insights from collected data.

---

## Features

- **Drag-and-drop Form Builder**: Create forms with various field types (input, textarea, select, checkbox, radio, number, date, etc.)
- **Public Form Sharing**: Share forms via public URL, iframe, or JavaScript embed code
- **Real-time Analytics Dashboard**: View submissions, filter, sort, and export data to CSV
- **Charts & Visualizations**: Analyze responses with charts (Recharts)
- **Authentication**: Secure user accounts with NextAuth.js (supports test/demo mode)
- **API-first**: RESTful API for forms and submissions
- **Responsive UI**: Built with TailwindCSS and shadcn/ui components

---

## Tech Stack

- **Frontend**: Next.js (App Router, TypeScript, TailwindCSS, shadcn/ui)
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **CSV Export**: PapaParse

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/formpilot.git
cd formpilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example` and set your database and authentication secrets.

### 4. Set up the database

```bash
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

---

## Usage

- **Create an account** or use the test/demo mode for quick access
- **Build forms** using the drag-and-drop builder
- **Share forms** via public link or embed code
- **Collect responses** and view them in the dashboard
- **Analyze data** with tables, filters, and charts
- **Export submissions** to CSV for further analysis

---

## Project Structure

```
/app
  ├─ dashboard/         # Forms list, analytics, and editing
  ├─ form/              # Public form rendering
  ├─ api/               # API routes for forms and submissions
/components
  ├─ ui/                # UI components (Button, Input, etc.)
  ├─ builder/           # FormBuilder, FieldEditor
  └─ analytics/         # Charts, statistics
/lib
  └─ validators.ts      # Zod schemas
/prisma
  └─ schema.prisma      # Database schema
```

---

## Testing

- Run all tests:

```bash
npm test
```

- Coverage reports are generated in the `coverage/` directory.

---

## Deployment

- Deploy easily to [Vercel](https://vercel.com/) or your preferred platform
- Use [Railway](https://railway.app/) or similar for PostgreSQL hosting

---

## License

MIT

---

## Author

Created by Mateusz Wlodarczyk. Contributions welcome!
