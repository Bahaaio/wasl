/** @typedef {import("../api/types.js").CommunityCreateRequest} CommunityCreateRequest */
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Globe,
  Lock,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import SideBar from "../components/SideBar.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { useUser } from "../auth/useUser.jsx";
import { CommunitiesApi } from "../api/communities.js";

const COMMUNITY_CATEGORIES = [
  "Technology",
  "Gaming",
  "Programming",
  "Design",
  "Art",
  "Music",
  "Sports",
  "News",
  "Finance",
  "Education",
  "Other",
];

const COMMUNITY_TYPES = [
  {
    value: "public",
    title: "Public",
    description: "Anyone can view, post, and comment.",
    icon: Globe,
  },
  {
    value: "private",
    title: "Private",
    description: "Only invited users can view or participate.",
    icon: Lock,
  },
];

const DEFAULT_RULES = [
  "Be respectful and stay on topic.",
  "No spam, self-promotion, or low-effort posts.",
  "Use clear titles and search before posting.",
];

// default theme gradient string used for previews
const DEFAULT_THEME = "from-orange-500 to-red-500";

function normalizeCommunityName(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/^r\//, "")
    .replace(/[^a-z0-9-_\s]/g, "")
    .replace(/\s+/g, "-");
}

export default function CreateCommunityPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const showAuthModal = !isLoggedIn;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCommunity, setCreatedCommunity] = useState(null);
  const [formError, setFormError] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    CommunitiesApi.getAllCategories()
      .then(list => {
        if (mounted && Array.isArray(list)) setCategories(list);
      })
      .catch(() => {
        /* ignore - categories are optional fallback to local list */
      });

    return () => {
      mounted = false;
    };
  }, []);
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    description: "",
    category: "Technology",
    visibility: "public",
    nsfw: false,
    allowChat: true,
    theme: DEFAULT_THEME,
  });

  const handleAuthModalClose = () => {
    navigate("/", { replace: true });
  };

  const communitySlug = useMemo(
    () => normalizeCommunityName(form.name),
    [form.name]
  );

  const canContinueStepOne =
    communitySlug.length >= 3 &&
    communitySlug.length <= 21 &&
    form.displayName.trim().length >= 3 &&
    form.description.trim().length >= 20;

  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    setForm(previous => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormError("");
  };

  const handleTypeSelect = value => {
    setForm(previous => ({ ...previous, visibility: value }));
    setFormError("");
  };

  const handleNext = () => {
    if (step === 1 && !canContinueStepOne) {
      setFormError(
        "Choose a valid community name, display name, and description first."
      );
      return;
    }

    setStep(previous => Math.min(previous + 1, 3));
  };

  const handleBack = () => {
    setStep(previous => Math.max(previous - 1, 1));
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!isLoggedIn) {
      return;
    }

    if (!canContinueStepOne) {
      setFormError(
        "Choose a valid community name, display name, and description first."
      );
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    (async () => {
      try {
        // Resolve category id from server-provided categories, fallback to first
        const categoryObj =
          categories.find(c => c.name === form.category) || categories[0];
        const categoryId = categoryObj ? categoryObj.id : undefined;

        const request = {
          name: communitySlug,
          description: form.description.trim(),
          categoryId: categoryId,
          isPublic: form.visibility === "public",
        };

        const created = await CommunitiesApi.createCommunity(request);

        // Map server response into local shape used by the UI
        const nextCommunity = {
          slug: created.name || communitySlug,
          displayName: form.displayName.trim(),
          description: created.description || form.description.trim(),
          category: created.categoryName || form.category,
          visibility: created.isPublic ? "public" : "private",
          nsfw: form.nsfw,
          allowChat: form.allowChat,
          id: created.id,
        };

        setCreatedCommunity(nextCommunity);
        setIsSubmitting(false);
        navigate(`/r/${nextCommunity.slug}`, {
          state: { community: nextCommunity },
        });
      } catch (err) {
        setIsSubmitting(false);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create community";
        setFormError(
          msg.includes("exists") ? "Community name already taken." : msg
        );
        setStep(1);
      }
    })();
  };

  const submitLabel = isSubmitting
    ? "Creating community..."
    : "Create community";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-orange-500/30">
      <Navbar transparentMode={false} />
      <div className="lg:flex lg:items-start">
        <SideBar />
        {showAuthModal && <AuthModal onClose={handleAuthModalClose} />}

        <main className="relative pt-24 pb-16 lg:min-w-0 lg:flex-1">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-slate-400 transition-all duration-300 hover:border-orange-500/50 hover:bg-linear-to-br hover:from-orange-500/30 hover:to-red-600/30 hover:text-orange-400 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-black/30">
              <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
              <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative">
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="mb-8">
                    <span className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                      Create a community
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      Build your own corner of the internet.
                    </h1>
                    <p className="mt-3 max-w-2xl text-slate-400 leading-relaxed">
                      Set up a community with the same flow Reddit uses: name
                      it, define the rules, choose who can participate, and
                      preview it before you launch.
                    </p>
                  </div>

                  <div className="mb-8 grid gap-3 sm:grid-cols-3">
                    {[
                      "Step 1: Identity",
                      "Step 2: Settings",
                      "Step 3: Review",
                    ].map((label, index) => {
                      const currentStep = index + 1;
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setStep(currentStep)}
                          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                            step === currentStep
                              ? "border-orange-500/40 bg-orange-500/10 text-white"
                              : "border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-[0.2em] mb-1">
                            {label}
                          </div>
                          <div className="font-semibold">
                            {currentStep === 1
                              ? "Community identity"
                              : currentStep === 2
                                ? "Visibility and controls"
                                : "Preview and launch"}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {createdCommunity ? (
                    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl bg-emerald-500/20 p-3 text-emerald-300">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">
                            r/{createdCommunity.slug} is ready.
                          </h2>
                          <p className="mt-2 text-slate-300 max-w-xl">
                            Your community shell has been created locally. Hook
                            it to the backend next, and this same screen can
                            submit the real API payload.
                          </p>

                          <div className="mt-5 flex flex-wrap gap-3 text-sm">
                            <span className="rounded-full bg-slate-950/70 px-3 py-1.5 text-slate-200 border border-slate-800">
                              {createdCommunity.category}
                            </span>
                            <span className="rounded-full bg-slate-950/70 px-3 py-1.5 text-slate-200 border border-slate-800">
                              {createdCommunity.visibility}
                            </span>
                          </div>

                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => navigate("/")}
                              className="rounded-full bg-linear-to-r from-orange-500 to-red-600 px-5 py-2.5 font-semibold text-white transition-all hover:from-orange-400 hover:to-red-500"
                            >
                              Back to home
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCreatedCommunity(null);
                                setStep(1);
                                setForm({
                                  name: "",
                                  displayName: "",
                                  description: "",
                                  category: "Technology",
                                  visibility: "public",
                                  nsfw: false,
                                  allowChat: true,
                                  theme: DEFAULT_THEME,
                                });
                              }}
                              className="rounded-full border border-slate-700 px-5 py-2.5 font-semibold text-slate-200 transition-colors hover:bg-slate-800"
                            >
                              Create another
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {step === 1 && (
                        <div className="space-y-6">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                              Community name
                            </label>
                            <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-950/80 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all">
                              <span className="px-4 text-slate-500 font-semibold">
                                r/
                              </span>
                              <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="yourcommunity"
                                className="w-full bg-transparent px-0 py-4 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none"
                                maxLength="21"
                              />
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                              3 to 21 characters, no spaces or special symbols.
                            </p>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                              Display name
                            </label>
                            <input
                              type="text"
                              name="displayName"
                              value={form.displayName}
                              onChange={handleChange}
                              placeholder="A friendly name for your community"
                              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                              maxLength="60"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                              Description{" "}
                              <span className="text-xs text-slate-500">
                                (min 20 characters)
                              </span>
                            </label>
                            <textarea
                              name="description"
                              value={form.description}
                              onChange={handleChange}
                              placeholder="Tell people what your community is about..."
                              rows="6"
                              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                              maxLength="500"
                            />
                            {form.description.trim().length > 0 &&
                            form.description.trim().length < 20 ? (
                              <p className="mt-2 text-xs text-red-400">
                                Description must be at least 20 characters.
                              </p>
                            ) : null}
                            <p className="mt-2 text-xs text-slate-500 text-right">
                              {form.description.length}/500
                            </p>
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-xl font-semibold text-white mb-3">
                              Community type
                            </h2>
                            <div className="grid gap-3">
                              {COMMUNITY_TYPES.map(option => {
                                const Icon = option.icon;
                                const active = form.visibility === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() =>
                                      handleTypeSelect(option.value)
                                    }
                                    className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                                      active
                                        ? "border-orange-500/40 bg-orange-500/10"
                                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700"
                                    }`}
                                  >
                                    <div
                                      className={`mt-0.5 rounded-xl p-2 ${
                                        active
                                          ? "bg-orange-500/20 text-orange-300"
                                          : "bg-slate-800 text-slate-400"
                                      }`}
                                    >
                                      <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-white">
                                        {option.title}
                                      </div>
                                      <div className="text-sm text-slate-400 mt-1">
                                        {option.description}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid gap-6">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-slate-300">
                                Category
                              </label>
                              <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-slate-100 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                              >
                                {COMMUNITY_CATEGORIES.map(category => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-6">
                          <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6">
                            <div className="flex items-start gap-4">
                              <div
                                className={`h-16 w-16 rounded-2xl bg-linear-to-br ${form.theme} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
                              >
                                {communitySlug.slice(0, 1).toUpperCase() || "R"}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                                  Preview
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-white truncate">
                                  r/{communitySlug || "yourcommunity"}
                                </h2>
                                <p className="mt-2 text-slate-400">
                                  {form.displayName ||
                                    "Your community display name"}
                                </p>
                                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                                  {form.description ||
                                    "Your community description will appear here."}
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3 text-sm">
                              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200">
                                {form.category}
                              </span>
                              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 capitalize">
                                {form.visibility}
                              </span>
                              {form.nsfw && (
                                <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-red-300">
                                  18+ / NSFW
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid gap-3">
                            {DEFAULT_RULES.map((rule, index) => (
                              <div
                                key={rule}
                                className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-4"
                              >
                                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-bold text-orange-300">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">
                                    Default rule
                                  </div>
                                  <p className="text-sm text-slate-400">
                                    {rule}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {formError && (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                          {formError}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-6">
                        <div className="text-sm text-slate-500">
                          {step === 1
                            ? "Step 1 of 3"
                            : step === 2
                              ? "Step 2 of 3"
                              : "Step 3 of 3"}
                        </div>

                        <div className="flex gap-3">
                          {step > 1 && (
                            <button
                              type="button"
                              onClick={handleBack}
                              className="rounded-full border border-slate-700 px-5 py-2.5 font-semibold text-slate-200 transition-colors hover:bg-slate-800"
                            >
                              Back
                            </button>
                          )}

                          {step < 3 ? (
                            <button
                              type="button"
                              onClick={handleNext}
                              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-red-600 px-5 py-2.5 font-semibold text-white transition-all hover:from-orange-400 hover:to-red-500"
                            >
                              Continue
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-red-600 px-5 py-2.5 font-semibold text-white transition-all hover:from-orange-400 hover:to-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {submitLabel}
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
