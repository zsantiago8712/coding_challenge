"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Note } from "@/lib/graphql/graphql";
import { SentimentIcon } from "./sentiment-icon";
import { cn } from "@/lib/utils";
import { getSentimentConfig } from "@/lib/constants/sentiments";

interface NoteCardProps {
  note: Note;
  setNote: (note: Note) => void;
}

export function NoteCard({ note, setNote }: NoteCardProps) {
  const sentimentConfig = getSentimentConfig(note.sentiment);
  const dateCreated = new Date(note.dateCreated);

  return (
    <Card
      className={cn(
        "group transition-all duration-500 hover:shadow-xl cursor-pointer h-[280px] flex flex-col",
        "transform hover:scale-105 hover:-translate-y-2",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
        "hover:border-gray-300 dark:hover:border-gray-600",
        "will-change-transform",
        sentimentConfig.styles.border,
        sentimentConfig.styles.hover
      )}
      onClick={() => setNote(note)}
    >
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{dateCreated.toLocaleDateString("es-MX")}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 text-xs transition-all duration-300",
                "group-hover:scale-110 group-hover:shadow-md",
                sentimentConfig.styles.badge
              )}
            >
              <SentimentIcon sentiment={note.sentiment} className="w-3 h-3" />
              <span className="capitalize">{note.sentiment}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          {note.text.length > 120 ? (
            <div className="relative h-20 overflow-hidden">
              <div className="absolute inset-0 group-hover:animate-scroll-text">
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {note.text}
                </p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed h-20">
              {note.text}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 mt-auto border-t border-gray-100 dark:border-gray-800">
          <span>{note.text.split(" ").length} words</span>
          <span>~{Math.ceil(note.text.split(" ").length / 200)} min read</span>
        </div>
      </CardContent>
    </Card>
  );
}
