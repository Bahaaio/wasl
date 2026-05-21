/**
 * @typedef {import("../api/types.js").CommunityDto} CommunityDto
 * @typedef {import("../api/types.js").PostDto} PostDto
 * @typedef {import("../api/types.js").UserDto} UserDto
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { SearchApi } from "../api/search.js";
import { MediaApi } from "../api/media.js";

function normalizeCommunitySlug(value) {
  return String(value || "")
    .trim()
    .replace(/^r\//i, "");
}

export default function SearchBar({ className = "", communityName = null }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const requestIdRef = useRef(0);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    communities: [],
    posts: [],
    users: [],
  });

  const hasQuery = query.trim().length > 0;
  const isCommunityScoped = !!communityName;

  useEffect(() => {
    const handleOutsideClick = event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!hasQuery) {
      // Defer state updates to avoid synchronous setState inside effect
      Promise.resolve().then(() => {
        setResults({ communities: [], posts: [], users: [] });
        setIsLoading(false);
      });
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    // Defer to avoid synchronous setState inside effect
    Promise.resolve().then(() => setIsLoading(true));

    const timerId = window.setTimeout(async () => {
      try {
        if (isCommunityScoped) {
          // Scoped search: only posts from this community
          const postsRes = await SearchApi.searchPosts(query, {
            c: normalizeCommunitySlug(communityName),
            size: 10,
          });

          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          setResults({
            communities: [],
            posts: postsRes?.content ?? [],
            users: [],
          });
        } else {
          // Global search
          const [communitiesRes, postsRes, usersRes] = await Promise.all([
            SearchApi.searchCommunities(query, { size: 5 }),
            SearchApi.searchPosts(query, { size: 5 }),
            SearchApi.searchUsers(query, { size: 5 }),
          ]);

          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          setResults({
            communities: communitiesRes?.content ?? [],
            posts: postsRes?.content ?? [],
            users: usersRes?.content ?? [],
          });
        }
      } catch {
        if (requestIdRef.current !== currentRequestId) {
          return;
        }
        setResults({ communities: [], posts: [], users: [] });
      } finally {
        if (requestIdRef.current === currentRequestId) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [query, hasQuery, communityName, isCommunityScoped]);

  const hasAnyResult = useMemo(
    () =>
      results.communities.length > 0 ||
      results.posts.length > 0 ||
      results.users.length > 0,
    [results]
  );

  const goToCommunity = communityName => {
    const slug = normalizeCommunitySlug(communityName);
    setIsOpen(false);
    setQuery("");
    navigate(`/r/${encodeURIComponent(slug)}`);
  };

  const goToPost = postId => {
    setIsOpen(false);
    setQuery("");
    navigate(`/posts/${postId}`);
  };

  const goToUser = username => {
    setIsOpen(false);
    setQuery("");
    navigate(`/u/${username}`);
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={event => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (hasQuery) {
            setIsOpen(true);
          }
        }}
        onKeyDown={event => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
          if (event.key === "Enter" && results.posts.length > 0) {
            goToPost(results.posts[0].id);
          }
        }}
        placeholder={
          isCommunityScoped
            ? `Search in r/${normalizeCommunitySlug(communityName)}...`
            : "Search communities, posts, or users..."
        }
        className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
      />

      {isOpen && hasQuery && (
        <div className="absolute z-60 mt-2 w-full max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur">
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>
          ) : !hasAnyResult ? (
            <div className="px-4 py-3 text-sm text-slate-400">
              No results found.
            </div>
          ) : (
            <>
              {!isCommunityScoped && results.communities.length > 0 && (
                <div className="border-b border-slate-800/80 p-2">
                  <p className="px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    Communities
                  </p>
                  {results.communities.map(community => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={() => goToCommunity(community.name)}
                      className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-800/80 transition-colors"
                    >
                      {community.iconMediaId ? (
                        <img
                          src={MediaApi.getThumbnailMediaUrl(
                            community.iconMediaId
                          )}
                          alt={`${community.name} avatar`}
                          className="h-6 w-6 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-slate-700/70 border border-slate-600" />
                      )}
                      <span className="text-sm text-slate-200">
                        r/{normalizeCommunitySlug(community.name)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {results.posts.length > 0 && (
                <div
                  className={
                    isCommunityScoped
                      ? "p-2"
                      : "border-b border-slate-800/80 p-2"
                  }
                >
                  <p className="px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    {isCommunityScoped ? "Posts in this community" : "Posts"}
                  </p>
                  {results.posts.map(post => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => goToPost(post.id)}
                      className="w-full rounded-lg px-2 py-2 text-left hover:bg-slate-800/80 transition-colors"
                    >
                      <p className="line-clamp-1 text-sm text-slate-200">
                        {post.title}
                      </p>
                      {!isCommunityScoped && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          r/{normalizeCommunitySlug(post.communityName)}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!isCommunityScoped && results.users.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    Users
                  </p>
                  {results.users.map(user => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => goToUser(user.username)}
                      className="w-full flex items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-slate-800/80 transition-colors"
                    >
                      {user.avatarMediaId ? (
                        <img
                          src={MediaApi.getThumbnailMediaUrl(
                            user.avatarMediaId
                          )}
                          alt={`${user.username} avatar`}
                          className="h-6 w-6 rounded-full object-cover border border-slate-700"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-slate-700/70 border border-slate-600" />
                      )}
                      <span className="text-sm text-slate-200">
                        u/{user.username}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
