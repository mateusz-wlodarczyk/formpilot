import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "FormPilot Dashboard",
  description: "Platforma SaaS do tworzenia formularzy i analityki",
};
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    //suppressHydrationWarning??
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="flex h-screen">
          <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-4 text-lg font-bold">FormPilot</div>
            <nav className="flex-1">
              <ul className="space-y-2 p-4">
                <li>
                  <a
                    href="/dashboard"
                    className="block p-2 rounded hover:bg-gray-700"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/forms"
                    className="block p-2 rounded hover:bg-gray-700"
                  >
                    Formularze
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard/analytics"
                    className="block p-2 rounded hover:bg-gray-700"
                  >
                    Analityka
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="flex-1 flex flex-col">
            <header className="bg-gray-100 p-4 shadow">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Wyloguj
                </button>
              </div>
            </header>

            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
