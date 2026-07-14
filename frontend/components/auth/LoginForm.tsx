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
import { loginSchema, LoginFormData } from '@/utils/validators';
import { parseApiError } from '@/utils/errors';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();
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
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      await login(data);
      router.push(redirect);
    } catch (err) {
      setApiError(parseApiError(err).message);
    }
  };

  if (user) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-headline-md text-foreground md:text-[32px] md:leading-10">
          Welcome back
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Please enter your details to sign in to Luff-Flow.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {apiError && <Alert message={apiError} />}

        <Input
          label="Work Email"
          type="email"
          autoComplete="email"
          placeholder="name@company.com"
          error={errors.email?.message}
          className="h-12"
          {...register('email')}
        />

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant">Password</span>
            <span className="text-label-sm text-primary opacity-60" title="Coming soon">
              Forgot password?
            </span>
          </div>
          <PasswordInput
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-2 h-12 w-full">
          Log in
        </Button>

        <AuthDivider />
        <SocialAuthButtons variant="login" />
      </form>

      <p className="mt-6 text-center text-body-md text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link
          href={redirect !== '/' ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup'}
          className="font-medium text-primary hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
}
