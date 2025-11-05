import type { Metadata, Viewport } from "next";
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
  title: "Law Abiding Serbian Citizen Simulator",
  description: "Experience the daily life of a law-abiding Serbian citizen!",
};

export const viewport: Viewport = {
  themeColor: "#5B9BD5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        {children}
      </body>
    </html>
  );
}
