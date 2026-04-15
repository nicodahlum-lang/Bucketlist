import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bucketlist ✨",
  description: "Plane deine größten Abenteuer",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bucketlist",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Bucketlist" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-background text-foreground min-h-screen selection:bg-accent-primary/30 selection:text-white`}>
        <AuthProvider>
          <div className="fixed inset-0 bg-purple-glow pointer-events-none z-0" />
          <main className="relative z-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
