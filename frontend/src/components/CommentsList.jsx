import { MessageCircle, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CommentsList({ comments }) {
  const navigate = useNavigate();
  
  if (!comments?.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <article
          key={comment.id}
          className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-red-600 text-sm font-bold text-white shadow-lg shadow-orange-500/10">
              {comment.author
                .split(" ")
                .map(part => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => navigate(`/u/${comment.author}`)}
                  className="font-semibold text-slate-200 hover:text-orange-400 transition-colors"
                >
                  u/{comment.author}
                </button>
                <span className="text-slate-600">•</span>
                <span>{comment.time}</span>
                <span className="text-slate-600">•</span>
                <span>{comment.community}</span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-200">
                {comment.body}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-orange-400">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Reply
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/60 px-3 py-1.5 transition-colors hover:bg-slate-700 hover:text-slate-200">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  More
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
