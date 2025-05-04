'use client';
import type React from 'react';
import './globals.css';
import App from '../App';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <div>
      <App>{children}</App>
    </div>
    // </html>
  );
}
