import type { getCommentsByEvent } from '@/data/queries/comment';
import type { getQuestionsByEvent } from '@/data/queries/question';

export type Comment = Awaited<ReturnType<typeof getCommentsByEvent>>[number];
export type Question = Awaited<ReturnType<typeof getQuestionsByEvent>>[number];
export type SortValue = 'top' | 'newest';
