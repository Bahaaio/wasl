import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import PostsPage from "./pages/Posts.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import CreateCommunityPage from "./pages/CreateCommunityPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import UserProfile from "./pages/UserProfile.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:postId" element={<PostDetailPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/create-community" element={<CreateCommunityPage />} />
      <Route path="/u/:username" element={<UserProfile />} />
    </Routes>
  );
}
