import { MessageSquare, Search, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
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

          <div className="hidden md:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search communities, posts, or users..."
                className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

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
}