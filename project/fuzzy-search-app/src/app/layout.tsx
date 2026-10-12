import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fuzzy Search System | Edit Distance & Metric Trees",
  description:
    "Production-ready interactive fuzzy search playground using Edit Distance Dynamic Programming and Burkhard-Keller Metric Trees (BK-Trees). Course project for Data Structures and Algorithms 3 (25CS2103E), KLH University.",
  keywords: [
    "Fuzzy Search",
    "Edit Distance",
    "Burkhard-Keller Tree",
    "BK-Tree",
    "Metric Space",
    "Dynamic Programming",
    "Data Structures",
    "KLH University",
  ],
  authors: [
    { name: "CharanTej Reddy" },
    { name: "Chandrakanth Reddy" },
    { name: "Teja" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        {children}
      </body>
    </html>
  );
}
