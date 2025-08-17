import { z } from "zod";
import { Sentiment } from "@/lib/hooks";

const sentimentValues = Object.values(Sentiment);

/**
 * Schema de validación para crear/editar notas
 */
export const noteFormSchema = z.object({
  text: z
    .string()
    .min(1, "Text is required")
    .min(3, "Text must be at least 3 characters")
    .max(1000, "Text must be less than 1000 characters")
    .trim(),

  sentiment: z.enum(sentimentValues, {
    message: "Please select a valid sentiment",
  }),
});

/**
 * Tipo inferido del schema para usar en el formulario
 */
export type NoteFormData = z.infer<typeof noteFormSchema>;

/**
 * Schema para validar una nota completa (con id y dateCreated)
 */
export const noteSchema = noteFormSchema.extend({
  id: z.string().min(1, "ID is required"),
  dateCreated: z.string().datetime("Invalid date format"),
});

export type NoteData = z.infer<typeof noteSchema>;

/**
 * Validaciones personalizadas adicionales
 */
export const noteValidations = {
  /**
   * Valida que el texto no contenga solo espacios en blanco
   */
  hasContent: (text: string) => {
    return text.trim().length > 0;
  },

  /**
   * Valida que el texto no contenga caracteres especiales peligrosos
   */
  isSafeText: (text: string) => {
    const dangerousChars = /<script|javascript:|data:/i;
    return !dangerousChars.test(text);
  },

  /**
   * Valida la longitud del texto con mensajes personalizados
   */
  validateTextLength: (text: string) => {
    if (text.length < 3) {
      return {
        isValid: false,
        message: "Text is too short (minimum 3 characters)",
      };
    }
    if (text.length > 1000) {
      return {
        isValid: false,
        message: "Text is too long (maximum 1000 characters)",
      };
    }
    return { isValid: true, message: "" };
  },

  /**
   * Valida que el sentimiento sea válido
   */
  isValidSentiment: (sentiment: string): sentiment is Sentiment => {
    return Object.values(Sentiment).includes(sentiment as Sentiment);
  },
};
