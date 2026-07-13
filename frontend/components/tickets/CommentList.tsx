'use client';

import { CommentWithAuthor } from '@/types/domain';
import { formatDate } from '@/utils/format';

interface CommentListProps {
  comments: CommentWithAuthor[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">No comments yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg bg-surface-container-low px-4 py-3"
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-body-md font-semibold text-foreground">
              {comment.createdBy.name}
            </span>
            <span className="font-mono text-label-md text-on-surface-variant">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-body-md text-foreground">{comment.message}</p>
        </div>
      ))}
    </div>
  );
}
