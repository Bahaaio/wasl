/**
 * @typedef {import("../api/types.js").PostDto} PostDto
 * @typedef {import("../api/types.js").VoteAction} VoteAction
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, PencilLine, Share2, Trash2 } from "lucide-react";
import { MediaApi } from "../api/media.js";
import { CommunitiesApi } from "../api/communities.js";
import MediaCarousel from "./MediaCarousel.jsx";
import MediaLightbox from "./MediaLightbox.jsx";
import Votes from "./Votes.jsx";

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
}) {
  const navigate = useNavigate();

  const author = post.authorUsername ?? "unknown";
  const community = post.communityName ?? "";
  const initialIconMediaId = post.communityIconMediaId ?? null;
  const [communityIconMediaId, setCommunityIconMediaId] = useState(
    initialIconMediaId ?? null
  );
  const score = post?.score ?? 0;
  const commentCount = post.commentCount ?? 0;
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const vote = post.vote ?? "NONE";
  const time = post.createdAt ? formatRelativeTime(post.createdAt) : "";
  const isDeleted = post.deleted === true;
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

  const openCommunityProfile = event => {
    event.stopPropagation();
    const communitySlug = normalizeCommunitySlug(community);
    if (communitySlug) {
      navigate(`/r/${communitySlug}`);
    }
  };

  const openUserProfile = event => {
    event.stopPropagation();
    if (author) {
      navigate(`/u/${author}`);
    }
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
      className={`relative border rounded-2xl p-5 transition-all ${
        isDeleted
          ? "bg-slate-900/50 border-red-500/40 shadow-inner shadow-red-500/10"
          : "cursor-pointer bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-orange-500/5"
      }`}
    >
      <div className="flex flex-col gap-4">
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
              <button
                type="button"
                onClick={openCommunityProfile}
                className="font-semibold text-slate-200 transition-colors hover:text-orange-400"
                aria-label={`Open ${community} profile`}
              >
                {community}
              </button>
            </div>
            <span className="text-slate-500">•</span>
            <button
              type="button"
              onClick={openUserProfile}
              className="text-slate-300 transition-colors font-medium hover:text-orange-400"
              aria-label={`Open ${author} profile`}
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
            <div
              className="mb-4 rounded-lg overflow-hidden border border-slate-700/30 bg-slate-950 cursor-zoom-in"
              onClick={event => {
                event.stopPropagation();
                if (post.media.length === 1) {
                  setLightboxOpen(true);
                }
              }}
              role={post.media.length === 1 ? "button" : undefined}
              tabIndex={post.media.length === 1 ? 0 : undefined}
              onKeyDown={event => {
                if (
                  post.media.length === 1 &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  event.stopPropagation();
                  setLightboxOpen(true);
                }
              }}
            >
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
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-wrap items-center gap-2">
              <Votes
                vote={vote}
                score={score}
                disabled={isDeleted}
                onUpvote={event => {
                  event.stopPropagation();
                  handleVote("up");
                }}
                onDownvote={event => {
                  event.stopPropagation();
                  handleVote("down");
                }}
              />
              <button
                type="button"
                onClick={event => {
                  event.stopPropagation();
                  navigate(`/posts/${post.id}`);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-800/50 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-700"
                aria-label={`Open comments for post with ${commentCount} comments`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm text-slate-300">
                  {formatCompactNumber(commentCount)}
                </span>
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    onEdit?.(post);
                  }}
                  aria-label="Edit post"
                  title="Edit post"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/70 bg-slate-800/70 text-slate-100 transition-colors hover:border-orange-500/50 hover:bg-slate-700 hover:text-orange-200"
                >
                  <PencilLine className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={event => {
                    event.stopPropagation();
                    onDelete?.(post?.id);
                  }}
                  aria-label="Delete post"
                  title="Delete post"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {post.media?.length === 1 && (
            <MediaLightbox
              open={lightboxOpen}
              src={MediaApi.getFullMediaUrl(post.media[0].id)}
              alt={post.media[0].alt || "Post media"}
              onClose={() => setLightboxOpen(false)}
            />
          )}
        </div>
      </div>
    </article>
  );
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

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
