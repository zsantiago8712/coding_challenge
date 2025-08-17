"use client";

import type { Note } from "@/lib/graphql/graphql";
import { NoteCard } from "./note-card";
import { Skeleton } from "@/components/ui/skeleton";

interface NotesGridProps {
  notes: Note[];
  isLoading: boolean;
  setNote: (note: Note) => void;
}

export function NotesGrid({ notes, isLoading, setNote }: NotesGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <Skeleton className="h-[280px] rounded-lg bg-muted/50 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
        </div>
        <p className="text-muted-foreground text-lg font-medium mb-2">
          No notes match your filter
        </p>
        <p className="text-muted-foreground">
          Try selecting a different sentiment or create a new note!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {notes.map((note, index) => (
        <div
          key={note.id}
          className="animate-fade-in-delayed"
          style={{
            animationDelay: `${Math.min(index * 0.08, 1.2)}s`,
          }}
        >
          <NoteCard note={note} setNote={setNote} />
        </div>
      ))}
    </div>
  );
}
