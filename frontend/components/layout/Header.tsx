'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const navLinks = [
  { href: '/', label: 'Tickets' },
  { href: '/tickets/new', label: 'Create' },
  { href: '/search', label: 'Search' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout, isLoading } = useAuth();

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="border-b border-outline-nav bg-surface-container-lowest transition-colors duration-200">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-4 md:px-margin">
        <Link href="/" className="text-headline-sm text-foreground">
          Luff-Flow
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          {user &&
            navLinks.map((link) => {
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
          {isAdmin && (
            <Link
              href="/admin/users"
              className={`text-body-md transition-colors ${
                pathname.startsWith('/admin/users')
                  ? 'border-b-2 border-primary font-semibold text-primary'
                  : 'text-on-surface-variant hover:text-foreground'
              }`}
            >
              Users
            </Link>
          )}
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-body-md text-on-surface-variant sm:inline">
                  {user.name}
                </span>
                <Button variant="ghost" type="button" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-body-md font-medium text-on-surface-variant hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button className="hidden h-9 px-4 sm:inline-flex">Get Started</Button>
                </Link>
              </div>
            )
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
