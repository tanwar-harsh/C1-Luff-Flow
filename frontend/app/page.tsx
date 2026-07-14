'use client';

import { useAuth } from '@/context/AuthContext';
import { LandingPage } from '@/components/landing/LandingPage';
import { TicketListView } from '@/components/tickets/TicketListView';

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

  return <TicketListView />;
}
