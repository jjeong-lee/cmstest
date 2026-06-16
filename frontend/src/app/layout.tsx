import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { SessionProvider } from "@/lib/session-store";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Northstar Markdown CMS",
  description: "마크다운 기반 CMS 관리자 콘솔과 포털",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <SessionProvider>{children}</SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
