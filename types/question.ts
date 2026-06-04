import type { getQuestionsByEvent } from '@/features/question/question-queries';

export type Question = Awaited<ReturnType<typeof getQuestionsByEvent>>[number];
export type SortValue = 'top' | 'newest';
