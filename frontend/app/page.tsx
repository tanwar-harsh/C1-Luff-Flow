'use client';

import { useAuth } from '@/context/AuthContext';
import { LandingPage } from '@/components/landing/LandingPage';
import { TicketListView } from '@/components/tickets/TicketListView';
import { RequireAuth } from '@/components/auth/RequireAuth';

export default function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <p className="py-24 text-center text-body-md text-on-surface-variant">Loading...</p>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <RequireAuth>
      <TicketListView />
    </RequireAuth>
  );
}
