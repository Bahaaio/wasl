/**
 * @typedef {import("../api/types.js").PostDto} PostDto
 * @typedef {import("../api/types.js").CommentDto} CommentDto
 * @typedef {import("../api/types.js").MediaDto} MediaDto
 */

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBigUp,
  ArrowBigDown,
  ChevronLeft,
  MessageCircle,
  Share2,
  Image,
  Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import CommentsList from "../components/CommentsList.jsx";
import { CommentsApi, setCommentLocalVote } from "../api/comments.js";
import { CommunitiesApi } from "../api/communities.js";
import {
  PostsApi,
  getPostNetVoteScore,
  setPostLocalVote,
} from "../api/posts.js";
import { MediaApi } from "../api/media.js";
import MediaCarousel from "../components/MediaCarousel.jsx";
import { useUser } from "../auth/useUser.jsx";

const communityIconCache = new Map();

function normalizeCommunitySlug(value) {
  return String(value || "")
    .trim()
    .replace(/^r\//i, "");
}

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user: loggedInUser } = useUser();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [attachedMediaId, setAttachedMediaId] = useState(null);
  const [attachedPreviewUrl, setAttachedPreviewUrl] = useState("");
  const [communityIconMediaId, setCommunityIconMediaId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    commentId: null,
  });

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [postResponse, commentsResponse] = await Promise.all([
        PostsApi.getPostById(postId),
        PostsApi.listPostComments(postId, { page: 0, size: 20 }),
      ]);

      setPost(postResponse);
      setComments(commentsResponse?.comments ?? []);
    } catch (err) {
      console.error("Failed to load post detail:", err);
      setError("Failed to load post details.");
      setPost(null);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (!postId) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      void loadPost();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadPost, postId]);

  const handlePostVote = async action => {
    if (!post?.id) {
      return;
    }

    try {
      await PostsApi.votePost(post.id, action);
      setPostLocalVote(post.id, action);
      await loadPost();
    } catch (err) {
      console.error("Failed to vote on post:", err);
    }
  };

  const handleCommentVote = async (commentId, action) => {
    try {
      await CommentsApi.voteComment(commentId, action);
      setCommentLocalVote(commentId, action);
      const commentsResponse = await PostsApi.listPostComments(postId, {
        page: 0,
        size: 20,
      });
      setComments(commentsResponse?.comments ?? []);
    } catch (err) {
      console.error("Failed to vote on comment:", err);
    }
  };

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;

    setIsSubmittingComment(true);
    try {
      await CommentsApi.reply(postId, {
        content: commentInput,
        mediaId: attachedMediaId,
      });
      setCommentInput("");
      if (attachedPreviewUrl) {
        URL.revokeObjectURL(attachedPreviewUrl);
      }
      setAttachedPreviewUrl("");
      setAttachedMediaId(null);
      await loadPost();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplyToComment = async (parentId, content, mediaId = null) => {
    const trimmedContent = content.trim();
    if (!trimmedContent && !mediaId) return;

    setIsSubmittingComment(true);
    try {
      await CommentsApi.reply(postId, {
        content: trimmedContent,
        parentId,
        mediaId,
      });
      await loadPost();
    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEditComment = async (commentId, content, mediaId = null) => {
    try {
      await CommentsApi.patchComment(commentId, {
        content,
        mediaId: mediaId ?? undefined,
      });
      await loadPost();
    } catch (err) {
      console.error("Failed to update comment:", err);
      throw err;
    }
  };

  const handleDeleteComment = async commentId => {
    setDeleteConfirm({ isOpen: true, commentId });
  };

  const confirmDeleteComment = async () => {
    if (!deleteConfirm.commentId) return;
    try {
      const prevScrollY = window.scrollY || 0;
      await CommentsApi.deleteComment(deleteConfirm.commentId);
      await loadPost();
      // restore scroll to avoid jumping to top after re-render
      window.scrollTo({ top: prevScrollY, left: 0 });
      setDeleteConfirm({ isOpen: false, commentId: null });
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setDeleteConfirm({ isOpen: false, commentId: null });
    }
  };

  const communityName = post?.communityName ?? "Community";
  const authorUsername = post?.authorUsername ?? "unknown";
  const createdAt = post?.createdAt ? formatRelativeTime(post.createdAt) : "";
  const postVote = post?.vote ?? "NONE";
  const isDeleted = post?.deleted === true;
  const deletedMessage =
    "Sorry, this post was deleted by the person who originally posted it.";

  useEffect(() => {
    if (!post) {
      // Defer setState to avoid synchronous update inside effect
      Promise.resolve().then(() => setCommunityIconMediaId(null));
      return undefined;
    }

    const directIcon =
      post.communityIconMediaId ??
      post.iconMediaId ??
      post.community?.iconMediaId;
    if (directIcon) {
      Promise.resolve().then(() => setCommunityIconMediaId(directIcon));
      return undefined;
    }

    const communitySlug = normalizeCommunitySlug(post.communityName);
    if (!communitySlug) {
      Promise.resolve().then(() => setCommunityIconMediaId(null));
      return undefined;
    }

    const cachedIcon = communityIconCache.get(communitySlug);
    if (cachedIcon !== undefined) {
      Promise.resolve().then(() => setCommunityIconMediaId(cachedIcon));
      return undefined;
    }

    let isMounted = true;
    CommunitiesApi.getCommunityByName(communitySlug)
      .then(data => {
        if (!isMounted) return;
        const nextIcon = data?.iconMediaId ?? null;
        setCommunityIconMediaId(nextIcon);
        communityIconCache.set(communitySlug, nextIcon);
      })
      .catch(() => {
        if (!isMounted) return;
        setCommunityIconMediaId(null);
        communityIconCache.set(communitySlug, null);
      });

    return () => {
      isMounted = false;
    };
  }, [post]);

  const getVoteButtonClassName = direction => {
    const baseClasses =
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all";

    if (direction === "UPVOTE") {
      return `${baseClasses} ${
        postVote === "UPVOTE"
          ? "bg-orange-500/20 text-orange-200 ring-1 ring-orange-500/40 shadow-[0_0_0_1px_rgba(249,115,22,0.12)]"
          : "bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-orange-300"
      }`;
    }

    return `${baseClasses} ${
      postVote === "DOWNVOTE"
        ? "bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40 shadow-[0_0_0_1px_rgba(99,102,241,0.12)]"
        : "bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-indigo-300"
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="modal-cinematic-orbit absolute inset-[-35%]" />
            <div className="modal-cinematic-sweep absolute inset-0" />
            <div className="modal-cinematic-shimmer absolute inset-0" />
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold text-white mb-2">
              Delete Comment?
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, commentId: null })
                }
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteComment}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-all font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-400 gap-6 px-4 pb-10 pt-20 sm:px-6 lg:px-8">
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-4xl">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-orange-500/40 hover:text-orange-300"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            {isLoading ? (
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20 text-slate-400">
                Loading post...
              </article>
            ) : error ? (
              <article className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
                {error}
              </article>
            ) : post ? (
              <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-2">
                    {communityIconMediaId ? (
                      <img
                        src={MediaApi.getThumbnailMediaUrl(
                          communityIconMediaId
                        )}
                        alt={`${communityName} avatar`}
                        className="h-5 w-5 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-slate-700/70 border border-slate-600" />
                    )}
                    <span className="font-semibold text-slate-200">
                      {communityName}
                    </span>
                  </span>
                  <span>•</span>
                  <span>posted by u/{authorUsername}</span>
                  <span>•</span>
                  <span>{createdAt}</span>
                </div>

                {!isDeleted && (
                  <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {post.title}
                  </h1>
                )}

                {isDeleted ? (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
                    <Trash2 className="h-4 w-4 text-red-400" />
                    <span>{deletedMessage}</span>
                  </div>
                ) : (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                    {post.content}
                  </p>
                )}

                {post.media && post.media.length > 0 && (
                  <div className="mt-6 rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950">
                    {post.media.length === 1 ? (
                      <div className="relative w-full flex items-center justify-center overflow-hidden">
                        <div
                          className="absolute inset-0 bg-center bg-cover filter blur-2xl scale-105"
                          style={{
                            backgroundImage: `url(${MediaApi.getFullMediaUrl(post.media[0].id)})`,
                          }}
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-0 bg-black/40"
                          aria-hidden="true"
                        />
                        <img
                          src={MediaApi.getFullMediaUrl(post.media[0].id)}
                          alt="Post media"
                          className="relative z-10 max-h-[70vh] md:max-h-[70vh] lg:max-h-[80vh] w-auto object-contain mx-auto"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <MediaCarousel media={post.media} />
                    )}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handlePostVote(postVote === "UPVOTE" ? "NONE" : "UPVOTE")
                    }
                    disabled={isDeleted}
                    className={getVoteButtonClassName("UPVOTE")}
                    aria-pressed={postVote === "UPVOTE"}
                    aria-label="Upvote post"
                  >
                    <ArrowBigUp
                      className={`h-4 w-4 ${
                        postVote === "UPVOTE"
                          ? "text-orange-200"
                          : "text-orange-400"
                      }`}
                    />
                  </button>
                  <span className="inline-flex min-w-11 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/50 px-3 py-1.5 text-sm font-semibold text-slate-200">
                    {formatCompactNumber(getPostNetVoteScore(post))}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handlePostVote(
                        postVote === "DOWNVOTE" ? "NONE" : "DOWNVOTE"
                      )
                    }
                    disabled={isDeleted}
                    className={getVoteButtonClassName("DOWNVOTE")}
                    aria-pressed={postVote === "DOWNVOTE"}
                    aria-label="Downvote post"
                  >
                    <ArrowBigDown
                      className={`h-4 w-4 ${
                        postVote === "DOWNVOTE"
                          ? "text-indigo-200"
                          : "text-slate-400"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {post.commentCount}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </article>
            ) : null}

            <div className="mt-5 rounded-3xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-lg shadow-black/20 transition-all hover:border-slate-600 focus-within:border-blue-500/50 focus-within:shadow-blue-500/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700/80 bg-slate-950/50 text-slate-400 transition-colors hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
                  onClick={() => {
                    // trigger hidden file input
                    const el = document.getElementById("comment-image-input");
                    if (el) el.click();
                  }}
                >
                  <Image className="h-5 w-5" />
                </button>
                <input
                  id="comment-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      setIsSubmittingComment(true);
                      const resp = await MediaApi.uploadMedia(file);
                      const mediaId =
                        resp?.mediaId ?? resp?.id ?? resp?.media?.id;
                      if (mediaId) {
                        setAttachedMediaId(mediaId);
                        const preview = URL.createObjectURL(file);
                        setAttachedPreviewUrl(preview);
                      }
                    } catch (err) {
                      console.error("Failed to upload media:", err);
                    } finally {
                      setIsSubmittingComment(false);
                      // clear the input so same file can be selected again
                      e.target.value = "";
                    }
                  }}
                />
                {attachedPreviewUrl && (
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-950/40 p-3">
                    <img
                      src={attachedPreviewUrl}
                      alt="attached"
                      className="h-16 w-16 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-200">
                        Image attached
                      </div>
                      <div className="text-xs text-slate-500">
                        This will be posted with your comment.
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(attachedPreviewUrl);
                          setAttachedPreviewUrl("");
                          setAttachedMediaId(null);
                        }}
                        className="mt-2 text-sm font-medium text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
                <input
                  type="text"
                  value={commentInput}
                  onChange={e => setCommentInput(e.target.value)}
                  placeholder="Join the conversation..."
                  className="min-w-0 flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm leading-10"
                  onKeyDown={e => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      commentInput.trim()
                    ) {
                      handleAddComment();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setCommentInput("")}
                  className="px-4 py-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all text-sm font-medium shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!commentInput.trim() || isSubmittingComment}
                  className="px-5 py-2 rounded-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all text-sm font-bold shrink-0"
                >
                  {isSubmittingComment ? "..." : "Comment"}
                </button>
              </div>
            </div>

            <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="mt-5">
                <CommentsList
                  comments={comments}
                  onUpvote={(commentId, action) =>
                    handleCommentVote(commentId, action)
                  }
                  onDownvote={(commentId, action) =>
                    handleCommentVote(commentId, action)
                  }
                  onReply={handleReplyToComment}
                  onDelete={handleDeleteComment}
                  onEditComment={handleEditComment}
                  currentUsername={loggedInUser?.username ?? ""}
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
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

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
