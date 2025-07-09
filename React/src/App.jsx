import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content-overlay">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App


