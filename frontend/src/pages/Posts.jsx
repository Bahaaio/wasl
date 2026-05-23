/** @typedef {import("../api/types.js").PostDto} PostDto */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import PostCard from "../components/PostCard.jsx";
import { PostsApi } from "../api/posts.js";
import { UsersApi } from "../api/users.js";
import { useUser } from "../auth/useUser.jsx";

// No client-side persistence for votes — rely on server state.

export default function PostsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
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

        setPosts(response?.content ?? []);
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
    setPosts(response?.content ?? []);
  };

  const handleVote = async (postId, action) => {
    try {
      await PostsApi.votePost(postId, action);
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
    <AppLayout contentClassName="space-y-4">
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
    </AppLayout>
  );
}
