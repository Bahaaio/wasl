import { ArrowBigDown, ArrowBigUp } from "lucide-react";

export default function VoteControl({
  vote = "NONE",
  score = 0,
  onUpvote,
  onDownvote,
  disabled = false,
  className = "",
}) {
  const formattedScore = formatCompactNumber(score);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-950/80 px-2 py-1 shadow-sm shadow-black/20 ${className}`}
    >
      <button
        type="button"
        onClick={onUpvote}
        disabled={disabled}
        className={`rounded-full p-0.5 transition-colors ${
          vote === "UPVOTE"
            ? "text-orange-300"
            : disabled
              ? "cursor-not-allowed text-slate-600"
              : "text-slate-400 hover:text-orange-300"
        }`}
        aria-label="Upvote"
        aria-pressed={vote === "UPVOTE"}
      >
        <ArrowBigUp className="h-4 w-4" />
      </button>

      <span className="min-w-10 px-1 text-center text-sm font-semibold leading-none tracking-tight text-slate-100 tabular-nums">
        {formattedScore}
      </span>

      <button
        type="button"
        onClick={onDownvote}
        disabled={disabled}
        className={`rounded-full p-0.5 transition-colors ${
          vote === "DOWNVOTE"
            ? "text-indigo-300"
            : disabled
              ? "cursor-not-allowed text-slate-600"
              : "text-slate-400 hover:text-indigo-300"
        }`}
        aria-label="Downvote"
        aria-pressed={vote === "DOWNVOTE"}
      >
        <ArrowBigDown className="h-4 w-4" />
      </button>
    </div>
  );
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}