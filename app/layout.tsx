import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css';
import "./globals.css";
import { cn } from "@/app/lib/utils";
import { ThemeProvider } from "./provider/theme-provider";
import { ModalProvider } from "./provider/modal-provider";
import { SocketProvider } from "./provider/socket-provider";
import QueryProvider from "./provider/query-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "Discord Clone with Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          "h-screen w-screen overflow-hidden bg-background font-sans select-none antialiased bg-white dark:bg-[#313338] dark:text-[#c4c9ce]",
          fontSans.variable
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <SocketProvider>
              <QueryProvider>
                <ModalProvider>
                  {children}
                </ModalProvider>
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
