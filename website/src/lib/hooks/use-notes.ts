"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "../graphql-client";
import { GET_NOTES, CREATE_NOTE } from "../graphql/queries";
import type {
  Sentiment,
  Note,
  NoteQueryResults,
  QueryGetNotesArgs,
  MutationCreateNoteArgs,
} from "../graphql/graphql";

/**
 * Returns a hook that fetches a list of notes from the server,
 * optionally filtered by sentiment and paginated by limit.
 *
 * @param {Sentiment | null} [sentiment] - Optional filter for the
 * sentiment of the notes.
 * @param {number} [limit] - The number of notes to fetch. Defaults to 10.
 * @param {string | null} [nextToken] - The token to use for pagination.
 * @return {UseQueryResult<NoteQueryResults>} A hook that provides
 * the list of notes and various querying methods.
 */
export function useNotes(
  sentiment?: Sentiment | null,
  limit?: number,
  nextToken?: string | null
) {
  return useQuery({
    queryKey: ["notes", sentiment, limit, nextToken],
    queryFn: async (): Promise<NoteQueryResults | null> => {
      const variables: QueryGetNotesArgs = {
        sentiment: sentiment || undefined,
        limit: limit || 10,
        nextToken: nextToken || undefined,
      };

      const response = await client.graphql({
        query: GET_NOTES,
        variables,
      });

      // Verificar si es un GraphQLResult antes de acceder a data
      if ("data" in response) {
        return response.data.getNotes;
      }
      return null;
    },
    enabled: true,
  });
}

/**
 * Custom hook for creating a note.
 *
 * Returns a mutation hook that accepts a `MutationCreateNoteArgs` object and
 * returns a `Note | null` on success. Invalidates the "notes" query cache on
 * success. Logs any errors to the console.
 *
 * @returns {MutationHook<Note | null>} The mutation hook.
 */
export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      variables: MutationCreateNoteArgs
    ): Promise<Note | null> => {
      const response = await client.graphql({
        query: CREATE_NOTE,
        variables,
      });

      // Verificar si es un GraphQLResult antes de acceder a data
      if ("data" in response) {
        return response.data.createNote;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
    },
  });
}
