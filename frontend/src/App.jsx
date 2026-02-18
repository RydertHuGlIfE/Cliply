import { Routes, Route } from 'react-router-dom'
import RecorderPage from './pages/RecorderPage'
import ViewerPage from './pages/ViewerPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RecorderPage />} />
      <Route path="/view/:id" element={<ViewerPage />} />
    </Routes>
  )
}
