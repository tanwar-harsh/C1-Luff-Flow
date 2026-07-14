'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/domain';

interface NavLink {
  href: string;
  label: string;
  canAccess: (role: Role | undefined) => boolean;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Tickets', canAccess: () => true },
  { href: '/tickets/new', label: 'Create', canAccess: (role) => role === 'AGENT' || role === 'ADMIN' },
  { href: '/search', label: 'Search', canAccess: () => true },
  { href: '/admin/users', label: 'Users', canAccess: (role) => role === 'ADMIN' },
];

function NavTab({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-body-md transition-colors ${
        isActive
          ? 'border-b-2 border-primary font-semibold text-primary'
          : 'text-on-surface-variant hover:text-foreground'
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const visibleNavLinks = user
    ? navLinks.filter((link) => link.canAccess(user.role))
    : [];

  return (
    <header className="border-b border-outline-nav bg-surface-container-lowest transition-colors duration-200">
      <div className="mx-auto grid h-14 max-w-content grid-cols-[1fr_auto_1fr] items-center px-4 md:px-margin">
        <Link href="/" className="justify-self-start text-headline-sm text-foreground">
          Luff-Flow
        </Link>

        <nav className="flex items-center justify-center gap-4 md:gap-6">
          {visibleNavLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <NavTab key={link.href} href={link.href} label={link.label} isActive={isActive} />
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3 justify-self-end">
          {!isLoading && (
            user ? (
              <>
                <span className="hidden text-body-md text-on-surface-variant sm:inline">
                  {user.name}
                </span>
                <Button variant="ghost" type="button" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-body-md font-medium text-on-surface-variant hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button className="hidden h-9 px-4 sm:inline-flex">Get Started</Button>
                </Link>
              </>
            )
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
