import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'easymde/dist/easymde.min.css';

const interSans = Inter({
  variable: "--font-inter-sans",
});


export const metadata: Metadata = {
  title: "Wamil - What am I Learning",
  description: "A place to write and share your knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
