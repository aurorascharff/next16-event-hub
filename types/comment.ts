import type { getCommentsByEvent } from '@/features/comment/comment-queries';

export type Comment = Awaited<ReturnType<typeof getCommentsByEvent>>[number];
