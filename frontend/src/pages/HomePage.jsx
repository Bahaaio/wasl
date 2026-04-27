import {
  MessageSquare,
  ArrowBigUp,
  Flame,
  Globe,
  Search,
  Menu,
  Zap,
  Shield,
  Users,
  ChevronRight,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const TRENDING_POSTS = [];

const COMMUNITIES = [];

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center h-16">
        {/* Logo */}
        <div className="flex flex-1 items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              WASL
            </span>
          </div>
        </div>

        {/* Search - Desktop */}
        <div className="hidden md:flex flex-3 justify-center px-8">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search communities, posts, or users..."
              className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <button className="hidden sm:block text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 px-4 py-2 rounded-full transition-all shadow-[0_0_25px_-10px_rgba(249,115,22,0.8)]">
            Log In
          </button>
          <button className="md:hidden text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

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
        <div className="flex items-center gap-2 text-xs mb-2">
          <span className="font-bold text-slate-200 hover:underline">{post.community}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Posted by u/{post.author}</span>
          <span className="text-slate-500">{post.time}</span>
        </div>

        <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-orange-400 transition-colors">
          {post.title}
        </h3>

        <div className="flex items-center gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider font-semibold rounded-md">
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-orange-500/30 font-sans overflow-x-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-20">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">v2.0 is now live in open beta</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
            The front page of <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
              your internet.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Dive into thousands of communities, share your passions, upvote the best content, and join the conversation on the most dynamic platform ever built.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/posts')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-full font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_-10px_rgba(249,115,22,0.6)] hover:-translate-y-1"
            >
              Start Browsing Now
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white rounded-full font-bold text-lg transition-all backdrop-blur-md flex items-center justify-center gap-2 hover:-translate-y-1">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feed */}
            <div className="lg:col-span-2 space-y-4">
              {TRENDING_POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Sidebar Preview */}
            <div className="space-y-6">
              <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="font-bold text-lg mb-4 text-slate-200 border-b border-slate-800 pb-2">Top Communities</h3>
                <div className="space-y-4">
                  {COMMUNITIES.map((comm, i) => (
                    <div key={comm.name} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-medium w-4">{i + 1}</span>
                        <div className={`w-8 h-8 rounded-full ${comm.color} flex items-center justify-center shadow-lg shadow-${comm.color}/20`}>
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-300 group-hover:text-white transition-colors">{comm.name}</span>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Built for true connection.</h2>
            <p className="text-slate-400 text-lg">Everything you love about forums, supercharged.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1 */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <Users className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Micro-Communities</h3>
              <p className="text-slate-400 max-w-sm">Create or join thousands of niche spaces. From macroeconomics to mechanical keyboards, there's a space for your obsession.</p>
              <div className="absolute bottom-[-20px] right-[-20px] opacity-20 group-hover:opacity-40 transition-opacity">
                <Users className="w-48 h-48 text-blue-500" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <Zap className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-slate-400">Optimized for speed. No more waiting for endless threads to load.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group">
              <Shield className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Self-Moderated</h3>
              <p className="text-slate-400">Robust tools for community owners to keep out spam and toxicity automatically.</p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group flex items-center">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/5 to-transparent blur-2xl group-hover:from-orange-500/10 transition-all duration-500"></div>
              <div className="relative z-10 w-full flex justify-between items-center">
                <div>
                  <ArrowBigUp className="w-10 h-10 text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">The power of the Upvote</h3>
                  <p className="text-slate-400 max-w-sm">The best content naturally rises to the top. Your vote literally shapes the front page.</p>
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

        {/* CTA SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 blur-3xl -z-10 rounded-[100px]"></div>
          <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to dive down the rabbit hole?</h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                Join millions of users sharing ideas, debating facts, and posting cat pictures. Account creation takes exactly 4 seconds.
              </p>
              <button className="px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]">
                Create Free Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-lg pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center">
                  <MessageSquare className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-lg">Threaded</span>
              </div>
              <p className="text-slate-500 text-sm">The front page of your internet. Reimagined for 2026.</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-slate-200">Company</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-orange-400 cursor-pointer">About</li>
                <li className="hover:text-orange-400 cursor-pointer">Careers</li>
                <li className="hover:text-orange-400 cursor-pointer">Press</li>
                <li className="hover:text-orange-400 cursor-pointer">Blog</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-slate-200">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-orange-400 cursor-pointer">Community Rules</li>
                <li className="hover:text-orange-400 cursor-pointer">Help Center</li>
                <li className="hover:text-orange-400 cursor-pointer">API Documentation</li>
                <li className="hover:text-orange-400 cursor-pointer">Moderator Guidelines</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-slate-200">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="hover:text-orange-400 cursor-pointer">User Agreement</li>
                <li className="hover:text-orange-400 cursor-pointer">Privacy Policy</li>
                <li className="hover:text-orange-400 cursor-pointer">Content Policy</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <p>© 2026 Threaded Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Twitter</span>
              <span className="hover:text-slate-300 cursor-pointer">Github</span>
              <span className="hover:text-slate-300 cursor-pointer">Discord</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
