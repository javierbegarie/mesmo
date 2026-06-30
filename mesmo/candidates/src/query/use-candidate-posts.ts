import { useQuery } from '@tanstack/react-query';

import type { ApiPost, Post } from '../util/types';

export const candidatePostsQueryKey = (id: string) =>
  ['candidate-posts', id] as const;

const POSTS_URL = (id: string) =>
  `https://jsonplaceholder.typicode.com/posts?userId=${id}`;

async function fetchCandidatePosts(id: string): Promise<Post[]> {
  const response = await fetch(POSTS_URL(id));
  if (!response.ok) {
    throw new Error(`Failed to load posts for candidate ${id} (${response.status})`);
  }

  const posts = (await response.json()) as ApiPost[];
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
  }));
}

/** Fetches the posts authored by a candidate via TanStack Query. */
export function useCandidatePosts(id: string) {
  return useQuery({
    queryKey: candidatePostsQueryKey(id),
    queryFn: () => fetchCandidatePosts(id),
  });
}
