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
  title: "Auf Deutsch gesagt! – Deutsch lernen mit Geschichten",
  description:
    "Lerne authentisches Deutsch durch fesselnde Geschichten, Redewendungen und praxisnahe Übungen. 12 Module. Ein Verb-Universum. Dein Fortschritt.",
  icons: {
    icon: "/ADG!_Icon_transparent.png",
    apple: "/ADG!_Icon_transparent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
