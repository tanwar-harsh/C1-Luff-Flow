'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/domain';
import { canViewTickets } from '@/utils/permissions';

interface RequireAuthProps {
  children: React.ReactNode;
  permission?: (role: Role | undefined) => boolean;
  fallbackHref?: string;
}

export function RequireAuth({
  children,
  permission = canViewTickets,
  fallbackHref = '/',
}: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!permission(user.role)) {
      router.replace(fallbackHref);
    }
  }, [user, isLoading, permission, router, pathname, fallbackHref]);

  if (isLoading || !user || !permission(user.role)) {
    return (
      <p className="py-24 text-center text-body-md text-on-surface-variant">
        Loading...
      </p>
    );
  }

  return <>{children}</>;
}
