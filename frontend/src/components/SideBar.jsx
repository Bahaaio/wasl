import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleHelp,
  Compass,
  Flame,
  Home,
  Menu,
  Newspaper,
  Share2,
  Users,
  BookOpen,
  Rocket,
} from "lucide-react";

export default function SideBar({ isOpen, setIsOpen }) {
  const [resourcesOpen, setResourcesOpen] = useState(true);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleEscape = event => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [setIsOpen]);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) {
      return undefined;
    }

    let timeoutId;
    const handleScroll = () => {
      sidebar.classList.add("sidebar-scroll--active");
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        sidebar.classList.remove("sidebar-scroll--active");
      }, 900);
    };

    sidebar.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      sidebar.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-24 z-40 inline-flex h-12 w-10 items-center justify-center rounded-r-full border border-l-0 border-slate-800 bg-slate-900/95 text-slate-100 shadow-lg shadow-black/30 transition-colors hover:bg-slate-800"
          aria-label="Open sidebar"
          aria-expanded={isOpen}
          aria-controls="posts-sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <div
        className={`fixed inset-0 top-16 z-20 bg-slate-950/70 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="posts-sidebar"
        ref={sidebarRef}
        className={`sidebar-scroll fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 max-w-[80vw] shrink-0 border-r border-slate-800 bg-slate-950 overflow-y-auto transition-transform duration-300 ease-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] xl:w-72 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          onClick={() => setIsOpen(current => !current)}
          className="fixed right-1 top-20 z-70 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 bg-slate-950 text-slate-100 shadow-lg shadow-black/30 transition-colors hover:bg-slate-900 md:absolute md:right-1 md:top-6"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isOpen}
          aria-controls="posts-sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="px-4 py-5 flex flex-col h-full">
          <div className="mb-4 md:hidden">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Menu
            </p>
          </div>
          <nav className="space-y-8 flex-1">
            <div className="space-y-1">
              <SidebarItem
                icon={<Home className="w-5 h-5" />}
                label="Home"
                active
              />
              <SidebarItem
                icon={<Compass className="w-5 h-5" />}
                label="Popular"
              />
              <SidebarItem
                icon={<Newspaper className="w-5 h-5" />}
                label="News"
              />
              <SidebarItem
                icon={<Rocket className="w-5 h-5" />}
                label="Explore"
              />
            </div>

            <div className="border-t border-slate-800 pt-6">
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="w-full flex items-center justify-between mb-4 px-2 hover:opacity-80 transition-opacity"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Resources
                </p>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {resourcesOpen && (
                <div className="space-y-1">
                  <SidebarItem
                    icon={<CircleHelp className="w-5 h-5" />}
                    label="About WASL"
                  />
                  <SidebarItem
                    icon={<Share2 className="w-5 h-5" />}
                    label="Advertise"
                  />
                  <SidebarItem
                    icon={<BookOpen className="w-5 h-5" />}
                    label="Developer Platform"
                  />
                  <SidebarItem
                    icon={<Flame className="w-5 h-5" />}
                    label="WASL Pro"
                    badge="BETA"
                  />
                  <SidebarItem
                    icon={<CircleHelp className="w-5 h-5" />}
                    label="Help"
                  />
                  <SidebarItem
                    icon={<BookOpen className="w-5 h-5" />}
                    label="Blog"
                  />
                  <SidebarItem
                    icon={<Users className="w-5 h-5" />}
                    label="Careers"
                  />
                  <SidebarItem
                    icon={<Share2 className="w-5 h-5" />}
                    label="Press"
                  />
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-6">
              <SidebarItem
                icon={<Flame className="w-5 h-5" />}
                label="Best of WASL"
              />
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, label, active = false, badge }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
        active
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-900 hover:text-white"
      }`}
    >
      <span className={active ? "text-white" : "text-slate-400"}>{icon}</span>
      <span className="font-medium flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] font-bold tracking-wider text-orange-500">
          {badge}
        </span>
      )}
    </button>
  );
}
