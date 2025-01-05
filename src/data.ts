import PQueue from 'p-queue';
import { createStorage } from 'unstorage';
import IDBDriver from 'unstorage/drivers/indexedb';

export const Ranks = ['Newbie', 'Pupil', 'Specialist', 'Expert', 'Candidate Master', 'Master', 'International Master', 'Grandmaster', 'International Grandmaster', 'Legendary Grandmaster', '?'] as const;
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
  '?': 4000,
};
export const RankColor: Record<Rank, string> = {
  'Newbie': 'gray',
  'Pupil': 'green',
  'Specialist': 'blue',
  'Expert': '#03A89E',
  'Candidate Master': '#A0AA0A',
  'Master': '#FF8C00',
  'International Master': '#FF8C00',
  'Grandmaster': 'red',
  'International Grandmaster': 'red',
  'Legendary Grandmaster': 'black',
  '?': 'unset',
};

export function inferRank(rating: number): Rank | undefined {
  if (rating <= 0)
    return undefined;
  for (let i = 0; i < Ranks.length; i++) {
    if (rating < RankRating[Ranks[i]])
      return Ranks[i - 1];
  }
  return '?';
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
const ratingCache = createStorage<RatingChange[]>({
  driver: IDBDriver({
    dbName: 'rating',
    storeName: 'history',
  }),
});

export async function fetchRatingChanges(handle: string, retry: number, cache = true): Promise<RatingChange[]> {
  if (cache && await ratingCache.has(handle))
    return (await ratingCache.get(handle))!;

  return queue.add(async () => {
    const url = new URL('https://codeforces.com/api/user.rating');
    url.searchParams.append('handle', handle);
    const res = await fetch(url);
    if (res.status === 429 || res.status === 503) {
      if (retry === 0)
        throw new Error('Rate limited');
      return fetchRatingChanges(handle, retry - 1);
    }
    const data = await res.json();
    if (data.status !== 'OK')
      throw new Error(data.comment);
    ratingCache.setItemRaw(handle, data.result);
    return data.result;
  });
}
