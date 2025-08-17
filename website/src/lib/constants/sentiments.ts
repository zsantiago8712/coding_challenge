import { Sentiment } from "../graphql/graphql";

export const SENTIMENT_CONFIG = {
  happy: {
    value: Sentiment.Happy,
    label: "Happy",
    gradient: "from-green-500 to-emerald-500",
    description: "Positive and joyful",
    styles: {
      selected: "bg-green-500 text-white border-green-500 hover:bg-green-600",
      unselected:
        "hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950",
      badge:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      border: "border-l-green-400 hover:border-green-400",
      hover: "hover:shadow-green-200/50 dark:hover:shadow-green-900/50",
    },
  },
  sad: {
    value: Sentiment.Sad,
    label: "Sad",
    gradient: "from-blue-500 to-sky-500",
    description: "Melancholic or down",
    styles: {
      selected: "bg-blue-500 text-white border-blue-500 hover:bg-blue-600",
      unselected:
        "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      border: "border-l-blue-400 hover:border-blue-400",
      hover: "hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50",
    },
  },
  neutral: {
    value: Sentiment.Neutral,
    label: "Neutral",
    gradient: "from-slate-500 to-gray-500",
    description: "Balanced and calm",
    styles: {
      selected: "bg-gray-500 text-white border-gray-500 hover:bg-gray-600",
      unselected:
        "hover:bg-gray-50 hover:border-gray-300 dark:hover:bg-gray-950",
      badge: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
      border: "border-l-gray-400 hover:border-gray-400",
      hover: "hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50",
    },
  },
  angry: {
    value: Sentiment.Angry,
    label: "Angry",
    gradient: "from-red-500 to-rose-500",
    description: "Frustrated or upset",
    styles: {
      selected: "bg-red-500 text-white border-red-500 hover:bg-red-600",
      unselected: "hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950",
      badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      border: "border-l-red-400 hover:border-red-400",
      hover: "hover:shadow-red-200/50 dark:hover:shadow-red-900/50",
    },
  },
  all: {
    value: "all" as const,
    label: "All Notes",
    gradient: "from-primary to-accent",
    description: "All sentiment types",
    styles: {
      selected:
        "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
      unselected: "hover:bg-muted hover:border-primary/50",
      badge: "bg-muted text-muted-foreground",
      border: "border-l-primary hover:border-primary",
      hover: "hover:shadow-primary/20",
    },
  },
} as const;

export const SENTIMENT_OPTIONS = Object.values(SENTIMENT_CONFIG).filter(
  (config) => config.value !== "all"
);

export const SENTIMENT_FILTER_OPTIONS = Object.values(SENTIMENT_CONFIG);

export const getSentimentConfig = (sentiment: Sentiment | "all") => {
  const key =
    sentiment === "all"
      ? "all"
      : (sentiment.toLowerCase() as keyof typeof SENTIMENT_CONFIG);
  return SENTIMENT_CONFIG[key];
};
