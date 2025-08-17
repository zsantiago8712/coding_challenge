"use client";

import { TrendingUp } from "lucide-react";
import { useNotesStats } from "@/lib/hooks";
import { Sentiment } from "@/lib/hooks";

interface NotesStatsProps {
  selectedSentiment: Sentiment | "all";
  loadedNotesCount: number;
}

export function NotesStats({
  selectedSentiment,
  loadedNotesCount,
}: NotesStatsProps) {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
  } = useNotesStats();

  console.log("Stats data:", statsData);
  console.log("Stats error:", statsError);
  console.log("Stats loading:", isStatsLoading);

  if (statsError != null) {
    return (
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-destructive">
        <span>⚠️ Error loading stats: {statsError.message}</span>
      </div>
    );
  }

  const sentimentCounts = {
    [Sentiment.Happy]: 0,
    [Sentiment.Sad]: 0,
    [Sentiment.Neutral]: 0,
    [Sentiment.Angry]: 0,
  };

  if (statsData?.notesBySentiment) {
    statsData.notesBySentiment.forEach((item) => {
      sentimentCounts[item.sentiment] = item.count;
    });
  }

  const totalNotes = statsData?.totalNotes || 0;
  const mostPopularSentiment = statsData?.mostPopularSentiment;

  return (
    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        <span>
          {isStatsLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            `${totalNotes} total notes`
          )}
        </span>
      </div>

      {selectedSentiment !== "all" && (
        <>
          <div className="w-1 h-1 bg-muted rounded-full" />
          <span>
            {isStatsLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              `${
                sentimentCounts[selectedSentiment] || 0
              } with ${selectedSentiment} sentiment`
            )}
          </span>
        </>
      )}

      <div className="w-1 h-1 bg-muted rounded-full" />
      <span>{loadedNotesCount} loaded</span>

      {mostPopularSentiment && !isStatsLoading && (
        <>
          <div className="w-1 h-1 bg-muted rounded-full" />
          <span>
            Most common:{" "}
            <span className="text-foreground font-medium capitalize">
              {mostPopularSentiment}
            </span>
          </span>
        </>
      )}

      {isStatsLoading && (
        <>
          <div className="w-1 h-1 bg-muted rounded-full" />
          <span className="animate-pulse">Most common: Loading...</span>
        </>
      )}
    </div>
  );
}
