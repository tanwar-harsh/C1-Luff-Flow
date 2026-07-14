'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { UserSummary } from '@/types/domain';
import {
  createUserSchema,
  CreateUserFormData,
  updateUserSchema,
  UpdateUserFormData,
} from '@/utils/validators';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

const roleOptions = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'AGENT', label: 'Agent' },
  { value: 'USER', label: 'User' },
];

interface CreateUserFormProps {
  onSubmit: (data: CreateUserFormData) => Promise<void>;
  onCancel: () => void;
  apiError: string | null;
}

export function CreateUserForm({ onSubmit, onCancel, apiError }: CreateUserFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'USER' },
  });

  const handleFormSubmit = async (data: CreateUserFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      const parsed = error as { fieldErrors?: Record<string, string> };
      if (parsed.fieldErrors) {
        for (const [field, message] of Object.entries(parsed.fieldErrors)) {
          setError(field as keyof CreateUserFormData, { message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      {apiError && <Alert message={apiError} />}

      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input
        label="Password"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Select label="Role" options={roleOptions} error={errors.role?.message} {...register('role')} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          Create User
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

interface EditUserFormProps {
  user: UserSummary;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  onCancel: () => void;
  apiError: string | null;
}

export function EditUserForm({ user, onSubmit, onCancel, apiError }: EditUserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    },
  });

  useEffect(() => {
    reset({ name: user.name, email: user.email, role: user.role, password: '' });
  }, [user, reset]);

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    const payload = { ...data };
    if (!payload.password) delete payload.password;
    try {
      await onSubmit(payload);
    } catch (error) {
      const parsed = error as { fieldErrors?: Record<string, string> };
      if (parsed.fieldErrors) {
        for (const [field, message] of Object.entries(parsed.fieldErrors)) {
          setError(field as keyof UpdateUserFormData, { message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      {apiError && <Alert message={apiError} />}

      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input
        label="New Password (optional)"
        type="password"
        placeholder="Leave blank to keep current"
        error={errors.password?.message}
        {...register('password')}
      />
      <Select label="Role" options={roleOptions} error={errors.role?.message} {...register('role')} />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          Save Changes
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
