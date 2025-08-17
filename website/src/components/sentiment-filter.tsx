"use client";

import { Button } from "@/components/ui/button";
import { Sentiment } from "@/lib/graphql/graphql";
import { SentimentIcon } from "./sentiment-icon";
import { cn } from "@/lib/utils";
import { SENTIMENT_FILTER_OPTIONS } from "@/lib/constants/sentiments";

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
  return (
    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
      {SENTIMENT_FILTER_OPTIONS.map((config) => {
        const count =
          config.value === "all"
            ? Object.values(counts).reduce((sum, count) => sum + count, 0)
            : counts[config.value as Sentiment] || 0;

        const isSelected = selectedSentiment === config.value;

        return (
          <Button
            key={config.value}
            variant="outline"
            size="sm"
            onClick={() => onSentimentChange(config.value)}
            className={cn(
              "flex items-center gap-2 transition-all duration-300 transform hover:scale-105",
              isSelected ? config.styles.selected : config.styles.unselected
            )}
          >
            {config.value !== "all" && (
              <SentimentIcon
                sentiment={config.value as Sentiment}
                className="w-4 h-4"
              />
            )}
            <span className="font-medium">{config.label}</span>
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
