import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PostsPage from './pages/Posts.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/posts" element={<PostsPage />} />
    </Routes>
  );
}
