/**
 * @typedef {import("../api/types.js").PostDto} PostDto
 * @typedef {import("../api/types.js").VoteAction} VoteAction
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBigUp, MessageCircle, Share2, Trash2 } from "lucide-react";
import { getNetVoteScore } from "../api/util.js";
import { MediaApi } from "../api/media.js";
import { CommunitiesApi } from "../api/communities.js";
import MediaCarousel from "./MediaCarousel.jsx";

const communityIconCache = new Map();

function normalizeCommunitySlug(value) {
  return String(value || "")
    .trim()
    .replace(/^r\//i, "");
}

export default function PostCard({
  post,
  onUpvote,
  onDownvote,
  onEdit,
  onDelete,
  isEditable = false,
  isDeleting = false,
}) {
  const navigate = useNavigate();

  const author = post.authorUsername ?? post.author ?? "unknown";
  const community = post.communityName ?? post.community ?? "";
  const initialIconMediaId =
    post.communityIconMediaId ??
    post.iconMediaId ??
    post.community?.iconMediaId ??
    null;
  const [communityIconMediaId, setCommunityIconMediaId] = useState(
    initialIconMediaId ?? null
  );
  const score = getNetVoteScore(post);
  const commentCount = post.commentCount ?? post.comments ?? 0;
  const vote =
    post.vote ??
    (post.upvoted ? "UPVOTE" : post.downvoted ? "DOWNVOTE" : "NONE");
  const time = post.createdAt ? formatRelativeTime(post.createdAt) : post.time;
  const scoreLabel = formatCompactNumber(score);
  const isDeleted = post.softDeleted === true || post.deleted === true;
  const title = post.title;
  const body = isDeleted
    ? "Sorry, this post was deleted by the person who originally posted it."
    : post.content;

  const openPostDetail = () => {
    navigate(`/posts/${post.id}`);
  };

  const stopCardNavigation = event => {
    event.stopPropagation();
  };

  const handleVote = direction => {
    if (direction === "up") {
      onUpvote && onUpvote(post.id, vote === "UPVOTE" ? "NONE" : "UPVOTE");
      return;
    }

    onDownvote &&
      onDownvote(post.id, vote === "DOWNVOTE" ? "NONE" : "DOWNVOTE");
  };

  useEffect(() => {
    const communitySlug = normalizeCommunitySlug(community);
    if (!communitySlug) {
      // Defer state update to avoid synchronous setState inside effect
      Promise.resolve().then(() =>
        setCommunityIconMediaId(initialIconMediaId ?? null)
      );
      return undefined;
    }

    if (initialIconMediaId) {
      // Defer state update to avoid synchronous setState inside effect
      Promise.resolve().then(() => setCommunityIconMediaId(initialIconMediaId));
      communityIconCache.set(communitySlug, initialIconMediaId);
      return undefined;
    }

    const cachedIcon = communityIconCache.get(communitySlug);
    if (cachedIcon !== undefined) {
      // Defer state update to avoid synchronous setState inside effect
      Promise.resolve().then(() => setCommunityIconMediaId(cachedIcon));
      return undefined;
    }

    let isMounted = true;

    CommunitiesApi.getCommunityByName(communitySlug)
      .then(data => {
        if (!isMounted) return;
        const nextIcon = data?.iconMediaId ?? null;
        setCommunityIconMediaId(nextIcon);
        communityIconCache.set(communitySlug, nextIcon);
      })
      .catch(() => {
        if (!isMounted) return;
        setCommunityIconMediaId(null);
        communityIconCache.set(communitySlug, null);
      });

    return () => {
      isMounted = false;
    };
  }, [community, initialIconMediaId]);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openPostDetail}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openPostDetail();
        }
      }}
      className={`border rounded-2xl p-5 transition-all ${
        isDeleted
          ? "bg-slate-900/50 border-red-500/40 shadow-inner shadow-red-500/10"
          : "cursor-pointer bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-orange-500/5"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* Vote Column */}
        <div
          className={`flex flex-row sm:flex-col items-center gap-2 sm:gap-1 shrink-0 rounded-xl p-2 ${
            isDeleted
              ? "text-slate-500 bg-slate-900/60 border border-red-500/30"
              : "text-slate-400 bg-slate-800/50"
          }`}
        >
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              handleVote("up");
            }}
            disabled={isDeleted}
            className={`p-1 rounded transition-colors ${
              vote === "UPVOTE"
                ? "text-orange-500 bg-orange-500/10"
                : isDeleted
                  ? "cursor-not-allowed text-slate-500"
                  : "hover:text-orange-400 hover:bg-slate-700"
            }`}
            aria-label="Upvote"
          >
            <ArrowBigUp className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold">{scoreLabel}</span>
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              handleVote("down");
            }}
            disabled={isDeleted}
            className={`p-1 rounded transition-colors ${
              vote === "DOWNVOTE"
                ? "text-indigo-500 bg-indigo-500/10"
                : isDeleted
                  ? "cursor-not-allowed text-slate-500"
                  : "hover:text-indigo-400 hover:bg-slate-700"
            }`}
            aria-label="Downvote"
          >
            <ArrowBigUp className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mb-2">
            <div className="inline-flex items-center gap-2">
              {communityIconMediaId ? (
                <img
                  src={MediaApi.getThumbnailMediaUrl(communityIconMediaId)}
                  alt={`${community} avatar`}
                  className="h-5 w-5 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-slate-700/70 border border-slate-600" />
              )}
              <span className="font-semibold text-slate-200">{community}</span>
            </div>
            <span className="text-slate-500">•</span>
            <button
              type="button"
              onClick={() => navigate(`/u/${author}`)}
              onClickCapture={stopCardNavigation}
              className="text-slate-300 hover:text-orange-400 transition-colors font-medium"
            >
              posted by u/{author}
            </button>
            <span className="text-slate-500">•</span>
            <span>{time}</span>
          </div>
          {!isDeleted && (
            <h2 className="text-lg font-semibold mb-3">{title}</h2>
          )}
          {!isDeleted && post.media && post.media.length > 0 && (
            <div className="mb-4 rounded-lg overflow-hidden border border-slate-700/30 bg-slate-950">
              {post.media.length === 1 ? (
                <div className="relative w-full flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute inset-0 bg-center bg-cover filter blur-2xl scale-105"
                    style={{
                      backgroundImage: `url(${MediaApi.getFullMediaUrl(post.media[0].id)})`,
                    }}
                    aria-hidden="true"
                  />
                  <div
                    className="absolute inset-0 bg-black/40"
                    aria-hidden="true"
                  />
                  <img
                    src={MediaApi.getFullMediaUrl(post.media[0].id)}
                    alt="Post media"
                    className="relative z-10 max-h-[60vh] md:max-h-[60vh] lg:max-h-[70vh] w-auto object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
              ) : (
                <MediaCarousel media={post.media} />
              )}
            </div>
          )}
          {!isDeleted && post.content && (
            <p className="text-sm text-slate-300 mb-3 line-clamp-2">
              {post.content}
            </p>
          )}
          {isDeleted && (
            <div className="mb-3 space-y-2">
              <h2 className="text-base font-semibold text-slate-200">
                {title}
              </h2>
              <div className="flex items-center gap-2 rounded-lg bg-slate-950/40 px-3 py-2 text-sm text-slate-300">
                <Trash2 className="h-4 w-4 text-red-400" />
                <span>{body}</span>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-3 rounded-2xl bg-slate-950/30 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  navigate(`/posts/${post.id}`);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
                aria-label={`Open comments for post with ${commentCount} comments`}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClickCapture={stopCardNavigation}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {isEditable && (
              <div className="flex flex-wrap items-center gap-2 pt-3 sm:pt-0 sm:pl-3">
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    onEdit?.(post);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-1.5 text-sm text-slate-100 transition-colors hover:border-orange-500/50 hover:bg-slate-700 hover:text-orange-200"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    onDelete?.(post.id);
                  }}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatRelativeTime(value) {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return value;
  }

  const deltaMinutes = Math.max(
    1,
    Math.floor((Date.now() - timestamp) / 60000)
  );

  if (deltaMinutes < 60) {
    return `${deltaMinutes}m ago`;
  }

  const deltaHours = Math.floor(deltaMinutes / 60);
  if (deltaHours < 24) {
    return `${deltaHours}h ago`;
  }

  const deltaDays = Math.floor(deltaHours / 24);
  return `${deltaDays}d ago`;
}
