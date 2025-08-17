import { Smile, Frown, Meh, Angry } from "lucide-react";
import { Sentiment } from "@/lib/graphql/graphql";

interface SentimentIconProps {
  sentiment: Sentiment;
  className?: string;
}

export function SentimentIcon({
  sentiment,
  className = "w-5 h-5",
}: SentimentIconProps) {
  const icons = {
    happy: Smile,
    sad: Frown,
    neutral: Meh,
    angry: Angry,
  };

  const Icon = icons[sentiment];
  return <Icon className={className} />;
}
