"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Note } from "@/lib/graphql/graphql";
import { SentimentIcon } from "./sentiment-icon";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const sentimentStyles = {
    happy: {
      border: "border-l-green-400 hover:border-green-400",
      badge:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      hover: "hover:shadow-green-200/50 dark:hover:shadow-green-900/50",
    },
    sad: {
      border: "border-l-blue-400 hover:border-blue-400",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      hover: "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50",
    },
    neutral: {
      border: "border-l-gray-400 hover:border-gray-400",
      badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      hover: "hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50",
    },
    angry: {
      border: "border-l-red-400 hover:border-red-400",
      badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      hover: "hover:shadow-red-200/50 dark:hover:shadow-red-900/50",
    },
  };

  const dateCreated = new Date(note.dateCreated);

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-xl cursor-pointer h-[280px] flex flex-col transform hover:scale-105",
        "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
        "hover:border-gray-300 dark:hover:border-gray-600",
        sentimentStyles[note.sentiment].border,
        sentimentStyles[note.sentiment].hover
      )}
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
                "flex items-center gap-1.5 px-2 py-1 text-xs transition-all duration-200",
                sentimentStyles[note.sentiment].badge
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
