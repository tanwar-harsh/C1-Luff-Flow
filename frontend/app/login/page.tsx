import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="p-8 text-body-md">Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
