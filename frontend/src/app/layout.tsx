import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { SessionProvider } from "@/lib/session-store";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Northstar CMS",
  description: "Image-first CMS admin console",
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
