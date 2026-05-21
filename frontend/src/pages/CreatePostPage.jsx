/**
 * @typedef {import("../api/types.js").PostCreateRequest} PostCreateRequest
 * @typedef {import("../api/types.js").MediaDto} MediaDto
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus, Link2, BarChart3, ArrowLeft } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import RichTextEditor from "../components/RichTextEditor.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { PostsApi } from "../api/posts.js";
import { useUser } from "../auth/useUser.jsx";
import { UsersApi } from "../api/users.js";
import { getAccessToken } from "../auth/store.js";

function stripCommunityPrefix(value) {
  return value.replace(/^r\//i, "").trim();
}

function toDisplayCommunityName(value) {
  return value.trim();
}

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const showAuthModal = !isLoggedIn;

  const handleAuthModalClose = () => {
    navigate("/", { replace: true });
  };
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [createPostError, setCreatePostError] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [communitySearch, setCommunitySearch] = useState("");
  const [isCommunityMenuOpen, setIsCommunityMenuOpen] = useState(false);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);
  const [createPostForm, setCreatePostForm] = useState({
    title: "",
    content: "",
    community: "",
    images: [],
    link: "",
    pollOptions: ["", ""],
  });
  const communityPickerRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    let isMounted = true;

    const loadJoinedCommunities = async () => {
      setIsLoadingCommunities(true);

      try {
        const firstPage = await UsersApi.listSubscribedCommunities({
          page: 0,
          size: 100,
          sort: ["name,asc"],
        });

        let nextCommunities = firstPage?.content ?? [];
        const totalPages = firstPage?.page?.totalPages ?? 1;

        if (totalPages > 1) {
          const pageRequests = [];

          for (let pageNumber = 1; pageNumber < totalPages; pageNumber += 1) {
            pageRequests.push(
              UsersApi.listSubscribedCommunities({
                page: pageNumber,
                size: 100,
                sort: ["name,asc"],
              })
            );
          }

          const otherPages = await Promise.all(pageRequests);
          const additional = otherPages.flatMap(page => page?.content ?? []);
          nextCommunities = [...nextCommunities, ...additional];
        }

        if (!isMounted) return;
        setCommunities(nextCommunities);

        if (nextCommunities.length > 0) {
          const firstCommunity = nextCommunities[0];
          setCreatePostForm(previous => ({
            ...previous,
            community: firstCommunity.name,
          }));
          setCommunitySearch("");
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Failed to load communities:", error);
        setCommunities([]);
      } finally {
        if (isMounted) {
          setIsLoadingCommunities(false);
        }
      }
    };

    loadJoinedCommunities();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        communityPickerRef.current &&
        !communityPickerRef.current.contains(event.target)
      ) {
        setIsCommunityMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCommunities = useMemo(() => {
    const query = communitySearch.trim().toLowerCase().replace(/^r\//, "");

    if (!query) {
      return communities;
    }

    return communities.filter(community => {
      const communityName = stripCommunityPrefix(community.name).toLowerCase();
      return communityName.includes(query);
    });
  }, [communities, communitySearch]);

  const handleCreatePostChange = event => {
    const { name, value } = event.target;
    setCreatePostForm(previous => ({ ...previous, [name]: value }));
    setCreatePostError(null);
  };

  const handleImageUpload = event => {
    const files = Array.from(event.target.files || []);
    setCreatePostForm(previous => ({
      ...previous,
      images: [
        ...previous.images,
        ...files.slice(0, 4 - previous.images.length),
      ],
    }));
  };

  const handleRemoveImage = index => {
    setCreatePostForm(previous => ({
      ...previous,
      images: previous.images.filter((_, i) => i !== index),
    }));
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...createPostForm.pollOptions];
    newOptions[index] = value;
    setCreatePostForm(previous => ({
      ...previous,
      pollOptions: newOptions,
    }));
  };

  const addPollOption = () => {
    if (createPostForm.pollOptions.length < 6) {
      setCreatePostForm(previous => ({
        ...previous,
        pollOptions: [...previous.pollOptions, ""],
      }));
    }
  };

  const removePollOption = index => {
    if (createPostForm.pollOptions.length > 2) {
      setCreatePostForm(previous => ({
        ...previous,
        pollOptions: previous.pollOptions.filter((_, i) => i !== index),
      }));
    }
  };

  const isPostTab = !showImages && !showLink && !showPoll;

  const setComposerTab = tab => {
    setShowImages(tab === "images");
    setShowLink(tab === "link");
    setShowPoll(tab === "poll");
  };

  const handleCreatePostSubmit = async event => {
    event.preventDefault();

    // Validation
    if (!createPostForm.title.trim()) {
      setCreatePostError("Title is required");
      return;
    }

    if (createPostForm.title.length < 3) {
      setCreatePostError("Title must be at least 3 characters");
      return;
    }

    if (!createPostForm.content.trim()) {
      setCreatePostError("Text is required");
      return;
    }

    if (
      createPostForm.content.trim().length > 0 &&
      createPostForm.content.trim().length < 10
    ) {
      setCreatePostError("Content must be at least 10 characters");
      return;
    }

    setIsCreatingPost(true);
    setCreatePostError(null);

    try {
      const selectedCommunity =
        communities.find(
          community =>
            community.name.toLowerCase() ===
            createPostForm.community.trim().toLowerCase()
        ) ||
        communities.find(
          community =>
            stripCommunityPrefix(community.name).toLowerCase() ===
            communitySearch.trim().toLowerCase().replace(/^r\//, "")
        );

      if (!selectedCommunity) {
        setCreatePostError("Choose a matching community from the list.");
        setIsCreatingPost(false);
        return;
      }

      let mediaIds = [];

      // Upload media files if any
      if (createPostForm.images && createPostForm.images.length > 0) {
        try {
          console.log(
            `Attempting to upload ${createPostForm.images.length} image(s)`
          );

          const API_BASE_URL =
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";
          const token = getAccessToken();

          const uploadPromises = createPostForm.images.map(async file => {
            try {
              console.log(`Uploading: ${file.name}`);

              // Create form data directly for this upload
              const formData = new FormData();
              formData.append("file", file);

              // Use axios instance with proper multipart/form-data handling
              const response = await axios.post(
                `${API_BASE_URL}/media`,
                formData,
                {
                  headers: {
                    // Let browser set proper multipart boundary
                    "Content-Type": "multipart/form-data",
                    // Add authorization token
                    ...(token && { Authorization: `Bearer ${token}` }),
                  },
                  withCredentials: true,
                  timeout: 30000,
                }
              );

              console.log(`Upload successful for ${file.name}:`, response.data);
              return response.data;
            } catch (error) {
              console.error(`Upload failed for ${file.name}:`, error);
              console.error("Error response:", error.response?.data);
              return null;
            }
          });

          const uploadedMedia = await Promise.all(uploadPromises);
          console.log("All upload results:", uploadedMedia);

          mediaIds = uploadedMedia
            .filter(result => result !== null && result !== undefined)
            .map(result => result.mediaId || result.id)
            .filter(Boolean);

          console.log("Final mediaIds:", mediaIds);

          if (mediaIds.length === 0 && createPostForm.images.length > 0) {
            console.warn("⚠️ No images were successfully uploaded");
          } else if (mediaIds.length < createPostForm.images.length) {
            console.warn(
              `⚠️ Only ${mediaIds.length}/${createPostForm.images.length} images were uploaded`
            );
          }
        } catch (uploadError) {
          console.error("Error during media upload process:", uploadError);
        }
      }

      const baseContent =
        createPostForm.content.trim() || createPostForm.title.trim();
      const contentParts = [baseContent];

      if (showLink && createPostForm.link.trim()) {
        contentParts.push(`Link: ${createPostForm.link.trim()}`);
      }

      if (showPoll) {
        const pollLines = createPostForm.pollOptions
          .map(option => option.trim())
          .filter(Boolean)
          .map(option => `- ${option}`);

        if (pollLines.length > 0) {
          contentParts.push(`Poll options:\n${pollLines.join("\n")}`);
        }
      }

      await PostsApi.createPost({
        title: createPostForm.title.trim(),
        content: contentParts.filter(Boolean).join("\n\n"),
        communityName: selectedCommunity.name,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
      });

      setCreatePostForm({
        title: "",
        content: "",
        community: communities[0]?.name || "",
        images: [],
        link: "",
        pollOptions: ["", ""],
      });
      setCommunitySearch("");
      setComposerTab("post");
      navigate("/posts");
    } catch (error) {
      setCreatePostError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error.message ||
          "Failed to create post. Please try again."
      );
      console.error("Error creating post:", error);
    } finally {
      setIsCreatingPost(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} />
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        {/* Header with Create post and Drafts */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-slate-100">Create post</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium"
          >
            Drafts
          </button>
        </div>

        <form onSubmit={handleCreatePostSubmit} className="space-y-4">
          {/* Community Selector */}
          <div className="relative" ref={communityPickerRef}>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Community
            </label>
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-slate-200 transition-colors focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/30">
              <span className="text-slate-400">r/</span>
              <input
                type="text"
                value={
                  isCommunityMenuOpen
                    ? communitySearch
                    : toDisplayCommunityName(createPostForm.community)
                }
                onChange={event => {
                  const nextQuery = event.target.value;
                  setCommunitySearch(nextQuery);
                  setIsCommunityMenuOpen(true);
                  setCreatePostError(null);
                }}
                onFocus={() => {
                  setIsCommunityMenuOpen(true);
                  setCommunitySearch("");
                }}
                placeholder="Search your communities"
                disabled={isCreatingPost || isLoadingCommunities}
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none disabled:cursor-not-allowed"
              />
              <svg
                className={`h-4 w-4 shrink-0 transition-transform ${isCommunityMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>

            {isCommunityMenuOpen && (
              <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl shadow-black/30 backdrop-blur">
                <div className="max-h-64 overflow-auto">
                  {isLoadingCommunities ? (
                    <div className="px-4 py-3 text-sm text-slate-400">
                      Loading communities...
                    </div>
                  ) : filteredCommunities.length > 0 ? (
                    filteredCommunities.map(community => {
                      return (
                        <button
                          key={community.name}
                          type="button"
                          onMouseDown={event => event.preventDefault()}
                          onClick={() => {
                            setCreatePostForm(previous => ({
                              ...previous,
                              community: community.name,
                            }));
                            setCommunitySearch("");
                            setIsCommunityMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-slate-800 ${
                            createPostForm.community === community.name
                              ? "bg-slate-800 text-white"
                              : "text-slate-200"
                          }`}
                        >
                          <span>{toDisplayCommunityName(community.name)}</span>
                          {community.description && (
                            <span className="ml-4 max-w-[60%] truncate text-xs text-slate-500">
                              {community.description}
                            </span>
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-400">
                      No joined communities found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-800 flex items-center gap-0">
            <button
              type="button"
              onClick={() => setComposerTab("post")}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                isPostTab
                  ? "text-orange-400 border-orange-500"
                  : "text-slate-400 hover:text-slate-300 border-transparent"
              }`}
            >
              Text
            </button>
            <button
              type="button"
              onClick={() => setComposerTab("images")}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                showImages
                  ? "text-orange-400 border-orange-500"
                  : "text-slate-400 hover:text-slate-300 border-transparent"
              }`}
            >
              <ImagePlus className="w-4 h-4" />
              Images & Video
            </button>
            <button
              type="button"
              onClick={() => setComposerTab("link")}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                showLink
                  ? "text-orange-400 border-orange-500"
                  : "text-slate-400 hover:text-slate-300 border-transparent"
              }`}
            >
              <Link2 className="w-4 h-4" />
              Link
            </button>
            <button
              type="button"
              onClick={() => setComposerTab("poll")}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                showPoll
                  ? "text-orange-400 border-orange-500"
                  : "text-slate-400 hover:text-slate-300 border-transparent"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Poll
            </button>
          </div>

          {/* Title Input */}
          <div>
            <input
              type="text"
              name="title"
              value={createPostForm.title}
              onChange={handleCreatePostChange}
              placeholder="Title"
              maxLength="300"
              disabled={isCreatingPost}
              className="w-full bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
            <div className="text-xs text-slate-500 text-right">
              {createPostForm.title.length}/300
            </div>
          </div>

          {/* Add tags (placeholder) */}
          <div className="text-sm text-slate-500">Add tags</div>

          {/* Post Content Area */}
          {isPostTab && (
            <div>
              <RichTextEditor
                value={createPostForm.content}
                onChange={val =>
                  setCreatePostForm(previous => ({ ...previous, content: val }))
                }
                placeholder="Text (required)"
              />
              <p className="text-xs text-slate-500 text-right">
                {createPostForm.content.length}/5000
              </p>
            </div>
          )}

          {/* Images & Video */}
          {showImages && (
            <div className="space-y-3">
              <label className="block border-2 border-dashed border-slate-700 hover:border-orange-500/50 rounded-lg p-6 text-center cursor-pointer transition-colors group">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleImageUpload}
                  disabled={isCreatingPost || createPostForm.images.length >= 4}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  <ImagePlus className="w-8 h-8 text-slate-500 group-hover:text-orange-400 transition-colors" />
                  <p className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">
                    Upload images or videos
                  </p>
                  <p className="text-xs text-slate-500">or drag and drop</p>
                  <p className="text-xs text-slate-600">
                    {createPostForm.images.length}/4 files
                  </p>
                </div>
              </label>
              {createPostForm.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {createPostForm.images.map((file, index) => (
                    <div key={index} className="relative group">
                      {file.type.startsWith("video/") ? (
                        <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center relative">
                          <div className="absolute inset-0 rounded-lg bg-slate-800 flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-slate-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4.5-1v.008h.008V5h-.008zm0 2v.008h.008V7h-.008zm4-2v.008h.008V5h-.008zm0 2v.008h.008V7h-.008zm4-2v.008h.008V5h-.008zm0 2v.008h.008V7h-.008z" />
                            </svg>
                          </div>
                          <p className="text-xs text-slate-400 absolute bottom-1 right-1 bg-slate-900/80 px-2 py-1 rounded">
                            Video
                          </p>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Link */}
          {showLink && (
            <div>
              <input
                type="url"
                name="link"
                value={createPostForm.link}
                onChange={handleCreatePostChange}
                placeholder="Link URL"
                disabled={isCreatingPost}
                className="w-full bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
              />
            </div>
          )}

          {/* Poll */}
          {showPoll && (
            <div className="space-y-3">
              {createPostForm.pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={e =>
                      handlePollOptionChange(index, e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    maxLength="100"
                    disabled={isCreatingPost}
                    className="flex-1 bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                  {createPostForm.pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePollOption(index)}
                      disabled={isCreatingPost}
                      className="px-3 py-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {createPostForm.pollOptions.length < 6 && (
                <button
                  type="button"
                  onClick={addPollOption}
                  disabled={isCreatingPost}
                  className="w-full py-2 text-slate-400 hover:text-slate-300 border border-dashed border-slate-700 hover:border-slate-600 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Option
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {createPostError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {createPostError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate("/posts")}
              disabled={isCreatingPost}
              className="px-5 py-2 bg-transparent text-slate-400 hover:text-slate-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
            <button
              type="submit"
              disabled={isCreatingPost}
              className="px-6 py-2 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreatingPost ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
