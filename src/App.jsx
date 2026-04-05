import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage.jsx'
import PostDetailPage from './pages/PostDetailPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/:username/:postId" element={<PostDetailPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  )
}

export default App
