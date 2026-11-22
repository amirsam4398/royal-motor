import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'رویال موتور | اولین موتور هوش مصنوعی سئو اتوماتیک اینستاگرام در ایران',
  description:
    'استارتاپ فناورانه هوش مصنوعی رویال فام - تحلیل همزمان تا ۱۰ پیج، شناسایی ۲۰ رقیب محلی، استانی و کشوری، هشتگ‌های سئو ۲۴/۷ و تقویم محتوایی ۷ روز رایگان.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-white text-[#202124] antialiased">{children}</body>
    </html>
  );
}
