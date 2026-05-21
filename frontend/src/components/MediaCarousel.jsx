/** @typedef {import("../api/types.js").MediaDto} MediaDto */
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaApi } from "../api/media.js";

export default function MediaCarousel({ media = [], className = "" }) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);

  if (!media || media.length === 0) return null;

  const go = newIndex => {
    const clamped = ((newIndex % media.length) + media.length) % media.length;
    setIndex(clamped);
  };

  const prev = e => {
    e?.stopPropagation();
    go(index - 1);
  };

  const next = e => {
    e?.stopPropagation();
    go(index + 1);
  };

  const handleTouchStart = e => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = e => {
    if (startX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) {
        go(index + 1);
      } else {
        go(index - 1);
      }
    }
    startX.current = null;
  };

  const handleKeyDown = e => {
    if (e.key === "ArrowLeft") prev(e);
    if (e.key === "ArrowRight") next(e);
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-950 ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className="flex w-full will-change-transform"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: "transform 300ms ease-out",
        }}
      >
        {media.map((m) => (
          <div
            key={m.id}
            className="flex-none w-full relative flex items-center justify-center overflow-hidden"
          >
            {/* blurred background using the same media as a backdrop */}
            {(m.type === "IMAGE" || m.type === "GIF") && (
              <div
                className="absolute inset-0 bg-center bg-cover filter blur-2xl scale-105"
                style={{
                  backgroundImage: `url(${MediaApi.getFullMediaUrl(m.id)})`,
                }}
                aria-hidden="true"
              />
            )}
            {/* subtle dark overlay to improve contrast */}
            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

            {m.type === "IMAGE" && (
              <img
                src={MediaApi.getFullMediaUrl(m.id)}
                alt={m.alt || "Post media"}
                className="relative z-10 max-h-[70vh] md:max-h-[60vh] lg:max-h-[70vh] w-auto object-contain mx-auto"
                loading="lazy"
              />
            )}
            {m.type === "VIDEO" && (
              <video
                src={MediaApi.getFullMediaUrl(m.id)}
                controls
                className="relative z-10 max-h-[70vh] w-auto mx-auto bg-black"
              />
            )}
            {m.type === "GIF" && (
              <img
                src={MediaApi.getFullMediaUrl(m.id)}
                alt={m.alt || "Post gif"}
                className="relative z-10 max-h-[70vh] md:max-h-[60vh] lg:max-h-[70vh] w-auto object-contain mx-auto"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {media.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous media"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next media"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute left-1/2 bottom-3 -translate-x-1/2 flex gap-2 z-20">
            {media.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  go(i);
                }}
                aria-label={`Go to media ${i + 1}`}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
