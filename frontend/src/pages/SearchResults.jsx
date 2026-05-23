import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import PostCard from "../components/PostCard.jsx";
import { SearchApi } from "../api/search.js";
import { MediaApi } from "../api/media.js";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function SearchResults() {
  const query = useQuery().get("q") || "";
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!query) {
      setPosts([]);
      setCommunities([]);
      setUsers([]);
      setComments([]);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      try {
        const [postsRes, commRes, usersRes, commentsRes] = await Promise.all([
          SearchApi.searchPosts(query, { page: 0, size: 20 }),
          SearchApi.searchCommunities(query, { page: 0, size: 10 }),
          SearchApi.searchUsers(query, { page: 0, size: 10 }),
          SearchApi.searchComments(query, { page: 0, size: 20 }),
        ]);

        setPosts(postsRes?.content ?? []);
        setCommunities(commRes?.content ?? []);
        setUsers(usersRes?.content ?? []);
        setComments(commentsRes?.content ?? []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const id = window.setTimeout(load, 150);
    return () => window.clearTimeout(id);
  }, [query]);

  return (
    <AppLayout>
      <div className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-100">
                Search results for "{query}"
              </h1>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <Tab
                  label="Posts"
                  active={activeTab === "posts"}
                  onClick={() => setActiveTab("posts")}
                />
                <Tab
                  label="Communities"
                  active={activeTab === "communities"}
                  onClick={() => setActiveTab("communities")}
                />
                <Tab
                  label="Comments"
                  active={activeTab === "comments"}
                  onClick={() => setActiveTab("comments")}
                />
                <Tab
                  label="Media"
                  active={activeTab === "media"}
                  onClick={() => setActiveTab("media")}
                />
                <Tab
                  label="Profiles"
                  active={activeTab === "profiles"}
                  onClick={() => setActiveTab("profiles")}
                />
              </div>
            </div>

            <section>
              {isLoading ? (
                <div className="p-6 text-slate-400">Searching...</div>
              ) : (
                <div className="space-y-4">
                  {activeTab === "posts" && posts.length === 0 && (
                    <div className="p-6 text-slate-400">No posts found.</div>
                  )}

                  {activeTab === "posts" &&
                    posts.map(post => (
                      <div key={post.id} className="mb-4">
                        <PostCard post={post} />
                      </div>
                    ))}

                  {activeTab === "communities" && (
                    <div className="grid grid-cols-1 gap-3">
                      {communities.map(c => (
                        <div key={c.id} className="flex items-center gap-3 p-3">
                          {c.iconMediaId ? (
                            <img
                              src={MediaApi.getThumbnailMediaUrl(c.iconMediaId)}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700/50" />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-100">
                              r/{c.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {c.description?.slice(0, 120)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "comments" && (
                    <div className="space-y-3">
                      {comments.map(cm => (
                        <div key={cm.id} className="p-3">
                          <div className="text-sm text-slate-200 line-clamp-3">
                            {cm.content}
                          </div>
                          <div className="mt-2 text-xs text-slate-500">
                            In r/{cm.communityName} • {cm.username}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "media" && (
                    <div className="grid grid-cols-1 gap-3">
                      {posts
                        .filter(p => (p.media || []).length > 0)
                        .map(p => (
                          <div key={p.id} className="p-3">
                            <PostCard post={p} />
                          </div>
                        ))}
                    </div>
                  )}

                  {activeTab === "profiles" && (
                    <div className="space-y-3">
                      {users.map(u => (
                        <div key={u.id} className="flex items-center gap-3 p-3">
                          {u.avatarMediaId ? (
                            <img
                              src={MediaApi.getThumbnailMediaUrl(
                                u.avatarMediaId
                              )}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-slate-700/50" />
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-100">
                              u/{u.username}
                            </div>
                            <div className="text-xs text-slate-400">
                              {u.bio?.slice(0, 120)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>
    </AppLayout>
  );
}

function Tab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
        active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900"
      }`}
    >
      {label}
    </button>
  );
}
