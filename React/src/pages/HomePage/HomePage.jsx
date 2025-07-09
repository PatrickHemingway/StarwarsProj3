import { useState } from 'react'
import './HomePage.css'

function HomePage() {
  const [homeworld, setHomeworld] = useState('')
  const [unitType, setUnitType] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPrediction(null)

    try {
      const response = await fetch('http://localhost:5000/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          homeworld: homeworld,
          unit_type: unitType
        })
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
      <h1>Star Wars Allegiance Predictor</h1>
      <form onSubmit={handleSubmit} className="prediction-form">
        <label>
          Homeworld:
          <input
            type="text"
            value={homeworld}
            onChange={(e) => setHomeworld(e.target.value)}
            placeholder="e.g. Naboo"
            required
          />
        </label>

        <label>
          Unit Type:
          <input
            type="text"
            value={unitType}
            onChange={(e) => setUnitType(e.target.value)}
            placeholder="e.g. stormtrooper"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {prediction && (
        <div className="prediction-result">
          <h2>Prediction: {prediction}</h2>
        </div>
      )}
    </div>
  )
}

export default HomePage