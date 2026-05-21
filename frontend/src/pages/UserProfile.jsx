/**
 * @typedef {import("../api/types.js").UserDto} UserDto
 * @typedef {import("../api/types.js").PostDto} PostDto
 * @typedef {import("../api/types.js").CommentDto} CommentDto
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, Zap, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import PostCard from "../components/PostCard.jsx";
import CameraButton from "../components/CameraButton.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";
import CommentsList from "../components/CommentsList.jsx";
import { UsersApi } from "../api/users.js";
import {
  PostsApi,
  sortPostsByCreatedAtDesc,
  applyLocalVotesToPosts,
  setPostLocalVote,
} from "../api/posts.js";
import { useUser } from "../auth/useUser.jsx";

const PROFILE_TABS = ["Posts", "Comments", "Upvotes", "Downvotes"];

export default function UserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser, setUser: setAuthUser } = useUser();
  const profileUsername = username || loggedInUser?.username || "";
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [commentsList, setCommentsList] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [upvotedPosts, setUpvotedPosts] = useState([]);
  const [downvotedPosts, setDownvotedPosts] = useState([]);
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const [votesError, setVotesError] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSavingPost, setIsSavingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    postId: null,
  });
  const [noticeModal, setNoticeModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const avatarInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const editModalCloseTimeoutRef = useRef(null);
  const editModalOpenFrameRef = useRef(null);

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
      const loaded = sortPostsByCreatedAtDesc(response?.content ?? []);
      setPosts(applyLocalVotesToPosts(loaded));
    } catch (err) {
      console.error("Failed to load profile posts:", err);
      setPosts([]);
      setPostsError("Failed to load user posts.");
    } finally {
      setIsLoadingPosts(false);
    }
  }, [profileUsername]);

  const loadUserComments = useCallback(async () => {
    setIsLoadingComments(true);
    setCommentsError(null);

    try {
      const response = await UsersApi.listUserComments(profileUsername, {
        page: 0,
        size: 100,
        sort: ["createdAt,desc"],
      });
      setCommentsList(response?.content ?? []);
    } catch (err) {
      console.error("Failed to load user comments:", err);
      setCommentsList([]);
      setCommentsError("Failed to load user comments.");
    } finally {
      setIsLoadingComments(false);
    }
  }, [profileUsername]);

  const loadUserVotes = useCallback(async (filter = "both") => {
    setIsLoadingVotes(true);
    setVotesError(null);

    try {
      if (filter === "both") {
        const [upResp, downResp] = await Promise.all([
          UsersApi.listUpvotedPosts({ page: 0, size: 50 }),
          UsersApi.listDownvotedPosts({ page: 0, size: 50 }),
        ]);

        setUpvotedPosts(upResp?.content ?? []);
        setDownvotedPosts(downResp?.content ?? []);
      } else if (filter === "up") {
        const upResp = await UsersApi.listUpvotedPosts({ page: 0, size: 50 });
        setUpvotedPosts(upResp?.content ?? []);
      } else if (filter === "down") {
        const downResp = await UsersApi.listDownvotedPosts({
          page: 0,
          size: 50,
        });
        setDownvotedPosts(downResp?.content ?? []);
      }
    } catch (err) {
      console.error("Failed to load user votes:", err);
      if (filter === "both") {
        setUpvotedPosts([]);
        setDownvotedPosts([]);
      } else if (filter === "up") {
        setUpvotedPosts([]);
      } else if (filter === "down") {
        setDownvotedPosts([]);
      }
      setVotesError("Failed to load user votes.");
    } finally {
      setIsLoadingVotes(false);
    }
  }, []);

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
      loadUserComments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadUserPosts, loadUserComments]);

  useEffect(() => {
    // Fetch upvotes/downvotes when their respective tab is active
    if (activeTab === "upvotes") {
      Promise.resolve().then(() => loadUserVotes("up"));
    } else if (activeTab === "downvotes") {
      Promise.resolve().then(() => loadUserVotes("down"));
    }
  }, [activeTab, loadUserVotes]);

  // Re-apply local votes to posts whenever we return to the posts tab.
  // This ensures vote button highlights reflect local state after navigating
  // to a post detail and back without forcing a full reload.
  useEffect(() => {
    if (activeTab !== "posts") return;
    // Defer state update to avoid synchronous setState inside effect
    Promise.resolve().then(() =>
      setPosts(current => applyLocalVotesToPosts(current))
    );
  }, [activeTab]);

  // Re-apply local votes when navigation or storage events occur so vote
  // highlights stay in sync after visiting a post detail and returning.
  useEffect(() => {
    const reapPLY = () =>
      Promise.resolve().then(() =>
        setPosts(current => applyLocalVotesToPosts(current))
      );

    const onFocus = () => reapPLY();
    const onPop = () => reapPLY();
    const onStorage = () => reapPLY();

    window.addEventListener("focus", onFocus);
    window.addEventListener("popstate", onPop);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(
    () => () => {
      if (editModalOpenFrameRef.current) {
        window.cancelAnimationFrame(editModalOpenFrameRef.current);
      }
      if (editModalCloseTimeoutRef.current) {
        window.clearTimeout(editModalCloseTimeoutRef.current);
      }
    },
    []
  );

  const handleVote = async (postId, action) => {
    try {
      await PostsApi.votePost(postId, action);
      setPostLocalVote(postId, action);
      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post.id !== postId) {
            return post;
          }

          const previousVote =
            post.vote ??
            (post.upvoted ? "UPVOTE" : post.downvoted ? "DOWNVOTE" : "NONE");
          const scoreDelta =
            previousVote === action
              ? 0
              : previousVote === "NONE"
                ? action === "UPVOTE"
                  ? 1
                  : -1
                : action === "NONE"
                  ? previousVote === "UPVOTE"
                    ? -1
                    : 1
                  : action === "UPVOTE"
                    ? 2
                    : -2;

          const nextScore =
            typeof post.score === "number" && Number.isFinite(post.score)
              ? post.score + scoreDelta
              : post.score;

          return {
            ...post,
            vote: action,
            upvoted: action === "UPVOTE",
            downvoted: action === "DOWNVOTE",
            score: nextScore,
          };
        })
      );
    } catch (err) {
      console.error("Failed to vote on post:", err);
    }
  };

  const handleUpvote = (postId, action = "UPVOTE") =>
    handleVote(postId, action);

  const handleDownvote = (postId, action = "DOWNVOTE") =>
    handleVote(postId, action);

  const handleSave = postId => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  const startEditingPost = post => {
    if (editModalOpenFrameRef.current) {
      window.cancelAnimationFrame(editModalOpenFrameRef.current);
      editModalOpenFrameRef.current = null;
    }
    if (editModalCloseTimeoutRef.current) {
      window.clearTimeout(editModalCloseTimeoutRef.current);
      editModalCloseTimeoutRef.current = null;
    }
    setIsEditModalVisible(false);
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    editModalOpenFrameRef.current = window.requestAnimationFrame(() => {
      setIsEditModalVisible(true);
      editModalOpenFrameRef.current = null;
    });
  };

  const stopEditingPost = () => {
    setIsEditModalVisible(false);

    if (editModalCloseTimeoutRef.current) {
      window.clearTimeout(editModalCloseTimeoutRef.current);
    }

    editModalCloseTimeoutRef.current = window.setTimeout(() => {
      setEditingPostId(null);
      setEditTitle("");
      setEditContent("");
      editModalCloseTimeoutRef.current = null;
    }, 180);
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

  const handleDeletePost = postId => {
    setDeleteConfirm({ isOpen: true, postId });
  };

  const confirmDeletePost = async () => {
    if (!deleteConfirm.postId) {
      return;
    }

    const postId = deleteConfirm.postId;
    setDeletingPostId(postId);

    try {
      await PostsApi.deletePost(postId);
      if (editingPostId === postId) {
        stopEditingPost();
      }
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                softDeleted: true,
                deleted: true,
              }
            : post
        )
      );
      setDeleteConfirm({ isOpen: false, postId: null });
    } catch (err) {
      console.error("Failed to delete post:", err);
      setNoticeModal({
        isOpen: true,
        title: "Delete Failed",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to delete this post.",
      });
    } finally {
      setDeletingPostId(null);
    }
  };

  // Comments handlers
  const handleCommentUpvote = async (commentId, action) => {
    try {
      const { CommentsApi } = await import("../api/comments.js");
      await CommentsApi.voteComment(commentId, action);
      await loadUserComments();
    } catch (err) {
      console.error("Failed to vote on comment:", err);
    }
  };

  const handleCommentDownvote = (commentId, action) =>
    handleCommentUpvote(commentId, action);

  const handleReplyToComment = async (parentId, content) => {
    try {
      const parent = commentsList.find(c => c.id === parentId);
      if (!parent || !parent.postId) return;
      const { CommentsApi } = await import("../api/comments.js");
      await CommentsApi.reply(parent.postId, { content, parentId });
      await loadUserComments();
    } catch (err) {
      console.error("Failed to reply to comment:", err);
    }
  };

  const handleDeleteComment = async commentId => {
    try {
      const { CommentsApi } = await import("../api/comments.js");
      const prevScrollY = window.scrollY || 0;
      await CommentsApi.deleteComment(commentId);
      await loadUserComments();
      window.scrollTo({ top: prevScrollY, left: 0 });
    } catch (err) {
      console.error("Failed to delete comment:", err);
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
      setNoticeModal({
        isOpen: true,
        title: "Avatar Upload Failed",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to upload avatar",
      });
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
      setNoticeModal({
        isOpen: true,
        title: "Banner Upload Failed",
        message:
          err.response?.data?.message ||
          err.message ||
          "Failed to upload banner",
      });
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

      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="modal-cinematic-orbit absolute inset-[-35%]" />
            <div className="modal-cinematic-sweep absolute inset-0" />
            <div className="modal-cinematic-shimmer absolute inset-0" />
          </div>

          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Delete Post?</h2>
            <p className="mt-2 text-sm text-slate-300">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, postId: null })
                }
                className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {noticeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="modal-cinematic-orbit absolute inset-[-35%]" />
            <div className="modal-cinematic-sweep absolute inset-0" />
            <div className="modal-cinematic-shimmer absolute inset-0" />
          </div>

          <div className="w-full max-w-md rounded-2xl border border-orange-500/30 bg-slate-900 p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white">
              {noticeModal.title}
            </h2>
            <p className="mt-2 text-sm text-slate-300">{noticeModal.message}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setNoticeModal({ isOpen: false, title: "", message: "" })
                }
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {isOwnProfile && editingPostId && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
            isEditModalVisible
              ? "bg-black/60 opacity-100 backdrop-blur-md"
              : "bg-black/0 opacity-0 backdrop-blur-none pointer-events-none"
          }`}
          onClick={stopEditingPost}
        >
          <div
            className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ${
              isEditModalVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="modal-cinematic-orbit absolute inset-[-35%]" />
            <div className="modal-cinematic-sweep absolute inset-0" />
            <div className="modal-cinematic-shimmer absolute inset-0" />
          </div>

          <form
            onSubmit={handleEditPostSubmit}
            onClick={event => event.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700/90 bg-slate-900/95 shadow-2xl ring-1 ring-white/5 transition-all duration-300 ease-out ${
              isEditModalVisible
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-2 scale-[0.98] opacity-0"
            }`}
          >
            <div className="border-b border-slate-800/90 bg-linear-to-r from-slate-900 to-slate-900/70 px-5 py-4 sm:px-6">
              <h2 className="text-xl font-bold text-white">Edit Post</h2>
              <p className="mt-1 text-sm text-slate-400">
                Update your title and content, then save your changes.
              </p>
            </div>

            <div className="space-y-4 overflow-y-auto px-5 py-4 sm:px-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-200">
                    Title
                  </label>
                  <span className="text-xs text-slate-500">
                    {editTitle.trim().length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={editTitle}
                  onChange={event => setEditTitle(event.target.value)}
                  placeholder="Write a clear title"
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 px-3 py-2.5 text-slate-100 outline-none transition-colors focus:border-orange-500/70"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-200">
                    Content
                  </label>
                  <span className="text-xs text-slate-500">
                    {editContent.trim().length} chars
                  </span>
                </div>
                <RichTextEditor
                  value={editContent}
                  onChange={setEditContent}
                  placeholder="Describe your post"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-800/90 bg-slate-900/80 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={stopEditingPost}
                className="rounded-full border border-slate-700 bg-slate-800/70 px-4 py-1.5 text-sm text-slate-200 transition-colors hover:border-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingPost}
                className="rounded-full bg-linear-to-r from-orange-500 to-red-600 px-4 py-1.5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingPost ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}

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
            {/* Removed: Content filter pill and Create-post box per user request */}

            {/* Content for each tab */}
            {activeTab === "posts" && (
              <>
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
                          isEditable={
                            isOwnProfile && !post.softDeleted && !post.deleted
                          }
                          onEdit={startEditingPost}
                          onDelete={handleDeletePost}
                          isDeleting={deletingPostId === post.id}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "comments" && (
              <>
                {commentsError ? (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
                    {commentsError}
                  </div>
                ) : isLoadingComments ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
                    Loading comments...
                  </div>
                ) : (
                  <CommentsList
                    comments={commentsList}
                    onUpvote={handleCommentUpvote}
                    onDownvote={handleCommentDownvote}
                    onReply={handleReplyToComment}
                    onDelete={handleDeleteComment}
                  />
                )}
              </>
            )}

            {activeTab === "upvotes" && (
              <div className="relative">
                {votesError && (
                  <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {votesError}
                  </div>
                )}

                {isLoadingVotes ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
                    Loading upvoted posts...
                  </div>
                ) : upvotedPosts.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
                    No upvoted posts
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upvotedPosts.map(p => (
                      <PostCard
                        key={p.id}
                        post={p}
                        onUpvote={handleUpvote}
                        onDownvote={handleDownvote}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "downvotes" && (
              <div className="relative">
                {votesError && (
                  <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {votesError}
                  </div>
                )}

                {isLoadingVotes ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">
                    Loading downvoted posts...
                  </div>
                ) : downvotedPosts.length === 0 ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
                    No downvoted posts
                  </div>
                ) : (
                  <div className="space-y-4">
                    {downvotedPosts.map(p => (
                      <PostCard
                        key={p.id}
                        post={p}
                        onUpvote={handleUpvote}
                        onDownvote={handleDownvote}
                      />
                    ))}
                  </div>
                )}
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
