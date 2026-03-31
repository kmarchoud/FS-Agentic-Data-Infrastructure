import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Sidebar } from "@/components/dashboard/sidebar";
import { PasswordGate } from "@/components/auth/password-gate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regulex Intelligence",
  description: "Distribution Intelligence Dashboard — Meridian Asset Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans min-h-screen">
        <PasswordGate>
          <Sidebar />
          <main style={{ marginLeft: "240px", minHeight: "100vh" }}>
            {children}
          </main>
        </PasswordGate>
      </body>
    </html>
  );
}
