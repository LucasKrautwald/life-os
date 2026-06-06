import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { DM_Mono } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Life OS",
  description: "External brain — finances, agency, school, health & habits.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${dmMono.variable}`}>
      <body className="bg-bg-primary text-text-primary antialiased">
        <div className="mesh-bg" aria-hidden />
        <div className="accent-top-line" aria-hidden />
        {children}
      </body>
    </html>
  );
}
