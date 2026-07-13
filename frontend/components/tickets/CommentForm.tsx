'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { addComment } from '@/services/ticketService';
import { UserSummary } from '@/types/domain';
import { createCommentSchema, CreateCommentFormData } from '@/utils/validators';
import { parseApiError } from '@/utils/errors';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface CommentFormProps {
  ticketId: string;
  users: UserSummary[];
  onCommentAdded: () => void;
}

export function CommentForm({ ticketId, users, onCommentAdded }: CommentFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      createdBy: users.find((u) => u.role === 'AGENT')?.id ?? users[0]?.id ?? '',
    },
  });

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.name} (${u.role})`,
  }));

  const onSubmit = async (data: CreateCommentFormData) => {
    setApiError(null);
    try {
      await addComment(ticketId, data);
      reset({ message: '', createdBy: data.createdBy });
      onCommentAdded();
    } catch (error) {
      const parsed = parseApiError(error);
      setApiError(parsed.message);
      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        if (field in createCommentSchema.shape) {
          setError(field as keyof CreateCommentFormData, { message });
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {apiError && <Alert message={apiError} />}

      <Textarea
        label="Add Comment"
        placeholder="Write your comment..."
        error={errors.message?.message}
        {...register('message')}
      />

      <Select
        label="Comment as"
        options={userOptions}
        error={errors.createdBy?.message}
        {...register('createdBy')}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Post Comment
      </Button>
    </form>
  );
}
