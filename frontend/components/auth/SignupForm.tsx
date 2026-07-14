'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/context/AuthContext';
import { registerSchema, RegisterFormData } from '@/utils/validators';
import { parseApiError } from '@/utils/errors';

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, user } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const redirect = searchParams.get('redirect') ?? '/';

  useEffect(() => {
    if (user) {
      router.replace(redirect);
    }
  }, [user, router, redirect]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      await registerUser(data);
      router.push(redirect);
    } catch (err) {
      const parsed = parseApiError(err);
      setApiError(parsed.message);
      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (field in registerSchema.shape) {
          setError(field as keyof RegisterFormData, { message });
        }
      }
    }
  };

  if (user) {
    return null;
  }

  const loginHref =
    redirect !== '/' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login';

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-headline-md text-foreground">Create your account</h1>
        <p className="text-body-md text-on-surface-variant">
          Precision systems for professional performance.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {apiError && <Alert message={apiError} />}

        <Input
          label="Full Name"
          autoComplete="name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          className="h-12"
          {...register('name')}
        />

        <Input
          label="Work Email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          className="h-12"
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          autoComplete="new-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" isLoading={isSubmitting} className="mt-2 h-12 w-full">
          Create account
        </Button>

        <AuthDivider />
        <SocialAuthButtons variant="signup" />
      </form>

      <p className="mt-6 text-center text-body-md text-on-surface-variant">
        Already have an account?{' '}
        <Link href={loginHref} className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
