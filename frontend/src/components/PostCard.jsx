import { useNavigate } from "react-router-dom";
import { ArrowBigUp, MessageCircle, Award, Share2 } from "lucide-react";

export default function PostCard({ post, onUpvote, onDownvote, onSave }) {
  const navigate = useNavigate();

  const author = post.authorUsername ?? post.author ?? "unknown";
  const community = post.communityName ?? post.community ?? "";
  const score = post.score ?? post.upvotes ?? 0;
  const commentCount = post.commentCount ?? post.comments ?? 0;
  const vote =
    post.vote ??
    (post.upvoted ? "UPVOTE" : post.downvoted ? "DOWNVOTE" : "NONE");
  const time = post.createdAt ? formatRelativeTime(post.createdAt) : post.time;
  const scoreLabel =
    typeof score === "number" ? formatCompactNumber(score) : String(score);

  const handleVote = direction => {
    if (direction === "up") {
      onUpvote && onUpvote(post.id);
      return;
    }

    onDownvote && onDownvote(post.id);
  };

  return (
    <article className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-orange-500/5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Vote Column */}
        <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1 text-slate-400 shrink-0 bg-slate-800/50 rounded-xl p-2">
          <button
            type="button"
            onClick={() => handleVote("up")}
            className={`p-1 rounded transition-colors ${
              vote === "UPVOTE"
                ? "text-orange-500 bg-orange-500/10"
                : "hover:text-orange-400 hover:bg-slate-700"
            }`}
            aria-label="Upvote"
          >
            <ArrowBigUp className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold">{scoreLabel}</span>
          <button
            type="button"
            onClick={() => handleVote("down")}
            className={`p-1 rounded transition-colors ${
              vote === "DOWNVOTE"
                ? "text-indigo-500 bg-indigo-500/10"
                : "hover:text-indigo-400 hover:bg-slate-700"
            }`}
            aria-label="Downvote"
          >
            <ArrowBigUp className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-200">{community}</span>
            <span className="text-slate-500">•</span>
            <button
              type="button"
              onClick={() => navigate(`/u/${author}`)}
              className="text-slate-300 hover:text-orange-400 transition-colors font-medium"
            >
              posted by u/{author}
            </button>
            <span className="text-slate-500">•</span>
            <span>{time}</span>
          </div>
          <h2 className="text-lg font-semibold mb-3">{post.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => navigate(`/posts/${post.id}`)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {commentCount} comments
            </button>
            <button
              type="button"
              onClick={() => onSave(post.id)}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
                post.saved
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-slate-300 bg-slate-800/50 hover:bg-slate-700"
              }`}
              aria-label="Save post"
            >
              <Award className="w-4 h-4" />
              Save
            </button>
            <button className="inline-flex items-center gap-1.5 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatRelativeTime(value) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return value;
  }

  const deltaMinutes = Math.max(
    1,
    Math.floor((Date.now() - timestamp) / 60000)
  );

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays}d ago`;
}
