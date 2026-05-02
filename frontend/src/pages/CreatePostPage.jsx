import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus, Link2, BarChart3 } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { MOCK_COMMUNITIES } from "../data/mockData.js";

export default function CreatePostPage() {
  const navigate = useNavigate();
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
      images: [...previous.images, ...files.slice(0, 4 - previous.images.length)],
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
      setCreatePostForm({ title: "", content: "", community: "r/javascript" });
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
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 pt-25 pb-9">
        <div className="w-full max-w-2xl">
          <div className="relative bg-slate-900/50 border border-slate-800/50 backdrop-blur-md rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Create a post</h2>
              <button
                type="button"
                onClick={() => navigate("/posts")}
                className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                aria-label="Close and go back"
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
                  {MOCK_COMMUNITIES.map(community => (
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
                  rows="8"
                  maxLength="5000"
                  disabled={isCreatingPost}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">
                  {createPostForm.content.length}/5000
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowImages(!showImages)}
                  disabled={isCreatingPost}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    showImages
                      ? "text-orange-400 bg-orange-500/20 border border-orange-500/50"
                      : "text-slate-400 hover:text-orange-400 hover:bg-slate-800/50"
                  }`}
                >
                  <ImagePlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Images</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowLink(!showLink)}
                  disabled={isCreatingPost}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    showLink
                      ? "text-orange-400 bg-orange-500/20 border border-orange-500/50"
                      : "text-slate-400 hover:text-orange-400 hover:bg-slate-800/50"
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPoll(!showPoll)}
                  disabled={isCreatingPost}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    showPoll
                      ? "text-orange-400 bg-orange-500/20 border border-orange-500/50"
                      : "text-slate-400 hover:text-orange-400 hover:bg-slate-800/50"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Poll</span>
                </button>
              </div>

              {showImages && (
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Upload Images
                      </label>
                      <span className="text-xs text-slate-400 ml-2">
                        {createPostForm.images.length}/4
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowImages(false)}
                      className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isCreatingPost || createPostForm.images.length >= 4}
                    className="w-full text-sm text-slate-400 file:mr-4 file:px-3 file:py-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-500/20 file:text-orange-400 hover:file:bg-orange-500/30 file:transition-all file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {createPostForm.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {createPostForm.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {showLink && (
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-300">
                      Add Link
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLink(false)}
                      className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="url"
                    name="link"
                    value={createPostForm.link}
                    onChange={handleCreatePostChange}
                    placeholder="https://example.com"
                    disabled={isCreatingPost}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}

              {showPoll && (
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-slate-300">
                        Poll Options
                      </label>
                      <span className="text-xs text-slate-400 ml-2">
                        {createPostForm.pollOptions.length}/6
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPoll(false)}
                      className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
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
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
                      className="w-full py-2 text-slate-400 hover:text-orange-400 border border-dashed border-slate-700 hover:border-orange-500/50 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              )}

              {createPostError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {createPostError}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/posts")}
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
    </div>
  );
}
