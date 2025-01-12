import PQueue from 'p-queue';
import { createStorage } from 'unstorage';
import IDBDriver from 'unstorage/drivers/indexedb';

export const HANDLE_FORMAT = /^[\w-]{3,24}$/;

export const Ranks = ['Newbie', 'Pupil', 'Specialist', 'Expert', 'Candidate Master', 'Master', 'International Master', 'Grandmaster', 'International Grandmaster', 'Legendary Grandmaster', 'Tourist'] as const;
export type Rank = typeof Ranks[number];
export const RankRating: Record<Rank, number> = {
  'Newbie': 0,
  'Pupil': 1200,
  'Specialist': 1400,
  'Expert': 1600,
  'Candidate Master': 1900,
  'Master': 2200,
  'International Master': 2300,
  'Grandmaster': 2400,
  'International Grandmaster': 2600,
  'Legendary Grandmaster': 2900,
  'Tourist': 4000,
};

export function inferRank(rating: number): Rank | undefined {
  if (rating <= 0)
    return undefined;
  for (let i = 0; i < Ranks.length; i++) {
    if (rating < RankRating[Ranks[i]])
      return Ranks[i - 1];
  }
  return 'Tourist';
}

export interface RatingChange {
  contestId: number
  contestName: string
  handle: string
  rank: number
  ratingUpdateTimeSeconds: number
  oldRating: number
  newRating: number
}

const queue = new PQueue({ concurrency: 1, interval: 1000 });
const ratingCache = createStorage<{
  expiresAt: number
  data: RatingChange[]
}>({
  driver: IDBDriver({
    dbName: 'rating',
    storeName: 'history',
  }),
});

const CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours

export class ApiError extends Error {}

export async function fetchRatingChanges(handle: string, retry: number = 0, cache = true): Promise<RatingChange[]> {
  if (cache && await ratingCache.has(handle)) {
    const cached = (await ratingCache.get(handle))!;
    if (cached.expiresAt > Date.now())
      return cached.data;
  }

  return queue.add(async () => {
    const url = new URL('https://codeforces.com/api/user.rating');
    url.searchParams.append('handle', handle);
    const res = await fetch(url);
    if (res.status === 429 || res.status === 503) {
      if (retry === 0)
        throw new ApiError('Rate limited');
      return fetchRatingChanges(handle, retry - 1);
    }
    const data = await res.json();
    if (data.status !== 'OK')
      throw new Error(data.comment);
    if (!data.result.length)
      throw new ApiError(`User ${handle} is unrated`);
    ratingCache.setItemRaw(handle, {
      expiresAt: Date.now() + CACHE_EXPIRY,
      data: data.result,
    });
    return data.result;
  });
}
