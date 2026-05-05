import {
  ArrowBigUp,
  Flame,
  Globe,
  Zap,
  Shield,
  Users,
  ChevronRight,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import {
  MOCK_HOMEPAGE_COMMUNITIES,
  MOCK_TRENDING_POSTS,
} from "../data/mockData.js";
import { getAccessToken } from "../auth/store.js";

const PostCard = ({ post }) => (
  <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 hover:bg-slate-800/50 transition-all duration-300 cursor-pointer group hover:border-slate-700 relative overflow-hidden backdrop-blur-sm">
    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>

    <div className="flex items-start gap-4 relative z-10">
      {/* Upvote Column */}
      <div className="flex flex-col items-center gap-1">
        <button className="text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 p-1 rounded transition-colors">
          <ArrowBigUp className="w-6 h-6" />
        </button>
        <span className="text-sm font-bold text-slate-300">{post.upvotes}</span>
        <button className="text-slate-500 hover:text-indigo-500 hover:bg-indigo-500/10 p-1 rounded transition-colors">
          <ArrowBigUp className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs mb-2">
          <span className="font-bold text-slate-200 hover:underline">
            {post.community}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Posted by u/{post.author}</span>
          <span className="text-slate-500">{post.time}</span>
        </div>

        <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-orange-400 transition-colors">
          {post.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider font-semibold rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-sm">
          <button className="flex items-center gap-1.5 hover:text-slate-200 transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full">
            <MessageCircle className="w-4 h-4" />
            {post.comments} Comments
          </button>
          <button className="flex items-center gap-1.5 hover:text-slate-200 transition-colors bg-slate-800/50 px-3 py-1.5 rounded-full">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCreateCommunity = () => {
    if (!getAccessToken()) {
      setShowAuthModal(true);
      return;
    }
    // TODO: Navigate to community creation page when it exists
    navigate("/create-community");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-orange-500/30 font-sans overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <Navbar transparentMode={true} />

      <main className="relative z-10 pt-32 pb-20">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-32">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
            The front page of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 via-red-500 to-purple-500">
              your internet.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Dive into thousands of communities, share your passions, upvote the
            best content, and join the conversation on the most dynamic platform
            ever built.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/posts")}
              className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_-10px_rgba(249,115,22,0.6)] hover:-translate-y-1"
            >
              Start Browsing Now
            </button>
            <button
              onClick={handleCreateCommunity}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white rounded-full font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-2 hover:-translate-y-1"
            >
              Create a Community <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* TRENDING PREVIEW SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="flex items-center gap-3 mb-8">
            <Flame className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Trending Right Now</h2>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Feed */}
            <div className="space-y-4">
              {MOCK_TRENDING_POSTS.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Communities Preview */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-200 border-b border-slate-800 pb-2">
                  Top Communities
                </h3>
                <div className="space-y-4">
                  {MOCK_HOMEPAGE_COMMUNITIES.map((comm, i) => (
                    <div
                      key={comm.name}
                      className="flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-medium w-4">
                          {i + 1}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full ${comm.color} flex items-center justify-center shadow-lg shadow-${comm.color}/20`}
                        >
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-300 group-hover:text-white transition-colors">
                          {comm.name}
                        </span>
                      </div>
                      <button className="text-xs font-bold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full group-hover:bg-slate-700 transition-colors">
                        Join
                      </button>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-sm font-semibold rounded-xl transition-colors border border-slate-700">
                  View All Communities
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID FEATURES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Built for true connection.
            </h2>
            <p className="text-slate-400 text-lg">
              Everything you love about forums, supercharged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1 */}
            <div className="md:col-span-2 bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <Users className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Micro-Communities</h3>
              <p className="text-slate-400 max-w-sm">
                Create or join thousands of niche spaces. From macroeconomics to
                mechanical keyboards, there's a space for your obsession.
              </p>
              <div className="absolute -bottom-5 -right-5 opacity-20 group-hover:opacity-40 transition-opacity">
                <Users className="w-48 h-48 text-blue-500" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <Zap className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-slate-400">
                Optimized for speed. No more waiting for endless threads to
                load.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <Shield className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Self-Moderated</h3>
              <p className="text-slate-400">
                Robust tools for community owners to keep out spam and toxicity
                automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 bg-linear-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group flex items-center">
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-orange-500/5 to-transparent blur-2xl group-hover:from-orange-500/10 transition-all duration-500"></div>
              <div className="relative z-10 w-full flex justify-between items-center">
                <div>
                  <ArrowBigUp className="w-10 h-10 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    The power of the Upvote
                  </h3>
                  <p className="text-slate-400 max-w-sm">
                    The best content naturally rises to the top. Your vote
                    literally shapes the front page.
                  </p>
                </div>
                <div className="hidden md:flex flex-col gap-2 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <ArrowBigUp className="w-8 h-8 text-orange-500" />
                  <span className="font-bold text-2xl">45.2k</span>
                  <ArrowBigUp className="w-8 h-8 text-slate-700 rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
