import { ArrowLeft, Flame, MessageCircle, ArrowBigUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const POSTS = [
  {
    id: 1,
    community: 'r/javascript',
    author: 'frontendNinja',
    title: 'What is your favorite React optimization trick?',
    comments: 128,
    upvotes: '3.2k',
    time: '4h ago'
  },
  {
    id: 2,
    community: 'r/webdev',
    author: 'csswizard',
    title: 'Share your best UI animation examples',
    comments: 87,
    upvotes: '2.1k',
    time: '7h ago'
  },
  {
    id: 3,
    community: 'r/reactjs',
    author: 'stateManager',
    title: 'React Router v7: what changed for you?',
    comments: 64,
    upvotes: '1.6k',
    time: '10h ago'
  }
];

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <h1 className="text-xl sm:text-2xl font-bold">Posts</h1>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        {POSTS.map((post) => (
          <article
            key={post.id}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center text-slate-400">
                <ArrowBigUp className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-semibold">{post.upvotes}</span>
              </div>

              <div className="flex-1">
                <p className="text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-200">{post.community}</span> • posted by u/{post.author} • {post.time}
                </p>
                <h2 className="text-lg font-semibold mb-3">{post.title}</h2>
                <button className="inline-flex items-center gap-2 text-sm text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  {post.comments} comments
                </button>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
