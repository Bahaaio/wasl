import { useNavigate } from "react-router-dom";
import { ArrowBigUp, MessageCircle, Award, Share2 } from "lucide-react";

export default function PostCard({ post, onUpvote, onDownvote, onSave }) {
  const navigate = useNavigate();

  return (
    <article className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-orange-500/5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Vote Column */}
        <div className="flex flex-row sm:flex-col items-center gap-2 sm:gap-1 text-slate-400 shrink-0 bg-slate-800/50 rounded-xl p-2">
          <button
            type="button"
            onClick={() => onUpvote(post.id)}
            className={`p-1 rounded transition-colors ${
              post.upvoted
                ? "text-orange-500 bg-orange-500/10"
                : "hover:text-orange-400 hover:bg-slate-700"
            }`}
            aria-label="Upvote"
          >
            <ArrowBigUp className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold">{post.upvotes}</span>
          <button
            type="button"
            onClick={() => onDownvote(post.id)}
            className={`p-1 rounded transition-colors ${
              post.downvoted
                ? "text-indigo-500 bg-indigo-500/10"
                : "hover:text-indigo-400 hover:bg-slate-700"
            }`}
            aria-label="Downvote"
          >
            <ArrowBigUp className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-200">
              {post.community}
            </span>
            <span className="text-slate-500">•</span>
            <span>posted by u/{post.author}</span>
            <span className="text-slate-500">•</span>
            <span>{post.time}</span>
          </div>
          <h2 className="text-lg font-semibold mb-3">{post.title}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => navigate(`/posts/${post.id}`)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments} comments
            </button>
            <button
              type="button"
              onClick={() => onSave(post.id)}
              className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full transition-colors ${
                post.saved
                  ? "text-orange-400 bg-orange-500/10"
                  : "text-slate-300 bg-slate-800/50 hover:bg-slate-700"
              }`}
              aria-label="Save post"
            >
              <Award className="w-4 h-4" />
              Save
            </button>
            <button className="inline-flex items-center gap-1.5 text-sm text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
