import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MultiversXProvider } from '@/components/MultiversXProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fortnight - MultiversX DeFi Platform',
  description: 'A comprehensive AI-driven DeFi platform built on the MultiversX blockchain',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MultiversXProvider>
          {children}
        </MultiversXProvider>
      </body>
    </html>
  );
} 