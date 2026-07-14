'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { addComment } from '@/services/ticketService';
import { createCommentSchema, CreateCommentFormData } from '@/utils/validators';
import { parseApiError } from '@/utils/errors';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

interface CommentFormProps {
  ticketId: string;
  onCommentAdded: () => void;
}

export function CommentForm({ ticketId, onCommentAdded }: CommentFormProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCommentFormData>({
    resolver: zodResolver(createCommentSchema),
  });

  const onSubmit = async (data: CreateCommentFormData) => {
    setApiError(null);
    try {
      await addComment(ticketId, { message: data.message });
      reset({ message: '' });
      onCommentAdded();
    } catch (error) {
      const parsed = parseApiError(error);
      setApiError(parsed.message);
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

      <Button type="submit" isLoading={isSubmitting}>
        Post Comment
      </Button>
    </form>
  );
}
