import { MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-lg pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-linear-to-tr from-orange-500 to-red-500 flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <span className="font-bold text-lg">WASL</span>
            </div>
            <p className="text-slate-500 text-sm">
              The front page of your internet. Reimagined for 2026.
            </p>
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
              <li className="hover:text-orange-400 cursor-pointer">
                Community Rules
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Help Center
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                API Documentation
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Moderator Guidelines
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-slate-200">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li className="hover:text-orange-400 cursor-pointer">
                User Agreement
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-orange-400 cursor-pointer">
                Content Policy
              </li>
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
  );
}
