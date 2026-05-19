import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Ellipsis,
  Globe,
  Pin,
  Plus,
  Rows3,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import SideBar from "../components/SideBar.jsx";
import PostCard from "../components/PostCard.jsx";
import CameraButton from "../components/CameraButton.jsx";
import { CommunitiesApi } from "../api/communities.js";
import { MediaApi } from "../api/media.js";
import { PostsApi } from "../api/posts.js";
import { SearchApi } from "../api/search.js";
import { UsersApi } from "../api/users.js";
import { useUser } from "../auth/useUser.jsx";

function normalizeCommunityName(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/^r\//, "");
}

function formatDateLabel(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommunityProfilePage() {
  const { communitySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [isJoined, setIsJoined] = useState(false);
  const [isJoinSubmitting, setIsJoinSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [pageError, setPageError] = useState("");
  const [actionError, setActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [communityData, setCommunityData] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 1024
  );

  const communityFromState = location.state?.community;
  const slug = (communitySlug || "yourcommunity").toLowerCase();
  const communityName = `r/${slug}`;

  const community = {
    displayName: communityData?.name
      ? `r/${normalizeCommunityName(communityData.name)}`
      : communityFromState?.displayName || communityName,
    description:
      communityData?.description ||
      communityFromState?.description ||
      `Welcome to ${communityName}, a space where members share updates, clips, and discussions around what matters most to this community.`,
    visibility:
      typeof communityData?.isPublic === "boolean"
        ? communityData.isPublic
          ? "public"
          : "private"
        : communityFromState?.visibility || "public",
  };

  const highlights = Array.isArray(communityFromState?.highlights)
    ? communityFromState.highlights
    : [];
  const rules = Array.isArray(communityFromState?.rules)
    ? communityFromState.rules
    : [];
  const moderators = Array.isArray(communityFromState?.moderators)
    ? communityFromState.moderators
    : [];
  const memberCount =
    communityData?.subscribersCount ?? communityFromState?.memberCount;
  const onlineCount = communityFromState?.onlineCount;
  const createdAtLabel =
    communityFromState?.createdAtLabel ||
    formatDateLabel(communityData?.createdAt);
  const bannerUrl = communityData?.bannerMediaId
    ? MediaApi.getFullMediaUrl(communityData.bannerMediaId)
    : "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1900&q=80";
  const iconUrl = communityData?.iconMediaId
    ? MediaApi.getThumbnailMediaUrl(communityData.iconMediaId)
    : null;

  useEffect(() => {
    let mounted = true;

    const loadCommunityPage = async () => {
      setIsLoading(true);
      setPageError("");

      try {
        const requests = [
          CommunitiesApi.getCommunityByName(slug),
          SearchApi.searchPosts("", {
            c: slug,
            page: 0,
            size: 20,
            sort: ["createdAt,desc"],
          }),
          isLoggedIn
            ? UsersApi.listSubscribedCommunities({
                page: 0,
                size: 100,
                sort: ["name,asc"],
              })
            : Promise.resolve(null),
        ];

        const [communityResult, postsResult, subscribedResult] =
          await Promise.allSettled(requests);

        if (!mounted) {
          return;
        }

        if (communityResult.status === "fulfilled") {
          setCommunityData(communityResult.value);
        } else {
          setCommunityData(null);
          setPageError("Failed to load community details.");
        }

        if (postsResult.status === "fulfilled") {
          setCommunityPosts(postsResult.value?.content ?? []);
        } else {
          setCommunityPosts([]);
        }

        if (subscribedResult.status === "fulfilled" && subscribedResult.value) {
          const joined = (subscribedResult.value?.content ?? []).some(item => {
            const backendName = normalizeCommunityName(item?.name);
            return backendName === slug;
          });
          setIsJoined(joined);
        } else if (!isLoggedIn) {
          setIsJoined(false);
        }
      } catch {
        if (!mounted) {
          return;
        }

        setPageError("Failed to load community page.");
        setCommunityPosts([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadCommunityPage();

    return () => {
      mounted = false;
    };
  }, [slug, isLoggedIn]);

  const handleCreatePost = () => {
    setActionError("");
    if (!isJoined) {
      setActionError("Join this community before creating a post.");
      return;
    }
    navigate("/create-post");
  };

  const handleJoinToggle = async () => {
    setActionError("");

    if (!isLoggedIn) {
      setActionError("Log in first to join this community.");
      return;
    }

    setIsJoinSubmitting(true);
    try {
      if (isJoined) {
        await CommunitiesApi.leaveCommunity(slug);
      } else {
        await CommunitiesApi.joinCommunity(slug);
      }

      setIsJoined(previous => !previous);
      setCommunityData(previous => {
        if (!previous) {
          return previous;
        }

        const nextCount = Math.max(
          0,
          (previous.subscribersCount || 0) + (isJoined ? -1 : 1)
        );
        return {
          ...previous,
          subscribersCount: nextCount,
        };
      });
    } catch {
      setActionError("Failed to update community membership.");
    } finally {
      setIsJoinSubmitting(false);
    }
  };

  const handleBannerUpload = async event => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setActionError("");
    setIsUploadingBanner(true);

    try {
      const result = await CommunitiesApi.updateCommunityBanner(slug, file);
      const mediaId = result?.mediaId;

      if (mediaId) {
        setCommunityData(previous =>
          previous ? { ...previous, bannerMediaId: mediaId } : previous
        );
      }
    } catch {
      setActionError("Failed to upload community banner.");
    } finally {
      setIsUploadingBanner(false);
      event.target.value = "";
    }
  };

  const handleAvatarUpload = async event => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setActionError("");
    setIsUploadingAvatar(true);

    try {
      const result = await CommunitiesApi.updateCommunityIcon(slug, file);
      const mediaId = result?.mediaId;

      if (mediaId) {
        setCommunityData(previous =>
          previous ? { ...previous, iconMediaId: mediaId } : previous
        );
      }
    } catch {
      setActionError("Failed to upload community avatar.");
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const refreshCommunityPosts = async () => {
    const posts = await SearchApi.searchPosts("", {
      c: slug,
      page: 0,
      size: 20,
      sort: ["createdAt,desc"],
    });
    setCommunityPosts(posts?.content ?? []);
  };

  const handleVote = async (postId, action) => {
    setActionError("");
    try {
      await PostsApi.votePost(postId, action);
      await refreshCommunityPosts();
    } catch {
      setActionError("Failed to vote on post.");
    }
  };

  const handleUpvote = (postId, action = "UPVOTE") =>
    handleVote(postId, action);

  const handleDownvote = (postId, action = "DOWNVOTE") =>
    handleVote(postId, action);

  const handleSave = postId => {
    setCommunityPosts(previous =>
      previous.map(post =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500/30">
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

      <div className="relative flex min-h-[calc(100vh-4rem)]">
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="flex-1 px-4 pb-12 pt-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-350">
            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/30">
              <div className="relative h-36 sm:h-44">
                <img
                  src={bannerUrl}
                  alt="Community banner"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/65" />
                <button
                  type="button"
                  onClick={handleBack}
                  className="absolute left-3 top-3 z-20 inline-flex items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/50 p-2.5 text-slate-400 shadow-lg shadow-black/30 backdrop-blur transition-all duration-300 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 hover:text-orange-400 hover:shadow-lg hover:shadow-orange-500/20 hover:border-orange-500/50"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <CameraButton
                  onClick={() => bannerInputRef.current?.click()}
                  ariaLabel="Upload community banner"
                  disabled={isUploadingBanner || !isLoggedIn}
                  className="absolute right-3 top-3 z-20"
                />
              </div>

              <div className="relative bg-slate-900/95 px-6 pb-6 pt-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative -mt-12 h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-slate-900 bg-orange-300 shadow-xl sm:h-24 sm:w-24">
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt="Community avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-300 text-slate-900">
                        <ShieldCheck className="h-10 w-10" />
                      </div>
                    )}
                    <CameraButton
                      onClick={() => avatarInputRef.current?.click()}
                      ariaLabel="Upload community avatar"
                      disabled={isUploadingAvatar || !isLoggedIn}
                      className="absolute bottom-1 right-1"
                    />
                  </div>
                  <div className="min-w-0 pt-2">
                    <h1 className="truncate text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                      {community.displayName.startsWith("r/")
                        ? community.displayName
                        : communityName}
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                      {communityName}
                    </p>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                      {community.description}
                    </p>
                    {(isUploadingAvatar || isUploadingBanner) && (
                      <p className="mt-2 text-xs text-slate-400">
                        Uploading image...
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/90 pt-4">
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-xl font-bold text-white">
                        {memberCount ?? "-"}
                      </p>
                      <p className="text-slate-400">members</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">
                        {onlineCount ?? "-"}
                      </p>
                      <p className="text-slate-400">online</p>
                    </div>
                    <div>
                      <p className="inline-flex items-center gap-2 text-slate-300">
                        <CalendarDays className="h-4 w-4" />
                        {createdAtLabel || "-"}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-2 capitalize text-slate-400">
                        <Globe className="h-4 w-4" />
                        {community.visibility}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCreatePost}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-orange-400/60 hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Post</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleJoinToggle}
                      disabled={isJoinSubmitting}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                        isJoined
                          ? "border border-slate-500/60 bg-transparent text-slate-100 hover:bg-slate-800/30"
                          : "bg-linear-to-r from-orange-500 to-red-600 text-white hover:from-orange-400 hover:to-red-500"
                      } ${isJoinSubmitting ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      {isJoinSubmitting
                        ? "Updating..."
                        : isJoined
                          ? "Joined"
                          : "Join"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-200 transition hover:border-orange-400/60 hover:bg-slate-700"
                      aria-label="More"
                    >
                      <Ellipsis className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>Best</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-slate-500 hover:text-orange-300"
                    >
                      <Rows3 className="h-4 w-4" />
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCreatePost}
                    className="rounded-full border border-slate-700/80 bg-slate-800/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-300 transition-colors hover:border-orange-500/40 hover:text-orange-200"
                  >
                    New Post
                  </button>
                </div>

                {(pageError || actionError) && (
                  <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {pageError || actionError}
                  </div>
                )}

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 text-slate-100">
                      <Pin className="h-4 w-4" />
                      <span className="text-2xl font-semibold">
                        Community highlights
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </div>

                  {highlights.length === 0 ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-6 text-sm text-slate-400">
                      No highlights yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                      {highlights.map((item, index) => (
                        <article
                          key={`${item.title || "highlight"}-${index}`}
                          className="relative min-h-48 overflow-hidden rounded-3xl border border-slate-700 bg-black p-4 transition hover:border-orange-500/60"
                        >
                          <h3 className="relative z-10 text-xl font-bold leading-tight text-white">
                            {item.title || "Community update"}
                          </h3>
                          <p className="relative z-10 mt-3 text-sm text-slate-300">
                            {item.date || "-"}
                          </p>
                          <div className="relative z-10 mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-slate-900">
                            {index === 0 ? (
                              <Shield className="h-5 w-5" />
                            ) : (
                              <Globe className="h-5 w-5" />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black/60" />
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  {isLoading ? (
                    <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">
                      Loading community posts...
                    </article>
                  ) : communityPosts.length === 0 ? (
                    <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 text-slate-400">
                      No posts in this community yet.
                    </article>
                  ) : (
                    communityPosts.map(post => (
                      <PostCard
                        key={
                          post.id ||
                          `${post.title}-${post.authorUsername || post.author || "unknown"}`
                        }
                        post={post}
                        onUpvote={handleUpvote}
                        onDownvote={handleDownvote}
                        onSave={handleSave}
                      />
                    ))
                  )}
                </div>
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/75 text-slate-200">
                  <div className="h-16 w-full bg-linear-to-r from-orange-500/70 via-red-500/70 to-orange-400/70" />
                  <div className="p-5">
                    <h3 className="text-2xl font-bold leading-tight text-white">
                      About community
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {community.description}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Created {createdAtLabel || "-"}
                      </div>
                      <div className="inline-flex items-center gap-2 capitalize">
                        <Globe className="h-4 w-4" />
                        {community.visibility}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                      <div>
                        <p className="text-2xl font-extrabold text-white">
                          {memberCount ?? "-"}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          members
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold text-white">
                          {onlineCount ?? "-"}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-slate-400">
                          online
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-5">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                    Community Rules
                  </h4>
                  {rules.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-400">
                      No rules listed yet.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {rules.map((rule, index) => (
                        <div
                          key={`${rule}-${index}`}
                          className="rounded-lg border border-slate-800/80 bg-slate-950/40 px-3 py-2 text-sm text-slate-300"
                        >
                          <span className="mr-2 text-orange-300">
                            {index + 1}.
                          </span>
                          {rule}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/75 p-5">
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                    Moderators
                  </h4>
                  {moderators.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-400">
                      No moderators listed yet.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2 text-sm text-slate-200">
                      {moderators.map(mod => (
                        <div
                          key={mod}
                          className="inline-flex items-center gap-2"
                        >
                          <Shield className="h-4 w-4 text-orange-300" /> u/{mod}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
