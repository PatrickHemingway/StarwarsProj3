import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <div className="content-overlay">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App