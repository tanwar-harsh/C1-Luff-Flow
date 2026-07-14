'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 md:px-margin">
        <Link href="/" className="text-headline-sm font-bold tracking-tight text-primary md:text-headline-md">
          Luff-Flow
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-grow items-center justify-center px-4 pb-8 pt-24">
        <div className="w-full max-w-[440px] rounded-lg border border-outline-variant bg-surface-container-lowest p-6 transition-colors md:p-8">
          {children}
        </div>
      </main>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant bg-surface-container-lowest px-4 py-6 md:flex-row md:px-margin">
        <p className="text-label-sm text-secondary">© 2024 Luff-Flow Support Systems</p>
        <div className="flex gap-6">
          <span className="text-label-sm text-secondary hover:underline">Privacy Policy</span>
          <span className="text-label-sm text-secondary hover:underline">Terms of Service</span>
          <span className="text-label-sm text-secondary hover:underline">Help Center</span>
        </div>
      </footer>
    </div>
  );
}
