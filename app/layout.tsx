// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Bricolage_Grotesque } from "next/font/google";
import { Space_Mono } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const fontBody = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: "400",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-dvh dark">
            <header className="bg-primary text-primary-foreground py-4 px-4 sm:px-6 fixed w-full z-50">
              <div className="sm:container sm:mx-auto flex justify-between">
                <a href="https://falecci.dev">
                  <h1 className="text-2xl font-bold">falecci.dev</h1>
                </a>

                <div className="flex gap-4 bg-primary text-primary-foreground">
                  <a href="https://x.com/fedeeeeeev">
                    <Image
                      alt="X"
                      height={28}
                      width={28}
                      src="/icons/twitter.svg"
                    />
                  </a>
                  <a href="https://github.com/falecci">
                    <Image
                      alt="Github"
                      height={28}
                      width={28}
                      src="/icons/github.svg"
                    />
                  </a>
                  <a href="mailto:i.am@falecci.dev">
                    <Image
                      alt="Mail"
                      height={28}
                      width={28}
                      src="/icons/mail.svg"
                    />
                  </a>
                </div>
              </div>
            </header>
            <div className="mt-16">{children}</div>
            <footer className="bg-muted text-muted-foreground py-4 px-6">
              <div className="container mx-auto text-center text-sm">
                &copy; 2024 falecci.dev. All rights reserved.
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
