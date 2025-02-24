import type { Metadata } from "next";
import { Inter, Oxanium } from "next/font/google";
import "./globals.css";
import 'easymde/dist/easymde.min.css';

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ['latin']
});

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "Wamil - What am I learning",
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
        className={`${interSans.variable} ${oxanium.variable} antialiased bg-black-100 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
