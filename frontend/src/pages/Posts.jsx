import { useEffect, useState } from "react";
import {
  ArrowBigUp,
  ChevronDown,
  CircleHelp,
  Compass,
  Flame,
  Home,
  MessageCircle,
  Menu,
  Newspaper,
  Share2,
  Users,
  BookOpen,
  Rocket,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";

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
];

const COMMUNITIES = [
  { name: "r/javascript", members: "2.4M members", accent: "from-orange-500 to-red-500" },
  { name: "r/reactjs", members: "1.8M members", accent: "from-indigo-500 to-cyan-500" },
  { name: "r/webdev", members: "1.2M members", accent: "from-emerald-500 to-teal-500" },
  { name: "r/frontend", members: "840K members", accent: "from-pink-500 to-rose-500" },
];

export default function PostsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );
  const [resourcesOpen, setResourcesOpen] = useState(true);
  const [posts, setPosts] = useState(POSTS);

  useEffect(() => {
    const handleEscape = event => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
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
      <div className="relative flex min-h-[calc(100vh-4rem)] overflow-hidden">
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="fixed left-0 top-22 z-40 inline-flex h-12 w-10 items-center justify-center rounded-r-full border border-l-0 border-slate-800 bg-slate-900/95 text-slate-100 shadow-lg shadow-black/30 transition-colors hover:bg-slate-800"
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
          className={`fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-80 max-w-[85vw] shrink-0 border-r border-slate-800 bg-slate-950 overflow-y-overlay transition-transform duration-300 ease-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] xl:w-96 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!isSidebarOpen}
        >
          <button
            type="button"
            onClick={() => setIsSidebarOpen(current => !current)}
            className="fixed right-0 top-20 z-50 inline-flex h-10 w-10 translate-x-1/2 items-center justify-center rounded-full border border-slate-500 bg-slate-950 text-slate-100 shadow-lg shadow-black/30 transition-colors hover:bg-slate-900 md:absolute md:right-0 md:top-6"
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

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-8">
          <div className="max-w-3xl space-y-4">
            {posts.map(post => (
              <article
                key={post.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="flex items-start gap-4">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1 text-slate-400 shrink-0 bg-slate-800/50 rounded-xl p-2">
                    <button
                      type="button"
                      onClick={() => handleUpvote(post.id)}
                      className={`p-1 rounded transition-colors ${
                        post.upvoted
                          ? "text-orange-500 bg-orange-500/10"
                          : "hover:text-orange-400 hover:bg-slate-700"
                      }`}
                      aria-label="Upvote"
                    >
                      <ArrowBigUp className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold">
                      {post.upvotes}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownvote(post.id)}
                      className={`p-1 rounded transition-colors ${
                        post.downvoted
                          ? "text-indigo-500 bg-indigo-500/10"
                          : "hover:text-indigo-400 hover:bg-slate-700"
                      }`}
                      aria-label="Downvote"
                    >
                      <ArrowBigUp className="w-5 h-5 rotate-180" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-200">
                        {post.community}
                      </span>{" "}
                      • posted by u/{post.author} • {post.time}
                    </p>
                    <h2 className="text-lg font-semibold mb-3">{post.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button className="inline-flex items-center gap-1.5 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments} comments
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSave(post.id)}
                        className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
                          post.saved
                            ? "text-orange-400 bg-orange-500/10"
                            : "text-slate-300 bg-slate-800/50 hover:bg-slate-700"
                        }`}
                        aria-label="Save post"
                      >
                        <Award className="w-4 h-4" />
                        Save
                      </button>
                      <button className="inline-flex items-center gap-1.5 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        <aside className="hidden xl:block w-80 shrink-0 pt-24 pb-8 pr-6">
          <div className="sticky top-24 space-y-4">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Communities</h3>
                <Users className="w-5 h-5 text-slate-400" />
              </div>

              <div className="space-y-3">
                {COMMUNITIES.map(community => (
                  <button
                    key={community.name}
                    type="button"
                    className="w-full flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-left transition-colors hover:bg-slate-800/80 hover:border-slate-700"
                  >
                    <div className={`h-10 w-10 rounded-full bg-linear-to-br ${community.accent} flex items-center justify-center text-white font-bold`}>
                      {community.name.slice(2, 3).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-100 truncate">{community.name}</p>
                      <p className="text-xs text-slate-400">{community.members}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold text-white mb-3">Trending now</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p className="rounded-xl bg-slate-950/60 px-3 py-3 border border-slate-800">#ReactOptimization</p>
                <p className="rounded-xl bg-slate-950/60 px-3 py-3 border border-slate-800">#FrontendTips</p>
                <p className="rounded-xl bg-slate-950/60 px-3 py-3 border border-slate-800">#UIAnimation</p>
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
