import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import FeatureImportanceChart from './pages/FeatureImportance/FeatureImportance'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <div className="content-overlay">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Chart" element={<FeatureImportanceChart />} />
        </Routes>
      </div>
    </div>
  )
}

export default App