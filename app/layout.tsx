import { cn } from "@/lib/utils";
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("antialiased")}>
        <a
          href="#main-content"
          className="sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <div className="min-h-screen bg-white">{children}</div>
      </body>
    </html>
  );
}
