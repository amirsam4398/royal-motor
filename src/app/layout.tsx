import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "رویال موتور | اولین موتور هوش مصنوعی سئو اتوماتیک اینستاگرام در ایران",
  description:
    "استارتاپ فناورانه هوش مصنوعی رویال فام | اولین استارتاپ وایپ کدینگ در ایران — موتور خزش و سئو اتوماتیک اینستاگرام",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-white text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
