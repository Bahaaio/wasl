import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus, Link2, BarChart3 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { MOCK_COMMUNITIES } from "../data/mockData.js";
import { useUser } from "../auth/useUser.jsx";

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
  const [createPostForm, setCreatePostForm] = useState({
    title: "",
    content: "",
    community: "r/javascript",
    images: [],
    link: "",
    pollOptions: ["", ""],
  });

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
      // Navigate back to posts page after successful creation
      // onNavigate('posts');

      console.log("Create post:", createPostForm);
      setCreatePostForm({
        title: "",
        content: "",
        community: "r/javascript",
        images: [],
        link: "",
        pollOptions: ["", ""],
      });
      setComposerTab("post");
      // Navigate back to posts after success
      navigate("/posts");
    } catch (error) {
      setCreatePostError(
        error.message || "Failed to create post. Please try again."
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
          <h1 className="text-2xl font-bold text-slate-100">Create post</h1>
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
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-full text-slate-200 hover:bg-slate-700/60 transition-colors flex items-center gap-2 text-sm font-medium"
            onClick={() => {
              // Community selector dropdown would go here
            }}
          >
            <span className="text-slate-400">r/</span>
            <span>{createPostForm.community.replace("r/", "")}</span>
            <svg
              className="w-4 h-4 ml-auto"
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
          </button>

          {/* Hidden community selector for form submission */}
          <select
            name="community"
            value={createPostForm.community}
            onChange={handleCreatePostChange}
            disabled={isCreatingPost}
            className="hidden"
          >
            {MOCK_COMMUNITIES.map(community => (
              <option key={community.name} value={community.name}>
                {community.name}
              </option>
            ))}
          </select>

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
              <textarea
                name="content"
                value={createPostForm.content}
                onChange={handleCreatePostChange}
                placeholder="Text (optional)"
                rows="10"
                maxLength="5000"
                disabled={isCreatingPost}
                className="w-full bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed text-base"
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
