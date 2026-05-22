import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function MediaLightbox({
  open = false,
  src = "",
  alt = "",
  media = [],
  index = 0,
  onPrev,
  onNext,
  onClose,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (open) {
      overlayRef.current?.focus();
    }
  }, [open, index]);

  const hasMediaList = Array.isArray(media) && media.length > 0;
  const currentMedia = hasMediaList ? media[index] : null;
  const currentSrc = currentMedia?.src ?? src;
  const currentAlt = currentMedia?.alt ?? alt;

  const handleKeyDown = event => {
    if (event.key === "Escape") {
      onClose?.();
      return;
    }

    if (event.key === "ArrowLeft") {
      onPrev?.(event);
      return;
    }

    if (event.key === "ArrowRight") {
      onNext?.(event);
    }
  };
  if (!open) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out ${
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      role="presentation"
      onKeyDown={handleKeyDown}
      tabIndex={open ? 0 : -1}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-white transition-all duration-200 ease-out hover:bg-slate-900 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        aria-label="Close image preview"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className={`max-h-[92vh] max-w-[92vw] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/50 transition-all duration-200 ease-out ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={event => event.stopPropagation()}
        role="presentation"
      >
        <img
          src={currentSrc}
          alt={currentAlt}
          className="max-h-[92vh] max-w-[92vw] object-contain"
        />
      </div>

      {hasMediaList && media.length > 1 && onPrev && onNext && (
        <>
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              onPrev(event);
            }}
            className={`absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-white transition-all duration-200 ease-out hover:bg-slate-900 ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              onNext(event);
            }}
            className={`absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-white transition-all duration-200 ease-out hover:bg-slate-900 ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className={`absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs text-slate-200 transition-all duration-200 ease-out ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <span>
              {index + 1} / {media.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
