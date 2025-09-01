import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaHaus - B2B Landing Page",
  description: "Modern B2B solutions for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}