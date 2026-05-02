import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  Compass,
  Flame,
  Home,
  Menu,
  Newspaper,
  Share2,
  Users,
  BookOpen,
  Rocket,
  X,
  ImagePlus,
  Link2,
  BarChart3,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";

const POSTS = [
  {
    id: 1,
    community: "r/javascript",
    author: "frontendNinja",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "What is your favorite React optimization trick?",
    comments: 128,
    upvotes: "3.2k",
    time: "4h ago",
  },
  {
    id: 2,
    community: "r/webdev",
    author: "csswizard",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "Share your best UI animation examples",
    comments: 87,
    upvotes: "2.1k",
    time: "7h ago",
  },
  {
    id: 3,
    community: "r/reactjs",
    author: "stateManager",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "React Router v7: what changed for you?",
    comments: 64,
    upvotes: "1.6k",
    time: "10h ago",
  },
  {
    id: 4,
    community: "r/reactjs",
    author: "stateManager",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "React Router v7: what changed for you?",
    comments: 64,
    upvotes: "1.6k",
    time: "10h ago",
  },
  {
    id: 5,
    community: "r/reactjs",
    author: "stateManager",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "React Router v7: what changed for you?",
    comments: 64,
    upvotes: "1.6k",
    time: "10h ago",
  },
];

const COMMUNITIES = [
  {
    name: "r/javascript",
    members: "2.4M members",
    accent: "from-orange-500 to-red-500",
  },
  {
    name: "r/reactjs",
    members: "1.8M members",
    accent: "from-indigo-500 to-cyan-500",
  },

  {
    name: "r/frontend",
    members: "840K members",
    accent: "from-pink-500 to-rose-500",
  },
];

