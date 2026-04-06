export type Question = {
  id: string;
  content: string;
  userName: string;
  votes: number;
  hasVoted: boolean;
  eventSlug: string;
  createdAt: Date | string;
};

export type Comment = {
  id: string;
  content: string;
  userName: string;
  likes: number;
  hasLiked: boolean;
  eventSlug: string;
  createdAt: Date | string;
};

export type SortValue = 'top' | 'newest';
