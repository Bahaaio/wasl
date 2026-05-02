import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { MOCK_COMMUNITIES } from "../data/mockData.js";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [createPostError, setCreatePostError] = useState(null);
  const [createPostForm, setCreatePostForm] = useState({
    title: "",
    content: "",
    community: "r/javascript",
  });

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
                className="p-2.5 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50"
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
