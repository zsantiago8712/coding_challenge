"use client";

import { NoteDetailModal } from "@/components/note-details";
import { NoteModal } from "@/components/note-modal";
import { NotesGrid } from "@/components/notes-grid";
import { NotesStats } from "@/components/notes-stats";
import { SentimentFilter } from "@/components/sentiment-filter";
import { Button } from "@/components/ui/button";
import { Sentiment, useCreateNote, type Note } from "@/lib/hooks";
import { useInfiniteNotes } from "@/lib/hooks/use-infinite-notes";
import { BookOpen, Loader2, Plus, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const NOTES_PER_PAGE = 10;

export default function NotesApp() {
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | "all">(
    "all",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [selectNote, setSelectedNote] = useState<Note | null>(null);
  const [sentimentCounts, setSentimentCounts] = useState<
    Record<Sentiment, number>
  >({
    [Sentiment.Happy]: 0,
    [Sentiment.Sad]: 0,
    [Sentiment.Neutral]: 0,
    [Sentiment.Angry]: 0,
  });

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
    NOTES_PER_PAGE,
  );

  const createNoteMutation = useCreateNote();

  const notes = (data?.notes || []).filter(
    (note): note is Note => note !== null,
  );

  const totalNotes = notes.length;

  const handleSentimentChange = (sentiment: Sentiment | "all") => {
    setSelectedSentiment(sentiment);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleDeselectNote = () => {
    setSelectedNote(null);
    setIsModalOpen(false);
  };

  const handlePullRefresh = useCallback(async () => {
    if (isPullRefreshing) return;

    setIsPullRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [isPullRefreshing, refetch]);

  const handleCreateNote = (noteData: Omit<Note, "id" | "dateCreated">) => {
    createNoteMutation.mutate(noteData);
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

  useEffect(() => {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling) return;

      currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;

      if (pullDistance > 100 && window.scrollY === 0) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling) return;

      const pullDistance = currentY - startY;

      if (pullDistance > 100 && window.scrollY === 0) {
        handlePullRefresh();
      }

      isPulling = false;
      startY = 0;
      currentY = 0;
    };

    if ("ontouchstart" in window) {
      document.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if ("ontouchstart" in window) {
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [handlePullRefresh]);

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

            <NotesStats
              selectedSentiment={selectedSentiment}
              loadedNotesCount={notes.length}
              setSentimentCounts={setSentimentCounts}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {totalNotes > 0 && (
          <div className="flex flex-col lg:flex-row gap-4 mb-8 lg:justify-center lg:items-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={createNoteMutation.isPending}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 lg:order-1"
            >
              <Plus className="w-4 h-4" />
              {createNoteMutation.isPending ? "Creating..." : "Create Note"}
            </Button>
            <NoteModal
              isOpen={isModalOpen && !selectNote}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleCreateNote}
            />

            <div className="lg:order-2">
              <SentimentFilter
                selectedSentiment={selectedSentiment}
                onSentimentChange={handleSentimentChange}
                counts={sentimentCounts}
              />
            </div>

            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 lg:order-3"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        )}

        <NotesGrid notes={notes} isLoading={false} setNote={handleSelectNote} />
        <NoteDetailModal
          note={selectNote}
          isOpen={isModalOpen}
          onClose={() => handleDeselectNote()}
        />

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
          </div>
        )}
      </div>
    </div>
  );
}
