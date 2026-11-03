import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Task Manager",
  description: "Next.js 15 + tRPC task manager",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-2xl px-4 py-10">{children}</div>
      </body>
    </html>
  );
}
