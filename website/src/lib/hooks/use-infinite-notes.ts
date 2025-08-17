"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "../graphql-client";
import { GET_NOTES } from "../graphql/queries";
import type {
  Sentiment,
  QueryGetNotesArgs,
  NoteQueryResults,
} from "../graphql/graphql";

/**
 * Returns a hook that fetches an infinite list of notes from the server,
 * paginated by `limit` at a time.
 *
 * @param {Sentiment | null} [sentiment] - Optional filter for the
 * sentiment of the notes.
 * @param {number} [limit=10] - The number of notes to fetch per page.
 * @return {UseInfiniteQueryResult<NoteQueryResults>} A hook that provides
 * the infinite list of notes and various pagination and querying methods.
 */
export function useInfiniteNotes(
  sentiment?: Sentiment | null,
  limit: number = 10,
) {
  return useInfiniteQuery({
    queryKey: ["infinite-notes", sentiment],
    queryFn: async ({ pageParam }): Promise<NoteQueryResults | null> => {
      const variables: QueryGetNotesArgs = {
        sentiment: sentiment || undefined,
        limit,
        nextToken: pageParam || undefined,
      };

      const response = await client.graphql({
        query: GET_NOTES,
        variables,
      });

      if ("data" in response) {
        return response.data.getNotes;
      }
      return null;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage?.nextToken || null;
    },
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      notes: data.pages.flatMap((page) => page?.items?.filter(Boolean) || []),
    }),
  });
}
