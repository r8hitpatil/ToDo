import type { Card } from '@prisma/client';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  issues?: any[];
  count?: number;
  message?: string;
  success?: boolean;
};

export type CardResponse = ApiResponse<Card>;
export type CardsResponse = ApiResponse<Card[]>;