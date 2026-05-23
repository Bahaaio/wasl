import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  Plus,
  X,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../auth/useUser.jsx";
import { UsersApi } from "../api/users.js";
import { MediaApi } from "../api/media.js";

function normalizeCommunitySlug(value) {
  return String(value || "")
    .trim()
    .replace(/^r\//i, "");
}

async function loadAllSubscribedCommunities() {
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

  return nextCommunities;
}

function Section({ title, open, onToggle, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
          {title}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-slate-800/80 p-3">{children}</div>
      )}
    </section>
  );
}

function NavItem({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
        active
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
      <span className="font-medium">{label}</span>
      <ChevronRight className="ml-auto h-4 w-4 text-slate-500" />
    </Link>
  );
}

function CommunityItem({ community, onClick }) {
  const slug = normalizeCommunitySlug(community?.name);
  return (
    <Link
      to={`/r/${encodeURIComponent(slug)}`}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
    >
      {community?.iconMediaId ? (
        <img
          src={MediaApi.getThumbnailMediaUrl(community.iconMediaId)}
          alt=""
          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 ring-1 ring-slate-700">
          <Users className="h-4 w-4 text-slate-400" />
        </div>
      )}
      <span className="min-w-0 flex-1 truncate font-medium">r/{slug}</span>
    </Link>
  );
}

export default function SideBar() {
  const location = useLocation();
  const { isLoggedIn } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.innerWidth >= 1024;
  });
  const [openSections, setOpenSections] = useState({
    browse: true,
    create: true,
    communities: true,
  });
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDrawerOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadCommunities = async () => {
      if (!isLoggedIn) {
        setJoinedCommunities([]);
        setIsLoadingCommunities(false);
        return;
      }

      setIsLoadingCommunities(true);

      try {
        const communities = await loadAllSubscribedCommunities();
        if (mounted) {
          setJoinedCommunities(communities);
        }
      } catch (error) {
        console.error("Failed to load subscribed communities:", error);
        if (mounted) {
          setJoinedCommunities([]);
        }
      } finally {
        if (mounted) {
          setIsLoadingCommunities(false);
        }
      }
    };

    loadCommunities();

    return () => {
      mounted = false;
    };
  }, [isLoggedIn]);

  const toggleSection = key => {
    setOpenSections(previous => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const handleNavigate = () => {
    setIsDrawerOpen(false);
  };

  const communityCountText = useMemo(() => {
    if (!isLoggedIn) {
      return "Log in to see your communities";
    }

    return joinedCommunities.length > 0
      ? `${joinedCommunities.length} joined communities`
      : "No joined communities yet";
  }, [joinedCommunities.length, isLoggedIn]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="fixed left-4 top-20 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-900/95 text-slate-100 shadow-lg shadow-black/30 transition-colors hover:bg-slate-800 lg:hidden"
        aria-label="Open sidebar"
        aria-expanded={isDrawerOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={`fixed inset-0 top-16 z-30 bg-slate-950/70 backdrop-blur-sm transition-opacity lg:hidden ${
          isDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-x-0 top-16 z-30 h-[calc(100dvh-4rem)] w-full -translate-x-full border-r border-slate-800 bg-slate-950/95 shadow-2xl shadow-black/30 transition-transform duration-300 ease-out lg:static lg:h-auto lg:w-80 lg:translate-x-0 lg:shadow-none ${
          isDrawerOpen ? "translate-x-0" : ""
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4 lg:hidden">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-full overflow-y-auto px-4 py-4">
          <div className="space-y-4">
            <Section
              title="Browse"
              open={openSections.browse}
              onToggle={() => toggleSection("browse")}
            >
              <div className="space-y-2">
                <NavItem
                  to="/posts"
                  icon={<Home className="h-4 w-4" />}
                  label="Posts"
                  active={location.pathname === "/posts"}
                  onClick={handleNavigate}
                />
              </div>
            </Section>

            <Section
              title="Create"
              open={openSections.create}
              onToggle={() => toggleSection("create")}
            >
              <div className="space-y-2">
                <NavItem
                  to="/create-post"
                  icon={<Plus className="h-4 w-4" />}
                  label="Create Post"
                  active={location.pathname === "/create-post"}
                  onClick={handleNavigate}
                />
                <NavItem
                  to="/create-community"
                  icon={<Plus className="h-4 w-4" />}
                  label="Create Community"
                  active={location.pathname === "/create-community"}
                  onClick={handleNavigate}
                />
              </div>
            </Section>

            <Section
              title={`Communities ${isLoggedIn ? `(${joinedCommunities.length})` : ""}`}
              open={openSections.communities}
              onToggle={() => toggleSection("communities")}
            >
              <div className="space-y-3">
                <p className="px-1 text-xs leading-relaxed text-slate-500">
                  {communityCountText}
                </p>
                {isLoadingCommunities ? (
                  <div className="px-1 py-2 text-sm text-slate-400">
                    Loading communities...
                  </div>
                ) : isLoggedIn && joinedCommunities.length > 0 ? (
                  <div className="space-y-1">
                    {joinedCommunities.map(community => (
                      <CommunityItem
                        key={community.id || community.name}
                        community={community}
                        onClick={handleNavigate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-sm text-slate-400">
                    {isLoggedIn
                      ? "You have not joined any communities yet."
                      : "Log in to see communities you belong to."}
                  </div>
                )}
              </div>
            </Section>
          </div>
        </div>
      </aside>
    </>
  );
}
