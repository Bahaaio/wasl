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

  const communityName = post?.communityName ?? "Community";
  const authorUsername = post?.authorUsername ?? "unknown";
  const createdAt = post?.createdAt ? formatRelativeTime(post.createdAt) : "";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

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

            <section className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm text-slate-300">
                  Sort by:{" "}
                  <span className="font-semibold text-white">Best</span>
                </div>
                <div className="rounded-full border border-slate-800 bg-slate-950/70 px-4 py-2 text-sm text-slate-400">
                  Search Comments
                </div>
              </div>

              <div className="mt-5">
                <CommentsList
                  comments={comments}
                  onUpvote={commentId => handleCommentVote(commentId, "UPVOTE")}
                  onDownvote={commentId =>
                    handleCommentVote(commentId, "DOWNVOTE")
                  }
                />
              </div>

              <div className="mt-5 rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-4 text-sm text-slate-400">
                Add a comment
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
