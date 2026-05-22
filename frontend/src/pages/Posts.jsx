/** @typedef {import("../api/types.js").PostDto} PostDto */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import SideBar from "../components/SideBar.jsx";
import { PostsApi } from "../api/posts.js";
import { UsersApi } from "../api/users.js";
import { useUser } from "../auth/useUser.jsx";

// Local storage key for client-side vote cache
const LOCAL_VOTES_KEY = "wasl.localPostVotes";

function readLocalVotes() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_VOTES_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeLocalVotes(map) {
  try {
    localStorage.setItem(LOCAL_VOTES_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function setPostLocalVote(postId, action) {
  const map = readLocalVotes();
  if (action === "NONE") {
    delete map[String(postId)];
  } else {
    map[String(postId)] = action;
  }
  writeLocalVotes(map);
}

function applyLocalVotesToPosts(posts) {
  const map = readLocalVotes();
  return (posts || []).map(p => {
    const action = map[String(p.id)];
    if (!action) return p;

    const previousVote =
      p.vote ?? (p.upvoted ? "UPVOTE" : p.downvoted ? "DOWNVOTE" : "NONE");

    let scoreDelta;
    if (previousVote === action) scoreDelta = 0;
    else if (previousVote === "NONE") scoreDelta = action === "UPVOTE" ? 1 : -1;
    else if (action === "NONE") scoreDelta = previousVote === "UPVOTE" ? -1 : 1;
    else scoreDelta = action === "UPVOTE" ? 2 : -2;

    const nextScore =
      typeof p.score === "number" && Number.isFinite(p.score)
        ? p.score + scoreDelta
        : p.score;

    return {
      ...p,
      vote: action,
      upvoted: action === "UPVOTE",
      downvoted: action === "DOWNVOTE",
      score: nextScore,
    };
  });
}

export default function PostsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 1024
  );
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const body = document.body;
    let timeoutId;
    const handleScroll = () => {
      body.classList.add("posts-scroll--active");
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        body.classList.remove("posts-scroll--active");
      }, 900);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      body.classList.remove("posts-scroll--active");
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.username) {
        setPosts([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await UsersApi.listUserPosts(user.username, {
          page: 0,
          size: 20,
          sort: ["createdAt,desc"],
        });

        // sort and apply local votes locally (no api changes required)
        const sorted = (response?.content ?? []).slice().sort((a, b) => {
          const at = new Date(a.createdAt).getTime();
          const bt = new Date(b.createdAt).getTime();
          return bt - at;
        });

        setPosts(applyLocalVotesToPosts(sorted));
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts.");
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user?.username]);

  const refreshPosts = async () => {
    if (!user?.username) {
      return;
    }

    const response = await UsersApi.listUserPosts(user.username, {
      page: 0,
      size: 20,
      sort: ["createdAt,desc"],
    });
    const sorted = (response?.content ?? []).slice().sort((a, b) => {
      const at = new Date(a.createdAt).getTime();
      const bt = new Date(b.createdAt).getTime();
      return bt - at;
    });

    setPosts(applyLocalVotesToPosts(sorted));
  };

  const handleVote = async (postId, action) => {
    try {
      await PostsApi.votePost(postId, action);
      setPostLocalVote(postId, action);
      await refreshPosts();
    } catch (err) {
      console.error("Failed to vote on post:", err);
    }
  };

  const handleUpvote = (postId, action = "UPVOTE") =>
    handleVote(postId, action);

  const handleDownvote = (postId, action = "DOWNVOTE") =>
    handleVote(postId, action);

  const handleSave = postId => {
    setPosts(
      posts.map(post =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="relative flex min-h-[calc(100vh-4rem)]">
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-0 lg:pr-96">
          <div className="max-w-3xl space-y-4">
            {!user?.username ? (
              <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-300">
                <h1 className="text-2xl font-bold text-white">Your posts</h1>
                <p className="mt-2 text-sm text-slate-400">
                  Log in to load your post history from the API.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mt-4 rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Go home
                </button>
              </section>
            ) : isLoading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
                Loading posts...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
                No posts found for {user.username}.
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpvote={handleUpvote}
                  onDownvote={handleDownvote}
                  onSave={handleSave}
                />
              ))
            )}
          </div>
        </main>

        <aside className="hidden lg:block w-80 shrink-0 fixed right-0 top-16 h-[calc(100vh-4rem)] pr-6">
          <div className="h-full space-y-4 pt-8 pb-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold text-white mb-3">
                Trending now
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p className="rounded-xl bg-slate-950/60 px-3 py-3 border border-slate-800">
                  #ReactOptimization
                </p>
                <p className="rounded-xl bg-slate-950/60 px-3 py-3 border border-slate-800">
                  #FrontendTips
                </p>
                <p className="rounded-xl bg-slate-950/60 px-3 py-3 border border-slate-800">
                  #UIAnimation
                </p>
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
