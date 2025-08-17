"use client";

import { useState, useCallback } from "react";
import { 
  noteSchema, 
  createNoteSchema, 
  updateNoteSchema,
  type NoteFormData,
  type CreateNoteData,
  type UpdateNoteData
} from "@/types/note";
import type { ZodError } from "zod";

/**
 * Hook for note validation using Zod schemas
 */
export function useNoteValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  /**
   * Validate note data and return validation result
   */
  const validateNote = useCallback((data: unknown) => {
    const result = noteSchema.safeParse(data);
    
    if (result.success) {
      setErrors({});
      setIsValid(true);
      return { success: true, data: result.data as NoteFormData, errors: {} };
    } else {
      const fieldErrors = formatZodErrors(result.error);
      setErrors(fieldErrors);
      setIsValid(false);
      return { success: false, data: null, errors: fieldErrors };
    }
  }, []);

  /**
   * Validate data for creating a new note
   */
  const validateCreateNote = useCallback((data: unknown) => {
    const result = createNoteSchema.safeParse(data);
    
    if (result.success) {
      setErrors({});
      setIsValid(true);
      return { success: true, data: result.data as CreateNoteData, errors: {} };
    } else {
      const fieldErrors = formatZodErrors(result.error);
      setErrors(fieldErrors);
      setIsValid(false);
      return { success: false, data: null, errors: fieldErrors };
    }
  }, []);

  /**
   * Validate data for updating a note
   */
  const validateUpdateNote = useCallback((data: unknown) => {
    const result = updateNoteSchema.safeParse(data);
    
    if (result.success) {
      setErrors({});
      setIsValid(true);
      return { success: true, data: result.data as UpdateNoteData, errors: {} };
    } else {
      const fieldErrors = formatZodErrors(result.error);
      setErrors(fieldErrors);
      setIsValid(false);
      return { success: false, data: null, errors: fieldErrors };
    }
  }, []);

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  /**
   * Get error message for a specific field
   */
  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName] || "";
  }, [errors]);

  /**
   * Check if a specific field has an error
   */
  const hasFieldError = useCallback((fieldName: string) => {
    return Boolean(errors[fieldName]);
  }, [errors]);

  return {
    errors,
    isValid,
    validateNote,
    validateCreateNote,
    validateUpdateNote,
    clearErrors,
    getFieldError,
    hasFieldError,
  };
}

/**
 * Helper function to format Zod errors into a flat object
 */
function formatZodErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const fieldName = err.path.join(".");
    fieldErrors[fieldName] = err.message;
  });
  
  return fieldErrors;
}
