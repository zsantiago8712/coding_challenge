"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../graphql-client";
import { CREATE_NOTE } from "../graphql/queries";
import type { Note, MutationCreateNoteArgs } from "../graphql/graphql";

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

      if ("data" in response) {
        return response.data.createNote;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["infinite-notes"],
      });
      queryClient.invalidateQueries({
        queryKey: ["notes-stats"],
      });
    },
    onError: (error) => {
      console.error("Error creating note:", error);
    },
  });
}
