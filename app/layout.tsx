import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers";
import { Toaster } from "sonner";
import { AppHeader } from "./components/AppHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Customer-Service Desk power by AI",
  description: "AI-powered customer-service desk for calls, emails, and reviews",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AppHeader />
          {children}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: {
                width: "auto",
                minWidth: "max-content",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
