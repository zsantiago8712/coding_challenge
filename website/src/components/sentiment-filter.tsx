"use client";

import { Button } from "@/components/ui/button";
import { Sentiment } from "@/lib/graphql/graphql";
import { SentimentIcon } from "./sentiment-icon";
import { cn } from "@/lib/utils";

interface SentimentFilterProps {
  selectedSentiment: Sentiment | "all";
  onSentimentChange: (sentiment: Sentiment | "all") => void;
  counts: Record<Sentiment, number>;
}

export function SentimentFilter({
  selectedSentiment,
  onSentimentChange,
  counts,
}: SentimentFilterProps) {
  const filters: { value: Sentiment | "all"; label: string }[] = [
    { value: "all", label: "All Notes" },
    { value: Sentiment.Happy, label: "Happy" },
    { value: Sentiment.Sad, label: "Sad" },
    { value: Sentiment.Neutral, label: "Neutral" },
    { value: Sentiment.Angry, label: "Angry" },
  ];

  const sentimentStyles = {
    all: {
      selected:
        "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
      unselected: "hover:bg-muted hover:border-primary/50",
    },
    happy: {
      selected: "bg-green-500 text-white border-green-500 hover:bg-green-600",
      unselected:
        "hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950",
    },
    sad: {
      selected: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600",
      unselected:
        "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950",
    },
    neutral: {
      selected: "bg-gray-500 text-white border-gray-500 hover:bg-gray-600",
      unselected:
        "hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-950",
    },
    angry: {
      selected: "bg-red-500 text-white border-red-500 hover:bg-red-600",
      unselected: "hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950",
    },
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const count =
          filter.value === "all"
            ? Object.values(counts).reduce((sum, count) => sum + count, 0)
            : counts[filter.value as Sentiment] || 0;

        const isSelected = selectedSentiment === filter.value;
        const styleKey =
          filter.value === "all" ? "all" : (filter.value as Sentiment);
        const currentStyle = sentimentStyles[styleKey];

        return (
          <Button
            key={filter.value}
            variant="outline"
            size="sm"
            onClick={() => onSentimentChange(filter.value)}
            className={cn(
              "flex items-center gap-2 transition-all duration-300 transform hover:scale-105",
              isSelected ? currentStyle.selected : currentStyle.unselected
            )}
          >
            {filter.value !== "all" && (
              <SentimentIcon
                sentiment={filter.value as Sentiment}
                className="w-4 h-4"
              />
            )}
            <span className="font-medium">{filter.label}</span>
            <span
              className={cn(
                "ml-1 px-2 py-0.5 text-xs rounded-full transition-all duration-200",
                isSelected
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
