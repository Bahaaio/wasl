import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, ChevronRight, Zap, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import CameraButton from "../components/CameraButton.jsx";
import { UsersApi } from "../api/users.js";
import { PostsApi } from "../api/posts.js";
import { sortPostsByCreatedAtDesc } from "../api/util.js";
import { useUser } from "../auth/useUser.jsx";

const PROFILE_TABS = ["Overview", "Posts"];

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser, setUser: setAuthUser } = useUser();
  const profileUsername = username || loggedInUser?.username || "";
  const [activeTab, setActiveTab] = useState("overview");
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const getAvatarFallback = profile =>
    profile?.username
      ? profile.username
          .split(/[^a-zA-Z0-9]+/)
          .filter(Boolean)
          .map(part => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  const isOwnProfile = loggedInUser?.username === profileUsername;

  const loadUserPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    setPostsError(null);

    try {
      const response = await UsersApi.listUserPosts(profileUsername, {
        page: 0,
        size: 50,
        sort: ["createdAt,desc"],
      });

      setPosts(sortPostsByCreatedAtDesc(response?.content ?? []));
    } catch (err) {
      console.error("Failed to load profile posts:", err);
      setPosts([]);
      setPostsError("Failed to load user posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, [profileUsername]);

  // Fetch user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const userData = await UsersApi.getUserByUsername(profileUsername);
        setProfileUser(userData);

        if (userData?.avatarMediaId) {
          setAvatarUrl(UsersApi.getUserFullAvatarUrl(userData.avatarMediaId));
        } else {
          setAvatarUrl("");
        }

        if (userData?.bannerMediaId) {
          setBannerUrl(UsersApi.getUserFullBannerUrl(userData.bannerMediaId));
        } else {
          setBannerUrl("");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [profileUsername]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadUserPosts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUserPosts]);

  const handleVote = async (postId, action) => {
    try {
      await PostsApi.votePost(postId, action);
      await loadUserPosts();
    } catch (err) {
      console.error("Failed to vote on post:", err);
    }
  };

  const handleUpvote = postId => handleVote(postId, "UPVOTE");

  const handleDownvote = postId => handleVote(postId, "DOWNVOTE");

  const handleSave = postId => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  const startEditingPost = post => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const stopEditingPost = () => {
    setEditingPostId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleEditPostSubmit = async event => {
    event.preventDefault();

    if (!editingPostId) {
      return;
    }

    const nextTitle = editTitle.trim();
    const nextContent = editContent.trim();

    if (!nextTitle || !nextContent) {
      return;
    }

    setIsSavingPost(true);

    try {
      await PostsApi.patchPost(editingPostId, {
        title: nextTitle,
        content: nextContent,
      });

      await loadUserPosts();
      stopEditingPost();
    } catch (err) {
      console.error("Failed to update post:", err);
    } finally {
      setIsSavingPost(false);
    }
  };

  const handleDeletePost = async postId => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!isConfirmed) {
      return;
    }

    setDeletingPostId(postId);

    try {
      await PostsApi.deletePost(postId);
      if (editingPostId === postId) {
        stopEditingPost();
      }
      await loadUserPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setDeletingPostId(null);
    }
  };

  const memberAgeLabel = profileUser?.createdAt
    ? formatMemberAge(profileUser.createdAt)
    : "0 d";

  // Handle avatar upload to backend
  const handleAvatarUpload = async event => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (!isOwnProfile) {
      event.target.value = "";
      return;
    }

    setIsUploadingAvatar(true);
    const previewAvatarUrl = URL.createObjectURL(file);
    setAvatarUrl(previewAvatarUrl);

    try {
      const response = await UsersApi.updateCurrentUserAvatar(file);
      const nextMediaId = response?.mediaId;
      URL.revokeObjectURL(previewAvatarUrl);
      if (nextMediaId) {
        const nextUser = { ...loggedInUser, avatarMediaId: nextMediaId };
        setProfileUser(nextUser);
        setAuthUser(nextUser);
        setAvatarUrl(UsersApi.getUserFullAvatarUrl(nextMediaId));
      } else {
        setAvatarUrl("");
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      URL.revokeObjectURL(previewAvatarUrl);
      if (profileUser?.avatarMediaId) {
        setAvatarUrl(UsersApi.getUserFullAvatarUrl(profileUser.avatarMediaId));
      } else {
        setAvatarUrl("");
      }
      alert(
        err.response?.data?.message || err.message || "Failed to upload avatar"
      );
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  // Handle banner upload to backend
  const handleBannerUpload = async event => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      event.target.value = "";
      return;
    }

    if (!isOwnProfile) {
      event.target.value = "";
      return;
    }

    setIsUploadingBanner(true);
    const previewBannerUrl = URL.createObjectURL(file);
    setBannerUrl(previewBannerUrl);

    try {
      const response = await UsersApi.updateCurrentUserBanner(file);
      const nextMediaId = response?.mediaId;
      URL.revokeObjectURL(previewBannerUrl);
      if (nextMediaId) {
        const nextUser = { ...loggedInUser, bannerMediaId: nextMediaId };
        setProfileUser(nextUser);
        setAuthUser(nextUser);
        setBannerUrl(UsersApi.getUserFullBannerUrl(nextMediaId));
      } else {
        setBannerUrl("");
      }
    } catch (err) {
      console.error("Banner upload failed:", err);
      URL.revokeObjectURL(previewBannerUrl);
      if (profileUser?.bannerMediaId) {
        setBannerUrl(UsersApi.getUserFullBannerUrl(profileUser.bannerMediaId));
      } else {
        setBannerUrl("");
      }
      alert(
        err.response?.data?.message || err.message || "Failed to upload banner"
      );
    } finally {
      setIsUploadingBanner(false);
      event.target.value = "";
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayUser = profileUser || {
    username: profileUsername,
    followers: 0,
    karma: 0,
    contributions: posts.length,
    activeIn: "-",
    goldEarned: 0,
  };

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
              onClick={() => navigate(-1)}
              className="absolute left-3 top-3 z-10 p-2.5 rounded-full bg-slate-950/85 text-white border border-orange-400/70 shadow-lg shadow-slate-950/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-linear-to-br hover:from-orange-500/80 hover:to-red-600/80 hover:text-white hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/35"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            {isOwnProfile && (
              <CameraButton
                onClick={() => bannerInputRef.current?.click()}
                ariaLabel="Upload banner"
                disabled={isUploadingBanner}
                className="absolute right-3 top-3"
              />
            )}
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
                      getAvatarFallback(displayUser)
                    )}
                  </div>
                </div>
                {isOwnProfile && (
                  <CameraButton
                    onClick={() => avatarInputRef.current?.click()}
                    ariaLabel="Upload avatar"
                    disabled={isUploadingAvatar}
                    className="absolute right-1 bottom-1"
                  />
                )}
              </div>
            </div>

            <div className="pl-24 pr-0 sm:pl-36 sm:pr-52">
              <h1 className="text-3xl font-bold tracking-tight text-slate-100 sm:text-5xl">
                u/{displayUser.username}
              </h1>
              <p className="mt-1 text-slate-300 text-lg">
                Member • {memberAgeLabel}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 sm:absolute sm:right-6 sm:top-5 sm:mt-0">
              {isOwnProfile && (
                <button className="px-4 py-2 bg-slate-800/80 text-slate-100 rounded-lg border border-slate-700 hover:bg-slate-700 hover:border-orange-500/50 transition-all">
                  Edit profile
                </button>
              )}
              <button className="px-4 py-2 bg-linear-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-400 hover:to-red-500 shadow-lg hover:shadow-orange-500/50 transition-all">
                {isOwnProfile ? "Your Profile" : "Follow"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-2 border-b border-slate-800">
            {PROFILE_TABS.map(tab => (
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
              <button className="flex items-center gap-2 text-slate-300 transition-colors bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-800 group">
                <span>Showing user posts</span>
                <ChevronRight className="w-4 h-4" />
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
                    getAvatarFallback(displayUser)
                  )}
                </div>
                <button
                  onClick={() => navigate("/create-post")}
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
            {postsError ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
                {postsError}
              </div>
            ) : isLoadingPosts ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <div className="mb-6">
                  <Zap className="w-16 h-16 text-slate-600 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">
                  You don't have any posts yet
                </h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Once you post to a community, it will show up here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map(post => (
                  <div key={post.id} className="space-y-3">
                    <PostCard
                      post={post}
                      onUpvote={handleUpvote}
                      onDownvote={handleDownvote}
                      onSave={handleSave}
                    />

                    {isOwnProfile && (
                      <div className="flex flex-wrap items-center justify-end gap-2 px-1">
                        <button
                          type="button"
                          onClick={() => startEditingPost(post)}
                          className="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-1.5 text-sm text-slate-200 hover:border-orange-500/60 hover:text-orange-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletingPostId === post.id}
                          className="rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-sm text-red-200 hover:bg-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          {deletingPostId === post.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    )}

                    {isOwnProfile && editingPostId === post.id && (
                      <form
                        onSubmit={handleEditPostSubmit}
                        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3"
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={event => setEditTitle(event.target.value)}
                          placeholder="Post title"
                          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none focus:border-orange-500/70"
                        />
                        <textarea
                          value={editContent}
                          onChange={event => setEditContent(event.target.value)}
                          rows={5}
                          placeholder="Post content"
                          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none focus:border-orange-500/70"
                        />
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={stopEditingPost}
                            className="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-1.5 text-sm text-slate-200 hover:border-slate-500 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSavingPost}
                            className="rounded-full bg-linear-to-r from-orange-500 to-red-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isSavingPost ? "Saving..." : "Save changes"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
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
                    {displayUser.followers} followers
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/30 rounded p-3 border border-slate-800/50">
                    <div className="text-2xl font-bold bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                      {displayUser.karma}
                    </div>
                    <div className="text-xs text-slate-400">Karma</div>
                  </div>
                  <div className="bg-slate-800/30 rounded p-3 border border-slate-800/50">
                    <div className="text-2xl font-bold text-slate-100">
                      {displayUser.contributions}
                    </div>
                    <div className="text-xs text-slate-400">Contributions</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-lg font-bold text-slate-100">
                      {memberAgeLabel}
                    </div>
                    <div className="text-xs text-slate-400">Reddit Age</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-100">
                      {displayUser.activeIn}
                    </div>
                    <div className="text-xs text-slate-400">Active in</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="text-lg font-bold text-slate-100">
                    {displayUser.goldEarned}
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

function formatMemberAge(createdAt) {
  const createdTimestamp = new Date(createdAt).getTime();

  if (Number.isNaN(createdTimestamp)) {
    return "0 d";
  }

  const days = Math.max(
    1,
    Math.floor((Date.now() - createdTimestamp) / (1000 * 60 * 60 * 24))
  );

  if (days < 30) {
    return `${days} d`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} mo`;
  }

  const years = Math.floor(months / 12);
  return `${years} yr`;
}
