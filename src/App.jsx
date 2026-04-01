import { Routes, Route } from 'react-router-dom'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BlogIndex />} />
      <Route path="/post/:slug" element={<BlogPost />} />
    </Routes>
  )
}
