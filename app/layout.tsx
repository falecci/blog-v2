import { cn } from "@/lib/utils";
import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("antialiased")}>
        <div className="min-h-screen bg-white">
          <header className="bg-gray-900 text-white py-4 px-4 sm:px-6">
            <div className="sm:container sm:mx-auto">
              <a href="/" className="text-white hover:text-white">
                <h1 className="text-xl font-semibold">falecci.dev</h1>
              </a>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
