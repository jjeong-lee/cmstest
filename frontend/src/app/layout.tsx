import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { SessionProvider } from "@/lib/session-store";
import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { ReactNode } from "react";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Northstar Markdown CMS",
  description: "마크다운 기반 CMS 관리자 콘솔과 포털",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
        <QueryProvider>
          <SessionProvider>{children}</SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
