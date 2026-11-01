import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Task Manager",
  description: "Next.js 15 + tRPC learning scaffold",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
