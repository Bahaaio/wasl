import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Share2, ChevronRight, MessageSquare, Zap, Camera } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import {
  MOCK_POSTS,
  MOCK_PROFILE_TABS,
  MOCK_PROFILE_USER,
} from "../data/mockData.js";

export default function UserProfile() {
  const { username } = useParams();
  const profileUsername = username || "Dismal-Low1544";
  const [activeTab, setActiveTab] = useState("overview");
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [avatarUrl, setAvatarUrl] = useState(() => {
    try {
      const saved = localStorage.getItem(`wasl-profile-media-${profileUsername}`);
      if (!saved) {
        return "";
      }
      const parsed = JSON.parse(saved);
      return parsed.avatarUrl || "";
    } catch {
      return "";
    }
  });
  const [bannerUrl, setBannerUrl] = useState(() => {
    try {
      const saved = localStorage.getItem(`wasl-profile-media-${profileUsername}`);
      if (!saved) {
        return "";
      }
      const parsed = JSON.parse(saved);
      return parsed.bannerUrl || "";
    } catch {
      return "";
    }
  });
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const updatePosts = updatePost => {
    setPosts(currentPosts =>
      currentPosts.map(post => updatePost(post))
    );
  };

  const handleUpvote = postId => {
    updatePosts(post =>
      post.id === postId
        ? {
            ...post,
            upvoted: !post.upvoted,
            downvoted: post.upvoted ? false : post.downvoted,
          }
        : post
    );
  };

  const handleDownvote = postId => {
    updatePosts(post =>
      post.id === postId
        ? {
            ...post,
            downvoted: !post.downvoted,
            upvoted: post.downvoted ? false : post.upvoted,
          }
        : post
    );
  };

  const handleSave = postId => {
    updatePosts(post =>
      post.id === postId ? { ...post, saved: !post.saved } : post
    );
  };

  useEffect(() => {
    localStorage.setItem(
      `wasl-profile-media-${profileUsername}`,
      JSON.stringify({ avatarUrl, bannerUrl })
    );
  }, [avatarUrl, bannerUrl, profileUsername]);

  const readImageFile = (file, onSuccess) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onSuccess(String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = event => {
    const file = event.target.files?.[0];
    readImageFile(file, setAvatarUrl);
    event.target.value = "";
  };

  const handleBannerUpload = event => {
    const file = event.target.files?.[0];
    readImageFile(file, setBannerUrl);
    event.target.value = "";
  };

  const user = {
    ...MOCK_PROFILE_USER,
    username: profileUsername,
  };

  const filteredPosts = useMemo(() => {
    switch (activeTab) {
      case "posts":
      case "overview":
        return posts;
      case "saved":
        return posts.filter(p => p.saved);
      case "upvoted":
        return posts.filter(p => p.upvoted);
      case "downvoted":
        return posts.filter(p => p.downvoted);
      default:
        return [];
    }
  }, [activeTab, posts]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBannerUpload}
      />
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Profile Header */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-800/70">
          <div className="relative h-24 sm:h-36">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt="Profile banner"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="relative h-full w-full overflow-hidden bg-slate-100">
                <div className="absolute -right-10 -top-8 h-36 w-36 rounded-full border-18 border-cyan-500/75" />
                <div className="absolute right-16 -top-10 h-44 w-44 rounded-full border-18 border-orange-500/75" />
                <div className="absolute right-0 top-2 h-28 w-28 rounded-full border-14 border-sky-400/70" />
              </div>
            )}
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-slate-200 border border-slate-700 hover:border-orange-500/60 hover:text-orange-300 transition-colors"
              aria-label="Upload banner"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="relative bg-[#020a1f] px-4 pb-4 pt-7 sm:px-6 sm:pb-5 sm:pt-8">
            <div className="absolute -top-11 left-4 sm:-top-16 sm:left-6">
              <div className="relative h-22 w-22 sm:h-30 sm:w-30">
                <div className="h-full w-full rounded-full bg-slate-100 p-1.5 shadow-xl">
                  <div className="h-full w-full overflow-hidden rounded-full bg-linear-to-br from-orange-500 to-red-600 border-4 border-[#020a1f] flex items-center justify-center text-white font-bold text-lg sm:text-2xl">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.avatar
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute right-1 bottom-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-600 text-slate-300 hover:text-orange-300 hover:border-orange-500/60 transition-colors"
                  aria-label="Upload avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pl-24 pr-0 sm:pl-36 sm:pr-52">
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl">
                u/{user.username}
              </h1>
              <p className="mt-1 text-slate-300 text-lg">Member • {user.redditAge}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:absolute sm:right-6 sm:top-5 sm:mt-0">
              <button className="px-4 py-2 bg-slate-800/80 text-slate-100 rounded-lg border border-slate-700 hover:bg-slate-700 hover:border-orange-500/50 transition-all">
                Edit profile
              </button>
              <button className="px-4 py-2 bg-linear-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 shadow-lg hover:shadow-orange-500/50 transition-all">
                Follow
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 border-b border-slate-800">
            {MOCK_PROFILE_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.toLowerCase()
                    ? "text-orange-400 bg-orange-500/10 rounded-t-lg border-t border-l border-r border-orange-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Filter */}
            <div className="flex items-center justify-between mb-6">
              <button className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-800 hover:border-orange-500/30 group">
                <MessageSquare className="w-5 h-5 group-hover:text-orange-400" />
                <span>Showing all content</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Create Post Box */}
            <div className="mb-6">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-4 flex items-center gap-3 backdrop-blur-sm hover:bg-slate-900/50 hover:border-slate-700 transition-all">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-md overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.avatar
                  )}
                </div>
                <button
                  onClick={() => setActiveTab("create")}
                  className="flex-1 text-left text-slate-400 px-3 py-2 rounded hover:bg-slate-800/50 transition-colors"
                >
                  Create post in a community
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-3">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm text-slate-400 hover:text-orange-400 hover:bg-slate-800/50">
                  <span>Image</span>
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm text-slate-400 hover:text-orange-400 hover:bg-slate-800/50">
                  <span>Link</span>
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm text-slate-400 hover:text-orange-400 hover:bg-slate-800/50">
                  <span>Poll</span>
                </button>
              </div>
            </div>

            {/* Empty State / Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <div className="mb-6">
                  <Zap className="w-16 h-16 text-slate-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">
                  You don't have any posts yet
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Once you post to a community, it'll show up here. If you'd
                  rather hide your posts, update your settings.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onUpvote={handleUpvote}
                    onDownvote={handleDownvote}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Share Card */}
              <div className="bg-linear-to-br from-orange-500/20 to-red-600/20 rounded-lg p-4 border border-orange-500/30 backdrop-blur-sm hover:border-orange-500/50 transition-all relative overflow-hidden group">
                <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors"></div>
                <button className="flex items-center gap-2 text-orange-300 font-semibold hover:text-orange-200 px-3 py-2 rounded transition-colors relative z-10">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Stats */}
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-lg p-6 space-y-6 backdrop-blur-sm hover:border-slate-700 transition-all">
                <div>
                  <div className="text-slate-400 text-sm">
                    {user.followers} followers
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 rounded p-3 border border-slate-800/50">
                    <div className="text-2xl font-bold bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {user.karma}
                    </div>
                    <div className="text-xs text-slate-400">Karma</div>
                  </div>
                  <div className="bg-slate-800/30 rounded p-3 border border-slate-800/50">
                    <div className="text-2xl font-bold text-slate-100">
                      {user.contributions}
                    </div>
                    <div className="text-xs text-slate-400">Contributions</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-lg font-bold text-slate-100">
                      {user.redditAge}
                    </div>
                    <div className="text-xs text-slate-400">Reddit Age</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-100">
                      {user.activeIn}
                    </div>
                    <div className="text-xs text-slate-400">Active in</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-lg font-bold text-slate-100">
                    {user.goldEarned}
                  </div>
                  <div className="text-xs text-slate-400">Gold earned</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-lg p-6 backdrop-blur-sm hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-300">
                    ACHIEVEMENTS
                  </h3>
                  <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                    View all
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-lg shadow-lg hover:shadow-orange-500/50 transition-shadow">
                    ✨
                  </div>
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-600 to-red-700 flex items-center justify-center text-lg shadow-lg hover:shadow-red-600/50 transition-shadow">
                    🏅
                  </div>
                  <div className="w-12 h-12 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center hover:border-slate-500 transition-colors">
                    <span className="text-xs text-slate-400">+1</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400">2 unlocked</div>
              </div>

              {/* Settings */}
              <div className="bg-slate-900/40 border border-slate-800/60 rounded-lg p-6 backdrop-blur-sm hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-slate-300">SETTINGS</h3>
                  <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                    Manage
                  </button>
                </div>

                <div className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 rounded transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white group-hover:shadow-orange-500/50 group-hover:shadow-lg transition-shadow">
                      👤
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200">
                        Profile
                      </div>
                      <div className="text-xs text-slate-400">
                        Customize your profile
                      </div>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-orange-500/20 text-orange-300 rounded-lg border border-orange-500/30 hover:bg-orange-500/30 hover:border-orange-500/50 transition-all shrink-0">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
