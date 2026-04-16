import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./auth-provider.client";

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
    <html lang="de">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="light" />
        <meta name="apple-mobile-web-app-title" content="Bucketlist" />
      </head>
      <body className={`${inter.className} bg-background text-foreground min-h-screen selection:bg-accent-primary/20 selection:text-accent-primary`}>
        <AuthProvider>
          <div className="purple-glow">
            <div className="glow-blob blob-1" />
            <div className="glow-blob blob-2" />
            <div className="glow-blob blob-3" />
          </div>
          <main className="relative z-10">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
