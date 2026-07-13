import type { Metadata } from 'next';
import { Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import './globals.css';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  weight: ['400', '500', '600', '700'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Luff-Flow — Support Ticket Manager',
  description: 'Support ticket management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${hanken.variable} ${jetbrains.variable} font-sans`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
