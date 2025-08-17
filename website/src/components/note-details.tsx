"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Note } from "@/lib/graphql/graphql";
import { SentimentIcon } from "./sentiment-icon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NoteDetailModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteDetailModal({
  note,
  isOpen,
  onClose,
}: NoteDetailModalProps) {
  if (!note) return null;

  const sentimentStyles = {
    happy: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    sad: "bg-gradient-to-r from-blue-500 to-sky-500 text-white",
    neutral: "bg-gradient-to-r from-slate-500 to-gray-500 text-white",
    angry: "bg-gradient-to-r from-red-500 to-rose-500 text-white",
  };

  const dateCreated = new Date(note.dateCreated);
  const countWords = note.text.split(" ").length;
  const countMinutes = Math.ceil(countWords / 200);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <motion.div
            className="flex items-start justify-between gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <Badge
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 font-medium",
                  sentimentStyles[note.sentiment],
                )}
              >
                <SentimentIcon sentiment={note.sentiment} className="w-4 h-4" />
                <span className="capitalize">{note.sentiment}</span>
              </Badge>
            </motion.div>
          </motion.div>
        </DialogHeader>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Created on {dateCreated.toLocaleDateString("es-MX")} at{" "}
              {dateCreated.toLocaleTimeString(["es-MX"], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <motion.div
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base">
              {note.text}
            </p>
          </motion.div>

          <motion.div
            className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>{countWords} words</span>
            <span>~{countMinutes} min read</span>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
