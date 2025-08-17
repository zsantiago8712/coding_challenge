import { z } from "zod";
import { Sentiment } from "@/lib/graphql/graphql";

export const createNoteSchema = z.object({
  text: z
    .string()
    .min(1, "Note text is required")
    .min(3, "Note must be at least 3 characters long")
    .max(1000, "Note must be less than 1000 characters")
    .trim()
    .refine(
      (text) => text.length > 0 && text.trim().length > 0,
      "Note cannot be empty or contain only whitespace"
    )
    .refine((text) => !/^\s*$/.test(text), "Note cannot contain only spaces"),
  sentiment: z.enum(Sentiment, {
    message: "Please select a valid sentiment",
  }),
});

export type CreateNoteData = z.infer<typeof createNoteSchema>;
