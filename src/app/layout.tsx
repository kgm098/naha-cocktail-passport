import type { Metadata } from "next";
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const notoSans = Noto_Sans_JP({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NAHA COCKTAIL PASSPORT Vol.1",
  description: "那覇市内6店舗を巡るカクテルパスポート。2026年7月1日〜8月31日開催。",
  openGraph: {
    title: "NAHA COCKTAIL PASSPORT Vol.1",
    description: "那覇市内6店舗を巡るカクテルパスポート。2026年7月1日〜8月31日開催。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSerif.variable} ${notoSans.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
