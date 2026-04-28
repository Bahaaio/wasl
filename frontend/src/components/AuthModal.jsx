import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, X, ArrowLeft } from "lucide-react";

export default function AuthModal({ isOpen, onClose, initialTab = "login" }) {
  const [tab, setTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [forgotForm, setForgotForm] = useState({ username: "" });

  const handleLoginChange = event => {
    const { name, value } = event.target;
    setLoginForm(previous => ({ ...previous, [name]: value }));
  };

  const handleRegisterChange = event => {
    const { name, value } = event.target;
    setRegisterForm(previous => ({ ...previous, [name]: value }));
  };

  const handleLoginSubmit = event => {
    event.preventDefault();
    console.log("Login:", loginForm);
    onClose();
  };

  const handleRegisterSubmit = event => {
    event.preventDefault();
    console.log("Register:", registerForm);
    onClose();
  };

  const handleForgotChange = event => {
    const { name, value } = event.target;
    setForgotForm(previous => ({ ...previous, [name]: value }));
  };

  const handleForgotSubmit = event => {
    event.preventDefault();
    console.log("Forgot Password:", forgotForm);
    setIsForgotOpen(false);
    setForgotForm({ username: "" });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close auth modal overlay"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-orange-500/40 to-red-600/40 blur-xl" />
        <div className="relative bg-slate-900 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="flex items-start justify-end mb-6">
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
              aria-label="Close auth modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 mb-8 bg-slate-800/60 p-1 rounded-full">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 py-2.5 rounded-full font-semibold transition-all ${
                tab === "login"
                  ? "bg-linear-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex-1 py-2.5 rounded-full font-semibold transition-all ${
                tab === "register"
                  ? "bg-linear-to-r from-orange-500 to-red-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Register
            </button>
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="you@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(current => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Log In
              </button>

              <p className="text-center text-sm text-slate-400 mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="text-orange-400 hover:text-orange-300 font-medium"
                >
                  Register here
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    placeholder="your_username"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="you@example.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    placeholder="Enter your password"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(current => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    placeholder="Confirm your password"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-10 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(current => !current)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2.5 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl"
              >
                Create Account
              </button>

              <p className="text-center text-sm text-slate-400 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-orange-400 hover:text-orange-300 font-medium"
                >
                  Log in here
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      {isForgotOpen && (
        <div className="fixed inset-0 z-101 flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="Close forgot password modal"
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsForgotOpen(false)}
          />
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-orange-500/40 to-red-600/40 blur-xl" />
            <div className="relative bg-slate-900 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(false)}
                  className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                  aria-label="Return to login"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotOpen(false);
                    onClose();
                  }}
                  className="p-2.5 rounded-full bg-slate-800/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 text-slate-400 hover:text-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 border border-slate-700/50 hover:border-orange-500/50"
                  aria-label="Close forgot password modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-6">
                Reset Password
              </h2>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Username or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="username"
                      value={forgotForm.username}
                      onChange={handleForgotChange}
                      placeholder="Enter your username "
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-2.5 bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
