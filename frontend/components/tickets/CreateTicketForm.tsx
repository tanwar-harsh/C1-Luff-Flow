'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createTicket } from '@/services/ticketService';
import { UserSummary } from '@/types/domain';
import { createTicketSchema, CreateTicketFormData } from '@/utils/validators';
import { parseApiError } from '@/utils/errors';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface CreateTicketFormProps {
  users: UserSummary[];
}

const priorityOptions = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

export function CreateTicketForm({ users }: CreateTicketFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: 'MEDIUM',
    },
  });

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.role})`,
  }));

  const onSubmit = async (data: CreateTicketFormData) => {
    setApiError(null);
    try {
      const ticket = await createTicket({
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignedTo: data.assignedTo || null,
      });
      router.push(`/tickets/${ticket.id}`);
    } catch (error) {
      const parsed = parseApiError(error);
      setApiError(parsed.message);
      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (field in createTicketSchema.shape) {
          setError(field as keyof CreateTicketFormData, { message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-form flex-col gap-4">
      {apiError && <Alert message={apiError} />}

      <Input
        label="Title"
        placeholder="Brief summary of the issue"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Description"
        placeholder="Detailed description of the issue"
        error={errors.description?.message}
        {...register('description')}
      />

      <Select
        label="Priority"
        options={priorityOptions}
        error={errors.priority?.message}
        {...register('priority')}
      />

      <Select
        label="Assign To (optional)"
        options={userOptions}
        placeholder="Unassigned"
        error={errors.assignedTo?.message}
        {...register('assignedTo')}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isSubmitting}>
          Create Ticket
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
