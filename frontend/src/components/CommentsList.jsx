import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MediaApi } from "../api/media";
import { getNetVoteScore } from "../api/util.js";

export default function CommentsList({
  comments,
  onUpvote,
  onDownvote,
  onDelete,
}) {
  const navigate = useNavigate();

  if (!comments?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <MessageCircle className="h-10 w-10 text-slate-600" />
          <p className="text-slate-400 text-sm">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      </div>
    );
  }

  // Build tree structure from flat comments
  const commentMap = new Map(comments.map(c => [c.id, { ...c, replies: [] }]));
  const topLevelComments = [];

  for (const comment of comments) {
    const node = commentMap.get(comment.id);
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
      }
    } else {
      topLevelComments.push(node);
    }
  }

  return (
    <div className="space-y-4">
      {topLevelComments.map(comment => (
        <CommentThread
          key={comment.id}
          comment={comment}
          onUpvote={onUpvote}
          onDownvote={onDownvote}
          onDelete={onDelete}
          navigate={navigate}
          depth={0}
        />
      ))}
    </div>
  );
}

function CommentThread({
  comment,
  onUpvote,
  onDownvote,
  onDelete,
  navigate,
  depth,
}) {
  const [isRepliesVisible, setIsRepliesVisible] = useState(true);
  const vote = comment.vote ?? "NONE";

  const getAvatarUrl = () => {
    if (comment.authorAvatarMediaId) {
      return MediaApi.getFullMediaUrl(comment.authorAvatarMediaId);
    }
    return null;
  };

  const getInitials = () => {
    return getCommentAuthor(comment)
      .split(" ")
      .map(part => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const marginLeft = depth > 0 ? `${depth * 24}px` : "0";

  return (
    <div style={{ marginLeft }}>
      <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/80 shadow-sm hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full overflow-hidden bg-linear-to-br from-orange-500 to-red-600 text-sm font-bold text-white shadow-lg shadow-orange-500/10">
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt={getCommentAuthor(comment)}
                className="h-full w-full object-cover"
                onError={e => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => navigate(`/u/${getCommentAuthor(comment)}`)}
                className="font-semibold text-slate-300 hover:text-orange-400 transition-colors"
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

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => onUpvote && onUpvote(comment.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                  vote === "UPVOTE"
                    ? "bg-orange-500/15 text-orange-300"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-orange-400"
                }`}
                aria-pressed={vote === "UPVOTE"}
                aria-label="Upvote comment"
              >
                <ArrowBigUp
                  className={`h-3.5 w-3.5 ${
                    vote === "UPVOTE" ? "text-orange-300" : "text-orange-400"
                  }`}
                />
                {getCommentScore(comment)}
              </button>
              <button
                type="button"
                onClick={() => onDownvote && onDownvote(comment.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                  vote === "DOWNVOTE"
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-indigo-400"
                }`}
                aria-pressed={vote === "DOWNVOTE"}
                aria-label="Downvote comment"
              >
                <ArrowBigDown
                  className={`h-3.5 w-3.5 ${
                    vote === "DOWNVOTE" ? "text-indigo-300" : "text-indigo-400"
                  }`}
                />
              </button>
              <button
                type="button"
                onClick={() => onDelete && onDelete(comment.id)}
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 transition-colors hover:bg-red-900/30 hover:text-red-400 text-slate-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
              {comment.replies?.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsRepliesVisible(!isRepliesVisible)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-slate-200 text-slate-400 ml-auto"
                >
                  {isRepliesVisible ? (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      {comment.replies.length} repl
                      {comment.replies.length === 1 ? "y" : "ies"}
                    </>
                  ) : (
                    <>
                      <ChevronRight className="h-3.5 w-3.5" />
                      {comment.replies.length} repl
                      {comment.replies.length === 1 ? "y" : "ies"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {isRepliesVisible && comment.replies?.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map(reply => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              onDelete={onDelete}
              navigate={navigate}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
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
  return getNetVoteScore(comment);
}
