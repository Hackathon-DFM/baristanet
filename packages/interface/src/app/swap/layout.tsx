'use client';

import App from '../App';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    <div>
      <App>{children}</App>
    </div>
    // </html>
  );
}
