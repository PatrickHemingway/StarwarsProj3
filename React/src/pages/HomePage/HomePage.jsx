import { useState, useEffect } from 'react'
import './HomePage.css'
import { Link } from 'react-router'

const unitTypes = [
  'stormtrooper', 'tie_fighter', 'at-st', 'x-wing',
  'resistance_soldier', 'at-at', 'tie_silencer', 'unknown'
]

const homeworlds = [
  'Tatooine', 'Alderaan', 'Naboo', 'Kashyyyk', 'Stewjon', 'Eriadu', 'Corellia',
  'Rodia', 'Bestine IV', 'Dagobah', 'Trandosha', 'Socorro', 'Mon Cala',
  'Chandrila', 'Sullust', 'Toydaria', 'Malastare', 'Dathomir', 'Ryloth',
  'Aleen Minor', 'Vulpter', 'Troiken', 'Tund', 'Haruun Kal', 'Cerea',
  'Glee Anselm', 'Iridonia', 'Tholoth', 'Iktotch', 'Quermia', 'Dorin',
  'Champala', 'Mirial', 'Serenno', 'Concord Dawn', 'Zolan', 'Ojom', 'Skako',
  'Muunilinst', 'Shili', 'Kalee', 'Umbara'
]

function HomePage() {
  const [homeworld, setHomeworld] = useState('')
  const [unitType, setUnitType] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const canvas = document.getElementById('header-canvas')
    const ctx = canvas.getContext('2d')
    const fighter = new Image()
    fighter.src = '/Fighter.png'

    let x = 0
    let frame = 0

    const animate = () => {
      // Resize canvas to always match its styled size
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Bobbing effect
      const y = 10 + Math.sin(frame * 0.1) * 5

      // Draw the fighter
      ctx.drawImage(fighter, x, y, 80, 30)

      // Move to the right
      x += 2
      if (x > canvas.width) x = -60

      frame++
      requestAnimationFrame(animate)
    }

    fighter.onload = animate
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPrediction(null)

    try {
      const response = await fetch('http://localhost:5000/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeworld, unit_type: unitType })
      })

      const data = await response.json()
      if (data.prediction && Array.isArray(data.prediction)) {
        const result = data.prediction[0]
        setPrediction(result ? "Resistance" : "Empire")
      } else {
        setPrediction("Unexpected response format.")
      }
    } catch (error) {
      console.error('Prediction error:', error)
      setPrediction("Error contacting API.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="homepage">
      <Link to="/Chart">
        <img src="/logo.png" alt="Star Wars Logo" className="starwars-logo" />
      </Link>

      <canvas id="header-canvas" className="header-canvas"></canvas>

      <div className="predictor-box">
        <h1 className="predictor-title">Allegiance Predictor</h1>

        <form onSubmit={handleSubmit} className="prediction-form">
          <select
            value={homeworld}
            onChange={(e) => setHomeworld(e.target.value)}
            required
          >
            <option value="">Homeworld</option>
            {homeworlds.map(hw => (
              <option key={hw} value={hw}>{hw}</option>
            ))}
          </select>

          <select
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            required
          >
            <option value="">Unit Type</option>
            {unitTypes.map(ut => (
              <option key={ut} value={ut}>{ut}</option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "..." : "Predict"}
          </button>
        </form>

        {prediction && (
          <div className="prediction-result">
            <h2>Prediction: {prediction}</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage