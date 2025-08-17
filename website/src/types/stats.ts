import { z } from "zod";
import { Sentiment } from "@/lib/graphql/graphql";

/**
 * Zod schema for sentiment count validation
 */
export const sentimentCountSchema = z.object({
  sentiment: z.nativeEnum(Sentiment),
  count: z.number().int().min(0, "Count must be a non-negative integer"),
});

/**
 * Zod schema for notes statistics validation
 */
export const notesStatsSchema = z.object({
  totalNotes: z.number().int().min(0, "Total notes must be a non-negative integer"),
  notesBySentiment: z.array(sentimentCountSchema),
  mostPopularSentiment: z.nativeEnum(Sentiment).nullable(),
  notesToday: z.number().int().min(0, "Notes today must be a non-negative integer"),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type SentimentCountData = z.infer<typeof sentimentCountSchema>;
export type NotesStatsData = z.infer<typeof notesStatsSchema>;

/**
 * Re-export GraphQL types for convenience
 */
export type { NotesStats, SentimentCount } from "@/lib/graphql/graphql";

/**
 * Validation helper functions
 */
export const validateNotesStats = (data: unknown) => {
  return notesStatsSchema.safeParse(data);
};

export const validateSentimentCount = (data: unknown) => {
  return sentimentCountSchema.safeParse(data);
};
