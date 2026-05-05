import { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  Search,
  Menu,
  Edit3,
  Moon,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal.jsx";
import {
  getAccessToken,
  getUser,
  clearAccessToken,
  onAuthChange,
} from "../auth/store.js";
import { authApi } from "../api/auth.js";
import { usersApi } from "../api/users.js";

export default function Navbar({ transparentMode = false }) {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState("login");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const currentToken = getAccessToken();
    const currentUser = getUser();
    return !!(currentToken && currentUser);
  });
  const [user, setUser] = useState(() => {
    const currentToken = getAccessToken();
    const currentUser = getUser();
    return currentToken && currentUser ? currentUser : null;
  });
  const [avatarUrl, setAvatarUrl] = useState("");
  const profileRef = useRef(null);

  const getAvatarFallback = userObj =>
    userObj?.username
      ? userObj.username
          .split(/[^a-zA-Z0-9]+/)
          .filter(Boolean)
          .map(part => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "U";

  useEffect(() => {
    const handleClickOutside = event => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(authState => {
      if (authState.token && authState.user) {
        setIsLoggedIn(true);
        setUser(authState.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setAvatarUrl("");
      }
    });

    return unsubscribe;
  }, []);

  // Load user avatar
  useEffect(() => {
    const loadUserAvatar = async () => {
      try {
        const currentUser = getUser();
        if (currentUser?.avatar_media_id) {
          const blob = await usersApi.getCurrentUserFullAvatar(
            currentUser.avatar_media_id
          );
          const url = URL.createObjectURL(blob);
          setAvatarUrl(url);
        }
      } catch (err) {
        console.error("Failed to load avatar:", err);
      }
    };

    if (isLoggedIn) {
      loadUserAvatar();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    if (transparentMode) {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [transparentMode]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    clearAccessToken();
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileOpen(false);
    window.location.reload();
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
          transparentMode
            ? isScrolled
              ? "bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
              : "bg-transparent border-b border-transparent"
            : "bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex flex-1 items-center">
              <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-linear-to-tr from-orange-500 to-red-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400 tracking-tight">
                  WASL
                </span>
              </Link>
            </div>

            <div className="hidden md:flex flex-2 justify-center px-4 lg:px-10">
              <div className="relative w-full max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search communities, posts, or users..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
              <div className="relative" ref={profileRef}>
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-1 rounded-full transition-all border border-transparent hover:border-slate-700 hover:bg-slate-800/50"
                    title="User menu"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xs">
                        {getAvatarFallback(user)}
                      </div>
                    )}
                  </button>
                ) : null}

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                      <p className="text-sm font-semibold text-slate-200">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs text-slate-400">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate(`/u/${user?.username}`);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors text-left border-b border-slate-800"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Moon className="w-4 h-4" />
                      <span>Display Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-slate-200 hover:bg-slate-800 transition-colors text-left border-t border-slate-800"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-slate-800"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

              {!isLoggedIn && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthInitialTab("login");
                      setIsAuthOpen(true);
                    }}
                    className="inline-flex sm:hidden items-center justify-center text-xs font-semibold text-white bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 px-3 py-2 rounded-full transition-all shadow-[0_0_25px_-10px_rgba(249,115,22,0.8)]"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthInitialTab("register");
                      setIsAuthOpen(true);
                    }}
                    className="hidden sm:inline-flex items-center justify-center text-sm font-semibold text-slate-200 px-3 py-2 rounded-full border border-slate-700 hover:bg-slate-800 transition-all"
                  >
                    Sign Up
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthInitialTab("login");
                      setIsAuthOpen(true);
                    }}
                    className="hidden sm:block text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 px-4 py-2 rounded-full transition-all shadow-[0_0_25px_-10px_rgba(249,115,22,0.8)]"
                  >
                    Log In
                  </button>
                </>
              )}

              <button className="md:hidden text-slate-300">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        key={`${isAuthOpen}-${authInitialTab}`}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authInitialTab}
      />
    </>
  );
}
