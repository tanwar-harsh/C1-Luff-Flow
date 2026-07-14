import { Suspense } from 'react';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <Suspense fallback={<p className="p-8 text-body-md">Loading...</p>}>
      <SignupForm />
    </Suspense>
  );
}
