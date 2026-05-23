/**
 * @typedef {import("../api/types.js").CommentDto} CommentDto
 * @typedef {import("../api/types.js").MediaDto} MediaDto
 */

import {
  ArrowBigDown,
  ArrowBigUp,
  ChevronDown,
  ChevronRight,
  Image,
  MessageCircle,
  PencilLine,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaApi } from "../api/media.js";

const COMMENT_IMAGE_ACCEPT = "image/jpeg,image/png,image/gif";
const MAX_COMMENT_IMAGE_BYTES = 15 * 1024 * 1024;

function isAllowedCommentImage(file) {
  if (!file) {
    return false;
  }

  if (file.size > MAX_COMMENT_IMAGE_BYTES) {
    return false;
  }

  return ["image/jpeg", "image/png", "image/gif"].includes(file.type);
}

function EditCommentModal({ editingState, onCancel, onSubmit, onStateChange }) {
  const inputRef = useRef(null);
  const { text, originalText, mediaId, previewUrl, previewIsRemote, isSaving } =
    editingState;

  useEffect(
    () => () => {
      if (previewUrl && !previewIsRemote) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewIsRemote, previewUrl]
  );

  const handleMediaChange = async event => {
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = "";
      return;
    }

    if (!isAllowedCommentImage(file)) {
      console.error(
        "Unsupported comment media. Use JPEG, PNG, or GIF images up to 15MB."
      );
      event.target.value = "";
      return;
    }

    try {
      const response = await MediaApi.uploadMedia(file);
      const nextMediaId = response?.id;
      if (!nextMediaId) return;

      if (previewUrl && !previewIsRemote) {
        URL.revokeObjectURL(previewUrl);
      }

      onStateChange(current => ({
        ...current,
        mediaId: nextMediaId,
        previewUrl: URL.createObjectURL(file),
        previewIsRemote: false,
      }));
    } catch (error) {
      console.error("Failed to upload comment media:", error);
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const trimmedContent = text.trim();
    const fallbackContent = originalText.trim();
    const nextContent = trimmedContent || fallbackContent;
    if (!nextContent && !mediaId) return;

    onStateChange(current => ({ ...current, isSaving: true }));

    try {
      await onSubmit?.(nextContent, mediaId);
      onCancel();
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      onStateChange(current => ({ ...current, isSaving: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="modal-cinematic-orbit absolute inset-[-35%]" />
        <div className="modal-cinematic-sweep absolute inset-0" />
        <div className="modal-cinematic-shimmer absolute inset-0" />
      </div>

      <form
        onSubmit={handleSubmit}
        onClick={event => event.stopPropagation()}
        className="relative flex w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-900/95 shadow-2xl ring-1 ring-white/5"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800/90 bg-linear-to-r from-slate-900 to-slate-900/70 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Comment</h2>
            <p className="mt-1 text-sm text-slate-400">
              Update the text or replace the attached image.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-700 bg-slate-800/70 p-2 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
            aria-label="Close edit modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200">
                Content
              </label>
              <span className="text-xs text-slate-500">
                {text.trim().length} chars
              </span>
            </div>

            <textarea
              value={text}
              onChange={event =>
                onStateChange(current => ({
                  ...current,
                  text: event.target.value,
                }))
              }
              rows={5}
              className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-slate-100 outline-none transition-colors focus:border-orange-500/70"
              placeholder="Update your comment"
            />
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-800/90 bg-slate-950/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-medium text-slate-200">
                  Comment photo
                </h3>
                <p className="text-xs text-slate-500">
                  Upload a new image to replace the current one.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/70 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-orange-500/40 hover:bg-slate-700"
                >
                  <Image className="h-3.5 w-3.5" />
                  {mediaId ? "Replace photo" : "Add photo"}
                </button>
                {mediaId && (
                  <button
                    type="button"
                    onClick={() => {
                      if (previewUrl && !previewIsRemote) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      onStateChange(current => ({
                        ...current,
                        mediaId: null,
                        previewUrl: "",
                        previewIsRemote: false,
                      }));
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={COMMENT_IMAGE_ACCEPT}
              className="hidden"
              onChange={handleMediaChange}
            />

            {previewUrl ? (
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
                <div className="aspect-video w-full bg-slate-950/60">
                  <img
                    src={previewUrl}
                    alt="Comment media preview"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="text-xs text-slate-500">
                    {previewIsRemote ? "Uploaded image" : "New image"}
                  </span>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs text-slate-200 transition-colors hover:border-orange-500/40 hover:bg-slate-700"
                  >
                    <PencilLine className="h-3 w-3" />
                    Replace
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/30 px-4 py-8 text-center text-sm text-slate-500">
                No image attached.
              </div>
            )}

            <p className="text-xs text-slate-500">
              Supported formats: JPEG, PNG, GIF. Maximum size: 15 MB.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-800/90 bg-slate-900/80 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-1.5 text-sm text-slate-200 transition-colors hover:border-slate-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-linear-to-r from-orange-500 to-red-600 px-4 py-1.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function getCommentNetVoteScore(comment) {
  if (!comment) return 0;
  if (typeof comment.score === "number") return comment.score;

  const up = Number(comment.upvoteCount ?? comment.upvotes ?? 0) || 0;
  const down = Number(comment.downvoteCount ?? comment.downvotes ?? 0) || 0;

  return up - down;
}

export default function CommentsList({
  comments,
  onUpvote,
  onDownvote,
  onReply,
  onDelete,
  onEditComment,
  currentUsername,
  isOwnProfile = false,
  profileUsername = "",
}) {
  const navigate = useNavigate();
  const [editingComment, setEditingComment] = useState(null);
  const [editingState, setEditingState] = useState(null);

  useEffect(
    () => () => {
      if (editingState?.previewUrl && !editingState?.previewIsRemote) {
        URL.revokeObjectURL(editingState.previewUrl);
      }
    },
    [editingState]
  );

  const stopEditingComment = () => {
    if (editingState?.previewUrl && !editingState?.previewIsRemote) {
      URL.revokeObjectURL(editingState.previewUrl);
    }

    setEditingComment(null);
    setEditingState(null);
  };

  const startEditingComment = comment => {
    const mediaId = comment?.media?.id ?? null;

    setEditingComment(comment);
    setEditingState({
      text: getCommentBody(comment),
      originalText: getCommentBody(comment),
      mediaId,
      previewUrl: mediaId ? MediaApi.getFullMediaUrl(mediaId) : "",
      previewIsRemote: Boolean(mediaId),
      isSaving: false,
    });
  };

  if (!comments?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <MessageCircle className="h-10 w-10 text-slate-600" />
          <p className="text-sm text-slate-400">
            {isOwnProfile
              ? "You haven't left any comments yet. Be the first to share your thoughts!"
              : profileUsername
                ? `u/${profileUsername} hasn't left any comments yet`
                : "No comments yet. Be the first to share your thoughts!"}
          </p>
        </div>
      </div>
    );
  }

  const commentMap = new Map(
    comments.map(comment => [comment.id, { ...comment, replies: [] }])
  );
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
          onEditComment={startEditingComment}
          currentUsername={currentUsername}
          navigate={navigate}
          depth={0}
        />
      ))}

      {editingComment && editingState && (
        <EditCommentModal
          editingState={editingState}
          onCancel={stopEditingComment}
          onSubmit={async (content, mediaId) =>
            onEditComment?.(editingComment.id, content, mediaId)
          }
          onStateChange={setEditingState}
        />
      )}
    </div>
  );
}

function CommentThread({
  comment,
  onUpvote,
  onDownvote,
  onReply,
  onDelete,
  onEditComment,
  currentUsername,
  navigate,
  depth,
}) {
  const [isRepliesVisible, setIsRepliesVisible] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyAttachedMediaId, setReplyAttachedMediaId] = useState(null);
  const [replyAttachedPreviewUrl, setReplyAttachedPreviewUrl] = useState("");
  const [replyPreviewIsRemote, setReplyPreviewIsRemote] = useState(false);
  const vote = comment.vote ?? "NONE";
  const canManageComment =
    currentUsername && getCommentAuthor(comment) === currentUsername;

  const marginLeft = depth > 0 ? `${depth * 24}px` : "0";

  return (
    <div style={{ marginLeft }}>
      <article className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition-all hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-md">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-orange-500 to-red-600 text-sm font-bold text-white shadow-lg shadow-orange-500/10">
            {getCommentAvatarUrl(comment) ? (
              <img
                src={getCommentAvatarUrl(comment)}
                alt={getCommentAuthor(comment)}
                className="h-full w-full object-cover"
                onError={event => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>{getInitials(comment)}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => navigate(`/u/${getCommentAuthor(comment)}`)}
                className="font-semibold text-slate-300 transition-colors hover:text-orange-400"
              >
                u/{getCommentAuthor(comment)}
              </button>
              <span className="text-slate-600">•</span>
              <span>{getCommentTime(comment)}</span>
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

                {comment.media?.id && (
                  <div className="mt-3">
                    <img
                      src={MediaApi.getFullMediaUrl(comment.media.id)}
                      alt="comment media"
                      className="max-h-64 w-auto rounded-xl border border-slate-700 object-cover"
                      onError={event => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      onUpvote?.(
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
                      className={`h-3.5 w-3.5 ${vote === "UPVOTE" ? "text-orange-200" : "text-orange-400"}`}
                    />
                  </button>

                  <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/50 px-3 py-1.5 text-sm font-semibold text-slate-200">
                    {getCommentNetVoteScore(comment)}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onDownvote?.(
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
                      className={`h-3.5 w-3.5 ${vote === "DOWNVOTE" ? "text-indigo-200" : "text-indigo-400"}`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReplying(current => !current)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
                  >
                    Reply
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    {comment.replies?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsRepliesVisible(current => !current)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
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

                    {canManageComment && !comment.deleted && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditComment?.(comment)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/60 text-slate-400 transition-colors hover:bg-orange-900/30 hover:text-orange-300"
                          aria-label="Edit comment"
                        >
                          <PencilLine className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete?.(comment.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/60 text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
                          aria-label="Delete comment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </article>

      {isReplying && (
        <form
          className="mt-3 rounded-3xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-lg shadow-black/20 transition-all hover:border-slate-600 focus-within:border-blue-500/50 focus-within:shadow-blue-500/10"
          onSubmit={event => {
            event.preventDefault();
            if (!replyText.trim() && !replyAttachedMediaId) return;
            onReply?.(comment.id, replyText, replyAttachedMediaId);
            setReplyText("");
            if (replyAttachedPreviewUrl && !replyPreviewIsRemote) {
              URL.revokeObjectURL(replyAttachedPreviewUrl);
            }
            setReplyAttachedPreviewUrl("");
            setReplyAttachedMediaId(null);
            setReplyPreviewIsRemote(false);
            setIsReplying(false);
            setIsRepliesVisible(true);
          }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/50 text-slate-400 transition-colors hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
              onClick={() => {
                const el = document.getElementById(
                  `reply-image-input-${comment.id}`
                );
                if (el) el.click();
              }}
            >
              <Image className="h-5 w-5" />
            </button>

            <input
              id={`reply-image-input-${comment.id}`}
              type="file"
              accept={COMMENT_IMAGE_ACCEPT}
              className="hidden"
              onChange={async event => {
                const file = event.target.files?.[0];
                if (!file) return;

                if (!isAllowedCommentImage(file)) {
                  console.error(
                    "Unsupported comment media. Use JPEG, PNG, or GIF images up to 15MB."
                  );
                  event.target.value = "";
                  return;
                }

                try {
                  const response = await MediaApi.uploadMedia(file);
                  const mediaId = response?.id;
                  if (mediaId) {
                    setReplyAttachedMediaId(mediaId);
                    setReplyAttachedPreviewUrl(URL.createObjectURL(file));
                    setReplyPreviewIsRemote(false);
                  }
                } catch (error) {
                  console.error("Failed to upload reply media:", error);
                } finally {
                  event.target.value = "";
                }
              }}
            />

            <div className="min-w-0 flex-1">
              <input
                value={replyText}
                onChange={event => setReplyText(event.target.value)}
                placeholder={`Reply to u/${getCommentAuthor(comment)}...`}
                className="w-full bg-transparent py-2.5 text-sm leading-5 text-slate-100 placeholder-slate-500 focus:outline-none"
              />

              {replyAttachedPreviewUrl && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/40 p-3">
                  <img
                    src={replyAttachedPreviewUrl}
                    alt="attached"
                    className="h-16 w-16 rounded-xl border border-slate-700 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-200">
                      Image attached
                    </div>
                    <div className="text-xs text-slate-500">
                      This reply will include the uploaded image.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (replyAttachedPreviewUrl && !replyPreviewIsRemote) {
                          URL.revokeObjectURL(replyAttachedPreviewUrl);
                        }
                        setReplyAttachedPreviewUrl("");
                        setReplyAttachedMediaId(null);
                        setReplyPreviewIsRemote(false);
                      }}
                      className="mt-2 text-sm font-medium text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsReplying(false);
                setReplyText("");
                if (replyAttachedPreviewUrl && !replyPreviewIsRemote) {
                  URL.revokeObjectURL(replyAttachedPreviewUrl);
                }
                setReplyAttachedPreviewUrl("");
                setReplyAttachedMediaId(null);
                setReplyPreviewIsRemote(false);
              }}
              className="px-4 py-2 rounded-full text-sm font-medium text-slate-400 transition-all hover:bg-slate-800/50 hover:text-slate-200 shrink-0"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!replyText.trim() && !replyAttachedMediaId}
              className="shrink-0 rounded-full bg-linear-to-r from-orange-500 to-orange-600 px-5 py-2 text-sm font-bold text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reply
            </button>
          </div>
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
              onEditComment={onEditComment}
              currentUsername={currentUsername}
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

function getCommentAvatarUrl(comment) {
  const avatarMediaId = comment.authorAvatarMediaId;
  return avatarMediaId ? MediaApi.getFullMediaUrl(avatarMediaId) : null;
}

function getInitials(comment) {
  return getCommentAuthor(comment)
    .split(" ")
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
