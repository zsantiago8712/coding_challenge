"use client";

import { useQuery } from "@tanstack/react-query";
import { client } from "../graphql-client";
import { GET_NOTES_STATS } from "../graphql/queries";
import type { NotesStats } from "../graphql/graphql";

/**
 * Hook to fetch notes statistics including:
 * - Total notes count
 * - Notes count by sentiment
 * - Most popular sentiment
 * - Notes created today
 * 
 * @returns UseQueryResult with NotesStats data
 */
export function useNotesStats() {
  return useQuery({
    queryKey: ["notes-stats"],
    queryFn: async (): Promise<NotesStats | null> => {
      const response = await client.graphql({
        query: GET_NOTES_STATS,
      });

      if ("data" in response) {
        return response.data.getNotesStats;
      }
      return null;
    },
    // Refetch every 30 seconds to keep stats fresh
    refetchInterval: 30000,
    // Keep data fresh in background
    staleTime: 10000,
  });
}