export default function PostsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );
  const [resourcesOpen, setResourcesOpen] = useState(true);
  const [posts, setPosts] = useState(POSTS);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [createPostError, setCreatePostError] = useState(null);
  const [createPostForm, setCreatePostForm] = useState({
    title: "",
    content: "",
    community: "r/javascript",
  });
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleEscape = event => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) {
      return undefined;
    }

    let timeoutId;
    const handleScroll = () => {
      sidebar.classList.add("sidebar-scroll--active");
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        sidebar.classList.remove("sidebar-scroll--active");
      }, 900);
    };

    sidebar.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sidebar.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

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

  const handleCreatePostChange = event => {
    const { name, value } = event.target;
    setCreatePostForm(previous => ({ ...previous, [name]: value }));
    setCreatePostError(null);
  };

  const handleCreatePostSubmit = async event => {
    event.preventDefault();
    
    // Validation
    if (!createPostForm.title.trim() || !createPostForm.content.trim()) {
      setCreatePostError("Title and content are required");
      return;
    }

    if (createPostForm.title.length < 3) {
      setCreatePostError("Title must be at least 3 characters");
      return;
    }

    if (createPostForm.content.length < 10) {
      setCreatePostError("Content must be at least 10 characters");
      return;
    }

    setIsCreatingPost(true);
    setCreatePostError(null);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/posts', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${accessToken}`,
      //   },
      //   body: JSON.stringify({
      //     title: createPostForm.title,
      //     content: createPostForm.content,
      //     communityName: createPostForm.community,
      //   }),
      // });

      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || 'Failed to create post');
      // }

      // const newPost = await response.json();
      // setPosts(previous => [newPost, ...previous]);

      console.log("Create post:", createPostForm);
      setCreatePostForm({ title: "", content: "", community: "r/javascript" });
      setIsCreatePostOpen(false);
    } catch (error) {
      setCreatePostError(error.message || "Failed to create post. Please try again.");
      console.error("Error creating post:", error);
    } finally {
      setIsCreatingPost(false);
    }
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
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="fixed left-0 top-24 z-40 inline-flex h-12 w-10 items-center justify-center rounded-r-full border border-l-0 border-slate-800 bg-slate-900/95 text-slate-100 shadow-lg shadow-black/30 transition-colors hover:bg-slate-800"
            aria-label="Open sidebar"
            aria-expanded={isSidebarOpen}
            aria-controls="posts-sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div
          className={`fixed inset-0 top-16 z-20 bg-slate-950/70 backdrop-blur-sm transition-opacity md:hidden ${
            isSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        <aside
          id="posts-sidebar"
          ref={sidebarRef}
          className={`sidebar-scroll fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 max-w-[80vw] shrink-0 border-r border-slate-800 bg-slate-950 overflow-y-auto transition-transform duration-300 ease-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] xl:w-72 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <button
            type="button"
            onClick={() => setIsSidebarOpen(current => !current)}
            className="fixed right-1 top-20 z-70 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-950 text-slate-100 shadow-lg shadow-black/30 transition-colors hover:bg-slate-900 md:absolute md:right-1 md:top-6"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            aria-controls="posts-sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="px-4 py-5 flex flex-col h-full">
            <div className="mb-4 md:hidden">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Menu
              </p>
            </div>
            <nav className="space-y-8 flex-1">
              <div className="space-y-1">
                <SidebarItem
                  icon={<Home className="w-5 h-5" />}
                  label="Home"
                  active
                />
                <SidebarItem
                  icon={<Compass className="w-5 h-5" />}
                  label="Popular"
                />
                <SidebarItem
                  icon={<Newspaper className="w-5 h-5" />}
                  label="News"
                />
                <SidebarItem
                  icon={<Rocket className="w-5 h-5" />}
                  label="Explore"
                />
              </div>

              <div className="border-t border-slate-800 pt-6">
                <button
                  type="button"
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="w-full flex items-center justify-between mb-4 px-2 hover:opacity-80 transition-opacity"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Resources
                  </p>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {resourcesOpen && (
                  <div className="space-y-1">
                    <SidebarItem
                      icon={<CircleHelp className="w-5 h-5" />}
                      label="About WASL"
                    />
                    <SidebarItem
                      icon={<Share2 className="w-5 h-5" />}
                      label="Advertise"
                    />
                    <SidebarItem
                      icon={<BookOpen className="w-5 h-5" />}
                      label="Developer Platform"
                    />
                    <SidebarItem
                      icon={<Flame className="w-5 h-5" />}
                      label="WASL Pro"
                      badge="BETA"
                    />
                    <SidebarItem
                      icon={<CircleHelp className="w-5 h-5" />}
                      label="Help"
                    />
                    <SidebarItem
                      icon={<BookOpen className="w-5 h-5" />}
                      label="Blog"
                    />
                    <SidebarItem
                      icon={<Users className="w-5 h-5" />}
                      label="Careers"
                    />
                    <SidebarItem
                      icon={<Share2 className="w-5 h-5" />}
                      label="Press"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-6">
                <SidebarItem
                  icon={<Flame className="w-5 h-5" />}
                  label="Best of WASL"
                />
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-0 xl:pr-96">
          <div className="max-w-3xl space-y-4">
            {/* Create Post Section */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-black/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="flex-1 bg-slate-800/50 text-slate-400 px-4 py-2.5 rounded-full border border-slate-700 hover:bg-slate-800 hover:text-slate-300 transition-all text-left"
                >
                  What's on your mind?
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 px-3 py-2 rounded-full hover:bg-slate-800/50 transition-colors text-sm">
                  <ImagePlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Image</span>
                </button>
                <button className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 px-3 py-2 rounded-full hover:bg-slate-800/50 transition-colors text-sm">
                  <Link2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Link</span>
                </button>
                <button className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 px-3 py-2 rounded-full hover:bg-slate-800/50 transition-colors text-sm">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Poll</span>
                </button>
              </div>
            </div>

            {/* Create Post Modal */}
            {isCreatePostOpen && (
              <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
                <button
                  type="button"
                  className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                  onClick={() => setIsCreatePostOpen(false)}
                  aria-label="Close create post modal"
                />
                <div className="relative w-full max-w-2xl">
                  <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-orange-500/40 to-red-600/40 blur-xl" />
                  <div className="relative bg-slate-900 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">
                        Create a post
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsCreatePostOpen(false)}
                        className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreatePostSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Community
                        </label>
                        <select
                          name="community"
                          value={createPostForm.community}
                          onChange={handleCreatePostChange}
                          disabled={isCreatingPost}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {COMMUNITIES.map(community => (
                            <option key={community.name} value={community.name}>
                              {community.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={createPostForm.title}
                          onChange={handleCreatePostChange}
                          placeholder="Enter post title"
                          maxLength="300"
                          disabled={isCreatingPost}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          required
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          {createPostForm.title.length}/300
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Content
                        </label>
                        <textarea
                          name="content"
                          value={createPostForm.content}
                          onChange={handleCreatePostChange}
                          placeholder="What's on your mind?"
                          rows="6"
                          maxLength="5000"
                          disabled={isCreatingPost}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                          required
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          {createPostForm.content.length}/5000
                        </p>
                      </div>

                      {createPostError && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                          {createPostError}
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCreatePostOpen(false);
                            setCreatePostError(null);
                          }}
                          disabled={isCreatingPost}
                          className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isCreatingPost}
                          className="flex-1 py-2.5 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCreatingPost ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

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
                {COMMUNITIES.map(community => (
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

function SidebarItem({ icon, label, active = false, badge }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
        active
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
      <span className="font-medium flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold tracking-wider text-orange-500">
          {badge}
        </span>
      )}
    </button>
  );
}
