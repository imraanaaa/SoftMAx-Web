import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import PostDetailPage from './pages/PostDetailPage.jsx'
import PostsPage from './pages/PostsPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/auth/sso-callback" element={<AuthCallbackPage />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/:username/:postId" element={<PostDetailPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App
