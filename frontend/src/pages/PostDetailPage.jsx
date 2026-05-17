import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBigUp,
  ArrowBigDown,
  Award,
  ChevronLeft,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  Type,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import CommentsList from "../components/CommentsList.jsx";
import { CommentsApi } from "../api/comments.js";
import { PostsApi } from "../api/posts.js";

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
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
      await loadPost();
    } catch (err) {
      console.error("Failed to vote on post:", err);
    }
  };

  const handleCommentVote = async (commentId, action) => {
    try {
      await CommentsApi.voteComment(commentId, action);
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
      });
      setCommentInput("");
      await loadPost();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async commentId => {
    setDeleteConfirm({ isOpen: true, commentId });
  };

  const confirmDeleteComment = async () => {
    if (!deleteConfirm.commentId) return;
    try {
      await CommentsApi.deleteComment(deleteConfirm.commentId);
      await loadPost();
      setDeleteConfirm({ isOpen: false, commentId: null });
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setDeleteConfirm({ isOpen: false, commentId: null });
    }
  };

  const communityName = post?.communityName ?? "Community";
  const authorUsername = post?.authorUsername ?? "unknown";
  const createdAt = post?.createdAt ? formatRelativeTime(post.createdAt) : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, commentId: null })
                }
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all font-medium text-sm"
              >
                Cancel
              </button>
              <button
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
                  <span className="font-semibold text-slate-200">
                    {communityName}
                  </span>
                  <span>•</span>
                  <span>posted by u/{authorUsername}</span>
                  <span>•</span>
                  <span>{createdAt}</span>
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {post.title}
                </h1>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-200">
                  {post.content}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePostVote("UPVOTE")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    <ArrowBigUp className="h-4 w-4 text-orange-400" />
                    {post.score}
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePostVote("DOWNVOTE")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700"
                  >
                    <ArrowBigDown className="h-4 w-4 text-slate-400" />
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                    <MessageCircle className="h-4 w-4" />
                    {post.commentCount}
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                    <Award className="h-4 w-4" />
                    Award
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ) : null}

            <div className="mt-5 rounded-full border-2 border-slate-700 bg-slate-900/50 p-4 flex items-center gap-3 transition-all hover:border-slate-600 focus-within:border-blue-500/50">
              <button className="text-slate-400 hover:text-blue-400 transition-colors shrink-0">
                <Image className="h-5 w-5" />
              </button>
              <button className="text-slate-400 hover:text-blue-400 transition-colors shrink-0">
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
              <button className="text-slate-400 hover:text-blue-400 transition-colors shrink-0">
                <Type className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Join the conversation..."
                className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey && commentInput.trim()) {
                    handleAddComment();
                  }
                }}
              />
              <button
                onClick={() => setCommentInput("")}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all text-sm font-medium shrink-0"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                disabled={!commentInput.trim() || isSubmittingComment}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all text-sm font-bold shrink-0"
              >
                {isSubmittingComment ? "..." : "Comment"}
              </button>
            </div>

            <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="mt-5">
                <CommentsList
                  comments={comments}
                  onUpvote={commentId => handleCommentVote(commentId, "UPVOTE")}
                  onDownvote={commentId =>
                    handleCommentVote(commentId, "DOWNVOTE")
                  }
                  onDelete={handleDeleteComment}
                />
              </div>
            </section>
          </div>
        </main>

        <aside className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-20 space-y-4">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Community
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-white">
                    {communityName}
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                API-backed post view.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                About this post
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This page now reads real post and comment data from the API.
              </p>
            </section>
          </div>
        </aside>
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
