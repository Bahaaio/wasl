import { useEffect, useMemo, useState } from "react";
import { CommunitiesApi } from "../api/communities.js";
import { UsersApi } from "../api/users.js";
import { MediaApi } from "../api/media.js";
import { useUser } from "../auth/useUser.jsx";

const userAvatarCache = {};

const getUserAvatar = async username => {
  if (userAvatarCache[username]) return userAvatarCache[username];
  try {
    const user = await UsersApi.getUserByUsername(username);
    const url = user?.avatarMediaId
      ? MediaApi.getThumbnailMediaUrl(user.avatarMediaId)
      : null;
    userAvatarCache[username] = {
      url,
      initial: username.charAt(0).toUpperCase(),
    };
    return userAvatarCache[username];
  } catch {
    return { url: null, initial: username.charAt(0).toUpperCase() };
  }
};

export default function CommunityRoleBanner({ communityName }) {
  const { user, isLoggedIn } = useUser();
  const [role, setRole] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [memberAvatars, setMemberAvatars] = useState({});

  useEffect(() => {
    let mounted = true;
    const loadRole = async () => {
      setLoading(true);
      setError("");
      try {
        const page = await CommunitiesApi.getCommunityMembers(communityName, {
          page: 0,
          size: 200,
        });
        if (!mounted) return;
        const list = page?.content || [];
        setMembers(list);
        if (isLoggedIn && user?.username) {
          const mine = list.find(m => m.username === user.username);
          setRole(mine?.role ?? null);
        } else {
          setRole(null);
        }
      } catch (err) {
        setError("Failed to load membership info");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRole();

    const onKey = e => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      mounted = false;
      window.removeEventListener("keydown", onKey);
    };
  }, [communityName, isLoggedIn, user]);

  const removeMember = async username => {
    setError("");
    try {
      await CommunitiesApi.removeMember(communityName, username);
      setMembers(prev => prev.filter(m => m.username !== username));
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const filtered = useMemo(() => {
    const q = String(query || "")
      .trim()
      .toLowerCase();
    if (!q) return members;
    return members.filter(m => m.username.toLowerCase().includes(q));
  }, [members, query]);

  useEffect(() => {
    const loadAvatars = async () => {
      const avatars = {};
      for (const m of members) {
        avatars[m.username] = await getUserAvatar(m.username);
      }
      setMemberAvatars(avatars);
    };
    if (members.length > 0) loadAvatars();
  }, [members]);

  return (
    <div className="flex items-center gap-3">
      {loading ? (
        <span className="text-sm text-slate-400">Loading role...</span>
      ) : role ? (
        <span className="rounded-full bg-slate-800/60 px-3 py-1 text-sm font-semibold text-slate-100">
          {role}
        </span>
      ) : null}

      {role === "OWNER" || role === "MODERATOR" ? (
        <>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Manage members
          </button>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center">
              <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <h3 className="text-lg font-bold text-white">Members</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        aria-label="Search members"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search members"
                        className="w-48 rounded-md border border-slate-800/70 bg-slate-950/20 px-3 py-1 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center pr-1 text-slate-500 text-xs">
                        {filtered.length}
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="rounded-md px-3 py-1 text-sm font-medium text-slate-300 hover:bg-slate-800"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="max-h-[60vh] overflow-auto p-4">
                  {error && (
                    <div className="mb-3 rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <ul className="space-y-2">
                    {filtered.map(m => (
                      <li
                        key={m.username}
                        className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-950/30 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          {memberAvatars[m.username]?.url ? (
                            <img
                              src={memberAvatars[m.username].url}
                              alt={`${m.username} avatar`}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-400 text-sm font-semibold text-slate-900">
                              {memberAvatars[m.username]?.initial ||
                                m.username?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-slate-100">
                              u/{m.username}
                            </div>
                            <div className="text-xs text-slate-400">
                              {m.role}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {(role === "OWNER" || role === "MODERATOR") &&
                            m.role !== "OWNER" && (
                              <button
                                onClick={() => removeMember(m.username)}
                                className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                              >
                                Remove
                              </button>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
