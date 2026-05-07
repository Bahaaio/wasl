import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  Ellipsis,
  Globe,
  Pin,
  Plus,
  Rows3,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import SideBar from "../components/SideBar.jsx";
import { MOCK_POSTS } from "../data/mockData.js";

const HIGHLIGHT_ITEMS = [
  "It's Scrub Sunday! Ask your questions here.",
  "CDL Major III Qualifiers: Week 2 Day 3",
  "CDL Major III Qualifiers: Week 2 Day 2",
  "CDL Major III Qualifiers: Week 2 Day 1",
];

export default function CommunityProfilePage() {
  const { communitySlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768
  );

  const communityFromState = location.state?.community;
  const slug = (communitySlug || "yourcommunity").toLowerCase();
  const communityName = `r/${slug}`;

  const community = {
    displayName: communityFromState?.displayName || communityName,
    description:
      communityFromState?.description ||
      `Welcome to ${communityName}, a space where members share updates, clips, and discussions around what matters most to this community.`,
    visibility: communityFromState?.visibility || "public",
  };

  const featuredPost = useMemo(() => {
    const fromCommunity = MOCK_POSTS.find(
      post => post.community?.toLowerCase() === communityName.toLowerCase()
    );
    return (
      fromCommunity || {
        id: `post-${slug}`,
        author: "TheRealPdGaming",
        title: "Is it something about playing for the Stallions?",
        time: "1 hr. ago",
      }
    );
  }, [communityName, slug]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/posts");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <div className="relative flex min-h-[calc(100vh-4rem)]">
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-340">
          <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="relative h-36 sm:h-44">
              <img
                src="https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=1900&q=80"
                alt="Community banner"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/65" />
              <button
                type="button"
                onClick={handleBack}
                className="absolute left-3 top-3 z-20 inline-flex items-center justify-center rounded-full border border-slate-700/50 bg-slate-800/50 p-2.5 text-slate-400 shadow-lg shadow-black/30 backdrop-blur transition-all duration-300 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 hover:text-orange-400 hover:shadow-lg hover:shadow-orange-500/20 hover:border-orange-500/50"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-col gap-4 bg-slate-900/90 px-6 pb-5 pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="-mt-12 h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-slate-900 bg-orange-300 shadow-xl sm:h-24 sm:w-24">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-orange-300 text-slate-900">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                </div>
                <div className="min-w-0 pt-2">
                  <h1 className="truncate text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    {community.displayName.startsWith("r/")
                      ? community.displayName
                      : communityName}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end lg:self-auto">
                <button
                  type="button"
                  onClick={() => navigate("/create-post")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-800 px-5 py-2.5 text-base font-semibold text-white transition hover:border-orange-400/60 hover:bg-slate-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsJoined(previous => !previous)}
                  className={`rounded-full px-6 py-2.5 text-base font-semibold transition ${
                    isJoined
                      ? "border border-slate-500/60 bg-transparent text-slate-100 hover:bg-slate-800/30"
                      : "bg-linear-to-r from-orange-500 to-red-600 text-white hover:from-orange-400 hover:to-red-500"
                  }`}
                >
                  {isJoined ? "Joined" : "Join"}
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-200 transition hover:border-orange-400/60 hover:bg-slate-700"
                  aria-label="More"
                >
                  <Ellipsis className="h-5 w-5" />
                </button>
              </div>
            </div>
          </section>

          <section className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="mb-4 flex items-center gap-3 px-2 text-sm font-semibold text-slate-300">
                <button type="button" className="inline-flex items-center gap-1.5">
                  <span>Best</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-orange-300"
                >
                  <Rows3 className="h-4 w-4" />
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-slate-100">
                    <Pin className="h-4 w-4" />
                    <span className="text-2xl font-semibold">Community highlights</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {HIGHLIGHT_ITEMS.map((item, index) => (
                    <article
                      key={item}
                      className="relative min-h-48 overflow-hidden rounded-3xl border border-slate-700 bg-black p-4 transition hover:border-orange-500/60"
                    >
                      <h3 className="relative z-10 text-xl font-bold leading-tight text-white">
                        {item}
                      </h3>
                      <p className="relative z-10 mt-3 text-sm text-slate-300">May 03, 2026</p>
                      <div className="relative z-10 mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-slate-900">
                        {index === 0 ? <Shield className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                      </div>
                      <img
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80"
                        alt="Highlight"
                        className="absolute inset-0 h-full w-full object-cover opacity-35"
                      />
                      <div className="absolute inset-0 bg-black/60" />
                    </article>
                  ))}
                </div>
              </div>

              <article className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-slate-200">
                    <div className="h-8 w-8 overflow-hidden rounded-full bg-[#f4f5ff]" />
                    <span className="font-semibold">u/{featuredPost.author}</span>
                    <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300">
                      Dallas Empire
                    </span>
                    <span className="text-slate-400">• {featuredPost.time}</span>
                  </div>
                  <button type="button" className="text-slate-400 hover:text-white">
                    <Ellipsis className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-4 pb-4">
                  <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                    {featuredPost.title}
                  </h2>
                  <span className="mt-3 inline-block rounded-full bg-orange-300 px-3 py-1 text-sm font-semibold text-slate-900">
                    Video
                  </span>
                </div>

                <div className="h-80 w-full bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80"
                    alt="Post media"
                    className="h-full w-full object-cover"
                  />
                </div>
              </article>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/75 text-slate-200">
                <div className="border-b border-slate-800 p-5">
                  <h3 className="text-3xl font-bold leading-tight text-white">
                    {communityName} - the home of {slug.toUpperCase()}
                  </h3>
                  <p className="mt-3 text-lg leading-relaxed text-slate-300">
                    {community.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Created Apr 9, 2012
                    </div>
                    <div className="inline-flex items-center gap-2 capitalize">
                      <Globe className="h-4 w-4" />
                      {community.visibility}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                    <div>
                      <p className="text-3xl font-extrabold text-white">77K</p>
                      <p className="text-sm text-slate-400">players</p>
                    </div>
                    <div>
                      <p className="text-3xl font-extrabold text-white">4K</p>
                      <p className="text-sm text-slate-400">here right now</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-sm font-bold text-slate-400">USER FLAIR</h4>
                  <div className="mt-4 inline-flex items-center gap-3 text-base text-slate-200">
                    <div className="h-11 w-11 rounded-full bg-orange-500/25" />
                    Dismal-Low1544
                  </div>
                </div>
              </div>
            </aside>
          </section>
          </div>
        </main>
        </div>
    </div>
  );
}
