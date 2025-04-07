import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meet Memo - PWRUP 4765",
  description:
    "We are FRC team 4765, PWRUP, from Pinewood School in Los Altos, California. Meet Memo, our robot for the 2025 Reefscape FRC game, and explore its capabilities on the field.",
};

const inter = Inter({ subsets: ["latin"] });
const interVariable = inter.style.fontFamily;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interVariable} antialiased`}>{children}</body>
    </html>
  );
}
