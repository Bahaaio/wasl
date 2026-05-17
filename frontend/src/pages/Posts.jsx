import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import SideBar from "../components/SideBar.jsx";
import { MOCK_POSTS, MOCK_COMMUNITIES } from "../data/mockData.js";

export default function PostsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );
  const [posts, setPosts] = useState(MOCK_POSTS);

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

  const handleUpvote = postId => {
    setPosts(
      posts.map(post =>
        post.id === postId
          ? { ...post, upvoted: !post.upvoted, downvoted: false }
          : post
      )
    );
  };

  const handleDownvote = postId => {
    setPosts(
      posts.map(post =>
        post.id === postId
          ? { ...post, downvoted: !post.downvoted, upvoted: false }
          : post
      )
    );
  };

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

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-0 xl:pr-96">
          <div className="max-w-3xl space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
                onSave={handleSave}
              />
            ))}
          </div>
        </main>

        <aside className="hidden xl:block w-80 shrink-0 fixed right-0 top-16 h-[calc(100vh-4rem)] pr-6">
          <div className="h-full space-y-4 pt-8 pb-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Communities
                </h3>
                <Users className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-3">
                {MOCK_COMMUNITIES.map(community => (
                  <button
                    key={community.name}
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-left transition-colors hover:bg-slate-800/80 hover:border-slate-700"
                  >
                    <div
                      className={`h-10 w-10 rounded-full bg-linear-to-br ${community.accent} flex items-center justify-center text-white font-bold`}
                    >
                      {community.name.slice(2, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-100 truncate">
                        {community.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {community.members}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

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
