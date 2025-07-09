import { useState } from 'react'
import './HomePage.css'

function HomePage() {
  const [homeworld, setHomeworld] = useState('')
  const [unitType, setUnitType] = useState('')
  const [prediction, setPrediction] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:5000/predict', {
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
      setPrediction(data.prediction)
    } catch (error) {
      console.error('Error predicting:', error)
      setPrediction('Error contacting API')
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
            placeholder="e.g. Tatooine"
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

        <button type="submit">Predict</button>
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
