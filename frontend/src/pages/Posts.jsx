/** @typedef {import("../api/types.js").PostDto} PostDto */
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout.jsx";
import PostCard from "../components/PostCard.jsx";
import { FeedApi } from "../api/feed.js";
import { PostsApi } from "../api/posts.js";

// No client-side persistence for votes — rely on server state.

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [authBlocked, setAuthBlocked] = useState(false);

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
   

      setIsLoading(true);
      setError(null);
      setNotice(null);

      try {
        const response = await FeedApi.getFeed({
          page: 0,
          size: 20,
          sort: "latest",
        });

        setPosts(response?.posts ?? []);
        setPage(0);
        setHasNext(Boolean(response?.page?.hasNext));
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        const status = err?.response?.status;
        if (status === 401) {
          setNotice("Your session expired. Log in again to load the feed.");
          setAuthBlocked(true);
          setError(null);
        } else {
          setError("Failed to load the feed.");
        }
        setPosts([]);
        setHasNext(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [authBlocked]);

  const refreshPosts = async () => {
    if (authBlocked) {
      return;
    }

    const response = await FeedApi.getFeed({
      page: 0,
      size: 20,
      sort: "latest",
    });
    setPosts(response?.posts ?? []);
    setPage(0);
    setHasNext(Boolean(response?.page?.hasNext));
  };

  const loadMore = async () => {
    if (authBlocked || isLoadingMore || !hasNext) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const response = await FeedApi.getFeed({
        page: nextPage,
        size: 20,
        sort: "latest",
      });

      setPosts(previous => [...previous, ...(response?.posts ?? [])]);
      setPage(nextPage);
      setHasNext(Boolean(response?.page?.hasNext));
    } catch (err) {
      console.error("Failed to load more posts:", err);
      setError("Failed to load more posts.");
    } finally {
      setIsLoadingMore(false);
    }
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
      {notice ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-100">
          {notice}
        </div>
      ) : isLoading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
          Loading feed...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
          No posts found in the feed.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              onSave={handleSave}
            />
          ))}
          {hasNext && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="rounded-full border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-slate-600 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMore ? "Loading more..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
