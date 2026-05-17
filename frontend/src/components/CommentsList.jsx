import { MessageCircle, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommentsList({ comments, onUpvote, onDownvote }) {
  const navigate = useNavigate();

  if (!comments?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <article
          key={comment.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-red-600 text-sm font-bold text-white shadow-lg shadow-orange-500/10">
              {getCommentAuthor(comment)
                .split(" ")
                .map(part => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => navigate(`/u/${getCommentAuthor(comment)}`)}
                  className="font-semibold text-slate-200 hover:text-orange-400 transition-colors"
                >
                  u/{getCommentAuthor(comment)}
                </button>
                <span className="text-slate-600">•</span>
                <span>{getCommentTime(comment)}</span>
                {getCommentCommunity(comment) && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span>{getCommentCommunity(comment)}</span>
                  </>
                )}
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-200">
                {getCommentBody(comment)}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => onUpvote && onUpvote(comment.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-orange-400"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  {getCommentScore(comment)}
                </button>
                <button
                  type="button"
                  onClick={() => onDownvote && onDownvote(comment.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-slate-200"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  More
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function getCommentAuthor(comment) {
  return comment.authorUsername ?? comment.author ?? "unknown";
}

function getCommentBody(comment) {
  return comment.content ?? comment.body ?? "";
}

function getCommentTime(comment) {
  if (comment.createdAt) {
    const timestamp = new Date(comment.createdAt).getTime();

    if (!Number.isNaN(timestamp)) {
      const deltaMinutes = Math.max(
        1,
        Math.floor((Date.now() - timestamp) / 60000)
      );

      if (deltaMinutes < 60) return `${deltaMinutes}m ago`;

      const deltaHours = Math.floor(deltaMinutes / 60);
      if (deltaHours < 24) return `${deltaHours}h ago`;

      const deltaDays = Math.floor(deltaHours / 24);
      return `${deltaDays}d ago`;
    }
  }

  return comment.time ?? "";
}

function getCommentCommunity(comment) {
  return comment.community ?? "";
}

function getCommentScore(comment) {
  return typeof comment.score === "number" ? comment.score : 0;
}
