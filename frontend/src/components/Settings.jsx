import { useState } from "react";
import { X } from "lucide-react";

export default function Settings({ isOpen = false, onClose }) {
  const [settings, setSettings] = useState({
    profilePublic: true,
    postsPublic: true,
    commentsPublic: true,
  });

  const handleSettingChange = setting => {
    setSettings(previous => ({
      ...previous,
      [setting]: !previous[setting],
    }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-100 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Settings Modal */}
      <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-orange-500/40 to-red-600/40 blur-xl" />
          <div className="relative bg-slate-900 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            {/* Close Button */}
            <div className="flex items-start justify-end mb-6">
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Settings</h2>

            {/* Settings Options */}
            <div className="space-y-4">
              {/* Profile Visibility */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-orange-500/30 transition-colors">
                <div>
                  <label className="block text-sm font-medium text-slate-300 cursor-pointer">
                    Profile Visibility
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    {settings.profilePublic ? "Public" : "Private"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingChange("profilePublic")}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out ${
                    settings.profilePublic
                      ? "bg-linear-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/50"
                      : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={settings.profilePublic}
                  aria-label="Profile visibility"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-md ${
                      settings.profilePublic ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Posts Visibility */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-orange-500/30 transition-colors">
                <div>
                  <label className="block text-sm font-medium text-slate-300 cursor-pointer">
                    Posts Visibility
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    {settings.postsPublic ? "Public" : "Private"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingChange("postsPublic")}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out ${
                    settings.postsPublic
                      ? "bg-linear-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/50"
                      : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={settings.postsPublic}
                  aria-label="Posts visibility"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-md ${
                      settings.postsPublic ? "translate-x-8" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Comments Visibility */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:border-orange-500/30 transition-colors">
                <div>
                  <label className="block text-sm font-medium text-slate-300 cursor-pointer">
                    Comments Visibility
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    {settings.commentsPublic ? "Public" : "Private"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSettingChange("commentsPublic")}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ease-in-out ${
                    settings.commentsPublic
                      ? "bg-linear-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-500/50"
                      : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={settings.commentsPublic}
                  aria-label="Comments visibility"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-all duration-300 ease-in-out shadow-md ${
                      settings.commentsPublic
                        ? "translate-x-8"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-6 py-2.5 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
