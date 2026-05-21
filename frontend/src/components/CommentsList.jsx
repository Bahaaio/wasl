/**
 * @typedef {import("../api/types.js").CommentDto} CommentDto
 * @typedef {import("../api/types.js").MediaDto} MediaDto
 */

import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Image,
  Type,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MediaApi } from "../api/media.js";
import { getCommentNetVoteScore } from "../api/comments.js";

export default function CommentsList({
  comments,
  onUpvote,
  onDownvote,
  onReply,
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
          onReply={onReply}
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
  onReply,
  onDelete,
  navigate,
  depth,
}) {
  const [isRepliesVisible, setIsRepliesVisible] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyAttachedMediaId, setReplyAttachedMediaId] = useState(null);
  const [replyAttachedPreviewUrl, setReplyAttachedPreviewUrl] = useState("");
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

            {comment.deleted ? (
              <div className="mt-2 mb-3 flex items-center gap-2 rounded-lg bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
                <Trash2 className="h-4 w-4 text-red-400" />
                <span>Comment deleted</span>
              </div>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {getCommentBody(comment)}
                </p>

                {comment.media && (
                  <div className="mt-3">
                    <img
                      src={MediaApi.getFullMediaUrl(
                        comment.media.id ?? comment.media.mediaId ?? comment.media
                      )}
                      alt="comment media"
                      className="mt-2 max-h-64 w-auto rounded border border-slate-700 object-cover"
                      onError={e => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      onUpvote &&
                      onUpvote(
                        comment.id,
                        vote === "UPVOTE" ? "NONE" : "UPVOTE"
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                      vote === "UPVOTE"
                        ? "bg-orange-500/20 text-orange-200 ring-1 ring-orange-500/40 shadow-[0_0_0_1px_rgba(249,115,22,0.12)]"
                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-orange-400"
                    }`}
                    aria-pressed={vote === "UPVOTE"}
                    aria-label="Upvote comment"
                  >
                    <ArrowBigUp
                      className={`h-3.5 w-3.5 ${
                        vote === "UPVOTE"
                          ? "text-orange-200"
                          : "text-orange-400"
                      }`}
                    />
                  </button>
                  <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/50 px-3 py-1.5 text-sm font-semibold text-slate-200">
                    {getCommentScore(comment)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onDownvote &&
                      onDownvote(
                        comment.id,
                        vote === "DOWNVOTE" ? "NONE" : "DOWNVOTE"
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                      vote === "DOWNVOTE"
                        ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40 shadow-[0_0_0_1px_rgba(99,102,241,0.12)]"
                        : "bg-slate-800/60 text-slate-400 hover:bg-slate-700 hover:text-indigo-400"
                    }`}
                    aria-pressed={vote === "DOWNVOTE"}
                    aria-label="Downvote comment"
                  >
                    <ArrowBigDown
                      className={`h-3.5 w-3.5 ${
                        vote === "DOWNVOTE"
                          ? "text-indigo-200"
                          : "text-indigo-400"
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
                  <button
                    type="button"
                    onClick={() => setIsReplying(current => !current)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-slate-200 text-slate-400"
                  >
                    Reply
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
              </>
            )}
          </div>
        </div>
      </article>

      {isReplying && (
        <form
          className="mt-3 rounded-full border-2 border-slate-700 bg-slate-900/50 p-4 flex items-center gap-3 transition-all hover:border-slate-600 focus-within:border-blue-500/50"
          onSubmit={event => {
              event.preventDefault();
              if (!replyText.trim() && !replyAttachedMediaId) return;
              onReply?.(comment.id, replyText, replyAttachedMediaId);
              setReplyText("");
              if (replyAttachedPreviewUrl) {
                URL.revokeObjectURL(replyAttachedPreviewUrl);
              }
              setReplyAttachedPreviewUrl("");
              setReplyAttachedMediaId(null);
              setIsReplying(false);
              setIsRepliesVisible(true);
            }}
        >
          <button
            type="button"
            className="text-slate-400 hover:text-blue-400 transition-colors shrink-0"
            onClick={() => {
              const el = document.getElementById(`reply-image-input-${comment.id}`);
              if (el) el.click();
            }}
          >
            <Image className="h-5 w-5" />
          </button>
          <input
            id={`reply-image-input-${comment.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const resp = await MediaApi.uploadMedia(file);
                const mediaId = resp?.mediaId ?? resp?.id ?? resp?.media?.id;
                if (mediaId) {
                  setReplyAttachedMediaId(mediaId);
                  const preview = URL.createObjectURL(file);
                  setReplyAttachedPreviewUrl(preview);
                }
              } catch (err) {
                console.error("Failed to upload reply media:", err);
              } finally {
                e.target.value = "";
              }
            }}
          />
          <button
            type="button"
            className="text-slate-400 hover:text-blue-400 transition-colors shrink-0"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="text-slate-400 hover:text-blue-400 transition-colors shrink-0"
          >
            <Type className="h-5 w-5" />
          </button>
          <input
            value={replyText}
            onChange={event => setReplyText(event.target.value)}
            placeholder={`Reply to u/${getCommentAuthor(comment)}...`}
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
          />
          {replyAttachedPreviewUrl && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={replyAttachedPreviewUrl}
                alt="attached"
                className="h-20 w-20 rounded object-cover border border-slate-700"
              />
              <div className="flex-1">
                <div className="text-sm text-slate-300">Image attached</div>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(replyAttachedPreviewUrl);
                    setReplyAttachedPreviewUrl("");
                    setReplyAttachedMediaId(null);
                  }}
                  className="mt-2 text-sm text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setIsReplying(false);
              setReplyText("");
            }}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all text-sm font-medium shrink-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="px-5 py-2 rounded-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all text-sm font-bold shrink-0"
          >
            Reply
          </button>
        </form>
      )}

      {isRepliesVisible && comment.replies?.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map(reply => (
            <CommentThread
              key={reply.id}
              comment={reply}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              onReply={onReply}
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
  return getCommentNetVoteScore(comment);
}
