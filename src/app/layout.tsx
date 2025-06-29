import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { TestSessionProvider } from "@/components/TestSessionProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FormPilot Dashboard",
  description: "SaaS platform for creating forms and analytics dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body className={geist.className}>
        <TestSessionProvider>
          <SessionProvider>{children}</SessionProvider>
        </TestSessionProvider>
      </body>
    </html>
  );
}
