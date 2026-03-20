import type { SetStateAction } from 'react';

export type PaginationUpdateT = {
  page?: SetStateAction<number>;
  limit?: number;
};
