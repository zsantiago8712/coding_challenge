import { useQuery } from '@tanstack/react-query';
import { client } from '../graphql-client';
import { GET_NOTES_STATS } from '../graphql/queries';
import type { NotesStats } from '../graphql/graphql';

export function useNotesStats() {
    return useQuery({
        queryKey: ['notes-stats'],
        queryFn: async (): Promise<NotesStats | null> => {
            const response = await client.graphql({
                query: GET_NOTES_STATS,
            });

            if ('data' in response) {
                console.log('Notes stats data:', response.data.getNotesStats);
                return response.data.getNotesStats;
            } else {
                console.log('Notes stats error:', response);
            }
            return null;
        },
    });
}
