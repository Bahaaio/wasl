export const MOCK_POSTS = [
  {
    id: 1,
    community: "r/javascript",
    author: "frontendNinja",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "What is your favorite React optimization trick?",
    comments: 128,
    upvotes: "3.2k",
    time: "4h ago",
  },
  {
    id: 2,
    community: "r/webdev",
    author: "csswizard",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "Share your best UI animation examples",
    comments: 87,
    upvotes: "2.1k",
    time: "7h ago",
  },
  {
    id: 3,
    community: "r/reactjs",
    author: "stateManager",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "React Router v7: what changed for you?",
    comments: 64,
    upvotes: "1.6k",
    time: "10h ago",
  },
  {
    id: 4,
    community: "r/reactjs",
    author: "stateManager",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "React Router v7: what changed for you?",
    comments: 64,
    upvotes: "1.6k",
    time: "10h ago",
  },
  {
    id: 5,
    community: "r/reactjs",
    author: "stateManager",
    upvoted: false,
    downvoted: false,
    saved: false,
    title: "React Router v7: what changed for you?",
    comments: 64,
    upvotes: "1.6k",
    time: "10h ago",
  },
];

export const MOCK_PROFILE_COMMENTS = [
  {
    id: 1,
    author: "csswizard",
    time: "2h ago",
    community: "r/webdev",
    body: "The gradient layering here is solid. I'd keep the motion subtle so the layout stays readable.",
  },
  {
    id: 2,
    author: "stateManager",
    time: "6h ago",
    community: "r/reactjs",
    body: "A reusable component would make this much easier to place in a profile or post detail view.",
  },
  {
    id: 3,
    author: "frontendNinja",
    time: "1d ago",
    community: "r/javascript",
    body: "The tab interaction feels cleaner once the empty state is replaced with actual content.",
  },
];

export const MOCK_POST_DETAIL_COMMENTS = [
  {
    id: 1,
    author: "AutoModerator",
    time: "2d ago",
    body: "Please keep the discussion civil and on-topic.",
    sticky: true,
    score: 42,
  },
  {
    id: 2,
    author: "No-Alternative-1185",
    time: "2d ago",
    body: "WOW",
    score: 18,
  },
  {
    id: 3,
    author: "Big_mo32",
    time: "2d ago",
    body: "❤️❤️",
    isOp: true,
    score: 31,
  },
  {
    id: 4,
    author: "Theglamorous",
    time: "1d ago",
    body: "Impressive",
    score: 15,
  },
  {
    id: 5,
    author: "anxious_girl5",
    time: "1d ago",
    body: "10/10",
    score: 12,
  },
];

export const MOCK_COMMUNITIES = [
  {
    name: "r/javascript",
    members: "2.4M members",
    accent: "from-orange-500 to-red-500",
  },
  {
    name: "r/reactjs",
    members: "1.8M members",
    accent: "from-indigo-500 to-cyan-500",
  },
  {
    name: "r/frontend",
    members: "840K members",
    accent: "from-pink-500 to-rose-500",
  },
];

export const MOCK_PROFILE_USER = {
  username: "frontendNinja",
  avatar: "FN",
  karma: 1,
  followers: 0,
  contributions: 0,
  redditAge: "0 d",
  activeIn: 0,
  goldEarned: 0,
};

export const MOCK_PROFILE_TABS = [
  "Overview",
  "Posts",
  "Comments",
  "Saved",
  "History",
  "Hidden",
  "Upvoted",
  "Downvoted",
];

export const MOCK_TRENDING_POSTS = [
  {
    id: 101,
    community: "r/javascript",
    author: "frontendNinja",
    title: "What is your favorite React optimization trick?",
    upvotes: "3.2k",
    comments: 128,
    time: "4h ago",
    tags: ["React", "Performance", "Tips"],
  },
  {
    id: 102,
    community: "r/webdev",
    author: "csswizard",
    title: "Show your best modern landing page animation examples",
    upvotes: "2.1k",
    comments: 87,
    time: "7h ago",
    tags: ["CSS", "Animation", "UI"],
  },
  {
    id: 103,
    community: "r/reactjs",
    author: "stateManager",
    title: "Router upgrade notes: what changed most for your app?",
    upvotes: "1.6k",
    comments: 64,
    time: "10h ago",
    tags: ["React", "Routing", "Architecture"],
  },
];

export const MOCK_HOMEPAGE_COMMUNITIES = [
  {
    name: "r/javascript",
    color: "bg-orange-500",
  },
  {
    name: "r/reactjs",
    color: "bg-cyan-500",
  },
  {
    name: "r/webdev",
    color: "bg-emerald-500",
  },
  {
    name: "r/frontend",
    color: "bg-pink-500",
  },
  {
    name: "r/tailwindcss",
    color: "bg-sky-500",
  },
];
