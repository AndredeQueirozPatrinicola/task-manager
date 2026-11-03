import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/ui/icons";

export const metadata = {
  title: "Task Manager",
  description: "Next.js 15 + tRPC task manager",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
            <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
              <span className="flex size-6 items-center justify-center rounded-md bg-gray-900 text-white">
                <CheckIcon className="size-3.5" />
              </span>
              Task Manager
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-10">{children}</div>
      </body>
    </html>
  );
}
