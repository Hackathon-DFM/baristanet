import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Token Swap Interface',
  description: 'A modern token swap interface',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          'bg-gradient-to-b from-[#0f172a] to-[#020617] text-white min-h-screen'
        }
      >
        <div className={inter.className}>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
