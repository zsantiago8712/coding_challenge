import { Sentiment } from "../graphql/graphql";

export const SENTIMENT_OPTIONS = [
  {
    value: Sentiment.Happy,
    label: "😊 Feliz",
    color: "bg-green-100 text-green-800",
  },
  {
    value: Sentiment.Sad,
    label: "😢 Triste",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: Sentiment.Neutral,
    label: "😐 Neutral",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: Sentiment.Angry,
    label: "😠 Enojado",
    color: "bg-red-100 text-red-800",
  },
] as const;

export function getSentimentLabel(sentiment: Sentiment): string {
  const option = SENTIMENT_OPTIONS.find((opt) => opt.value === sentiment);
  return option?.label || sentiment;
}

export function getSentimentColor(sentiment: Sentiment): string {
  const option = SENTIMENT_OPTIONS.find((opt) => opt.value === sentiment);
  return option?.color || "bg-gray-100 text-gray-800";
}
