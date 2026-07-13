'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Tickets' },
  { href: '/tickets/new', label: 'Create' },
  { href: '/search', label: 'Search' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-outline-nav bg-surface-container-lowest">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-4 md:px-margin">
        <Link href="/" className="text-headline-sm text-foreground">
          Luff-Flow
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-body-md transition-colors ${
                  isActive
                    ? 'border-b-2 border-primary font-semibold text-primary'
                    : 'text-on-surface-variant hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
