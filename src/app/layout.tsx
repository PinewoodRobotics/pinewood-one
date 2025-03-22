import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "One",
  description: "Pinewood One",
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
