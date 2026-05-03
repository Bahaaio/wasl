import { useMemo, useState } from "react";
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
import {
  MOCK_COMMUNITIES,
  MOCK_POST_DETAIL_COMMENTS,
  MOCK_POSTS,
} from "../data/mockData.js";

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [comments, setComments] = useState(() =>
    MOCK_POST_DETAIL_COMMENTS.map(comment => ({
      ...comment,
      upvoted: false,
      downvoted: false,
    }))
  );

  const post = useMemo(() => {
    const found = MOCK_POSTS.find(entry => String(entry.id) === String(postId));
    return found || MOCK_POSTS[0];
  }, [postId]);

  const community =
    MOCK_COMMUNITIES.find(entry => entry.name === post.community) ||
    MOCK_COMMUNITIES[0];

  const handleCommentVote = (commentId, direction) => {
    setComments(currentComments =>
      currentComments.map(comment => {
        if (comment.id !== commentId) {
          return comment;
        }

        const isUpvote = direction === "up";
        const isDownvote = direction === "down";

        const nextUpvoted = isUpvote ? !comment.upvoted : false;
        const nextDownvoted = isDownvote ? !comment.downvoted : false;
        const scoreDelta = isUpvote
          ? comment.upvoted
            ? -1
            : comment.downvoted
              ? 2
              : 1
          : comment.downvoted
            ? -1
            : comment.upvoted
              ? -2
              : 1;

        return {
          ...comment,
          upvoted: nextUpvoted,
          downvoted: nextDownvoted,
          score: Math.max(0, comment.score + scoreDelta),
        };
      })
    );
  };

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

            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-200">
                  {post.community}
                </span>
                <span>•</span>
                <span>posted by u/{post.author}</span>
                <span>•</span>
                <span>{post.time}</span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {post.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                  <ArrowBigUp className="h-4 w-4 text-orange-400" />
                  {post.upvotes}
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                  <ArrowBigDown className="h-4 w-4 text-slate-400" />
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/70 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments}
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

              <div className="mt-5 space-y-4">
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    className={`rounded-2xl border border-slate-800 bg-slate-950/50 p-4 ${comment.sticky ? "ring-1 ring-orange-500/20" : ""}`}
                  >
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="font-semibold text-white">
                        {comment.author}
                      </span>
                      {comment.isOp && (
                        <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                          OP
                        </span>
                      )}
                      {comment.sticky && (
                        <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                          MOD
                        </span>
                      )}
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{comment.time}</span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-200">
                      {comment.body}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <div className="inline-flex items-center gap-1 rounded-full bg-slate-800/70 px-3 py-1.5">
                        <button
                          type="button"
                          onClick={() => handleCommentVote(comment.id, "up")}
                          className={`rounded-full p-1 transition-colors ${
                            comment.upvoted
                              ? "text-orange-400"
                              : "hover:text-orange-300"
                          }`}
                          aria-label="Upvote comment"
                        >
                          <ArrowBigUp className="h-4 w-4" />
                        </button>
                        <span className="min-w-5 text-center text-sm font-semibold text-slate-200">
                          {comment.score}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCommentVote(comment.id, "down")}
                          className={`rounded-full p-1 transition-colors ${
                            comment.downvoted
                              ? "text-indigo-400"
                              : "hover:text-indigo-300"
                          }`}
                          aria-label="Downvote comment"
                        >
                          <ArrowBigDown className="h-4 w-4" />
                        </button>
                      </div>
                      <button className="rounded-full bg-slate-800/70 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-orange-300">
                        Reply
                      </button>
                      <button className="rounded-full bg-slate-800/70 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-slate-200">
                        Award
                      </button>
                      <button className="rounded-full bg-slate-800/70 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-slate-200">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
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
                    {community.name.replace("r/", "r/")}
                  </h2>
                </div>
                <div
                  className={`h-12 w-12 rounded-full bg-linear-to-br ${community.accent}`}
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {community.members} and counting.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                About this post
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This page now opens as its own comments screen, similar to
                Reddit's post view.
              </p>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
