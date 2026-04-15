import type { Metadata } from 'next';
import { satoshi } from '@/fonts';
import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'Lumind',
  description: 'Lumind — AI-powered product',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={satoshi.variable}>
      <body>{children}</body>
    </html>
  );
}
