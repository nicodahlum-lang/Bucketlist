import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Our Bucket List",
  description: "Capturing memories, creating adventures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen selection:bg-accent-primary/30 selection:text-white`}>
        <div className="fixed inset-0 bg-purple-glow pointer-events-none z-0" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
