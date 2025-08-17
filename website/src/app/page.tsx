"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, BookOpen, TrendingUp, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotes, useCreateNote, Sentiment, type Note } from "@/lib/hooks";
import { useInfiniteNotes } from "@/lib/hooks/use-infinite-notes";
import { SentimentFilter } from "@/components/sentiment-filter";
import { NotesGrid } from "@/components/notes-grid";

const NOTES_PER_PAGE = 2;

export default function NotesApp() {
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | "all">(
    "all"
  );

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteNotes(
    selectedSentiment === "all" ? null : selectedSentiment,
    NOTES_PER_PAGE
  );

  // Hook separado para obtener todos los counts (para los filtros)
  const { data: allNotesData } = useNotes(undefined, 1000);

  const createNoteMutation = useCreateNote();

  // Obtener todas las notas de las páginas cargadas
  const notes = (data?.notes || []).filter(
    (note): note is Note => note !== null
  );

  // Contar sentimientos para los filtros
  const sentimentCounts = useMemo(() => {
    const counts: Record<Sentiment, number> = {
      [Sentiment.Happy]: 0,
      [Sentiment.Sad]: 0,
      [Sentiment.Neutral]: 0,
      [Sentiment.Angry]: 0,
    };

    const allNotes =
      allNotesData?.items?.filter((note): note is Note => note !== null) || [];
    allNotes.forEach((note) => {
      counts[note.sentiment] = (counts[note.sentiment] || 0) + 1;
    });

    return counts;
  }, [allNotesData]);

  const totalNotes = Object.values(sentimentCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleSentimentChange = (sentiment: Sentiment | "all") => {
    setSelectedSentiment(sentiment);
  };

  const handleCreateNote = () => {
    createNoteMutation.mutate({
      text: "New note from main page",
      sentiment: Sentiment.Happy,
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const threshold = 200;
      const isNearBottom =
        scrollTop + windowHeight >= documentHeight - threshold;

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-destructive mb-4">⚠️ Connection Error</div>
          <p className="text-sm text-muted-foreground mb-4">
            Could not load notes: {error.message}
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Notes Sentiment
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Capture your thoughts and emotions with intelligent sentiment
              analysis
            </p>

            {totalNotes > 0 && (
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{totalNotes} total notes</span>
                </div>

                {selectedSentiment !== "all" && (
                  <>
                    <div className="w-1 h-1 bg-muted rounded-full" />
                    <span>
                      {sentimentCounts[selectedSentiment] || 0} with{" "}
                      {selectedSentiment} sentiment
                    </span>
                  </>
                )}

                <div className="w-1 h-1 bg-muted rounded-full" />
                <span>{notes.length} loaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {totalNotes > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              onClick={handleCreateNote}
              disabled={createNoteMutation.isPending}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              {createNoteMutation.isPending ? "Creating..." : "Create Note"}
            </Button>

            <SentimentFilter
              selectedSentiment={selectedSentiment}
              onSentimentChange={handleSentimentChange}
              counts={sentimentCounts}
            />

            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        )}

        <NotesGrid notes={notes} isLoading={false} />

        {isFetchingNextPage && (
          <div className="flex justify-center items-center mt-8 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading more notes...</span>
            </div>
          </div>
        )}

        {!hasNextPage && notes.length > 0 && (
          <div className="flex justify-center items-center mt-8 py-4">
            <div className="text-sm text-muted-foreground">
              ✨ You&apos;ve seen all notes
            </div>
          </div>
        )}

        {notes.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {totalNotes === 0
                ? "Start by writing your first note"
                : "No notes match this filter"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {totalNotes === 0
                ? "Create your first note and let our sentiment analysis help you understand your thoughts and emotions."
                : "Try changing the filter or create a new note with the selected sentiment."}
            </p>
            <Button
              onClick={
                totalNotes === 0
                  ? handleCreateNote
                  : () => setSelectedSentiment("all")
              }
              disabled={createNoteMutation.isPending}
              className={
                totalNotes === 0
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              {totalNotes === 0
                ? createNoteMutation.isPending
                  ? "Creating..."
                  : "Create Note"
                : "Show all notes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
