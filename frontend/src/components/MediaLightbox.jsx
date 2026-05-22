import { X } from "lucide-react";

export default function MediaLightbox({
  open = false,
  src = "",
  alt = "",
  onClose,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-slate-950/80 text-white transition-colors hover:bg-slate-900"
        aria-label="Close image preview"
      >
        <X className="h-5 w-5" />
      </button>

      <div
        className="max-h-[92vh] max-w-[92vw] overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl shadow-black/50"
        onClick={event => event.stopPropagation()}
        role="presentation"
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[92vh] max-w-[92vw] object-contain"
        />
      </div>
    </div>
  );
}
