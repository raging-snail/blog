import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import getPostsWithRT from "./getPostsWithRT";

/**
 * Returns posts that are eligible to be shown to users, sorted by "last updated"
 * descending (uses `modDatetime` when present, otherwise `pubDatetime`).
 * Attaches reading time (via remarkReadingTime frontmatter) before filtering.
 *
 * Note: filtering respects drafts and scheduled posts via `postFilter()`.
 */
export async function getSortedPosts(posts: CollectionEntry<"posts">[]) {
  const postsWithRT = await getPostsWithRT(posts);
  return postsWithRT
    .filter(postFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
}
