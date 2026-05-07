import { Camera } from "lucide-react";

export default function CameraButton({
  onClick,
  disabled,
  ariaLabel,
  className = "",
}) {
  const baseClassName =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors bg-slate-950/70 text-slate-200 border-slate-700 hover:text-orange-300 hover:border-orange-500/60 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClassName} ${className}`}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <Camera className="w-4 h-4" />
    </button>
  );
}
