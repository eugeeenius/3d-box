const { Router } = require('express')
const router = Router()

router.post('/build', async (req, res) => {
  try {
    // Data from frontend
    const { width, height, length } = await req.body
    // Compute and send values to frontend
    const geometry = await computeGeometry(width, height, length)
    res.send(geometry)
  } catch (e) {

  }
})

function computeGeometry(width, height, length) {
  // Making recieved values appropriate for our camera:

  // 1. Finding the biggest value
  const values = [width, height, length]
  values.forEach(el => parseInt(el))
  const biggestValue = Math.max(...values)
  // 2. Divide all values by biggestValue
  const appropriateValues = values.map(el => el / biggestValue)


  // Computing geometry:
  const w = appropriateValues[0]
  const h = appropriateValues[1]
  const l = appropriateValues[2]

  // Creating vectors out of values
  const vectors = [
    [-w, -h, l], // 0
    [w, -h, l], // 1
    [-w, h, l], // 2
    [w, h, l], // 3
    [-w, -h, -l], // 4
    [w, -h, -l], // 5
    [-w, h, -l], // 6
    [w, h, -l], // 7
  ]
  
  // Each triangle is a set of vectors
  const triangles = [
    // front
    [0, 3, 2],
    [0, 1, 3],
    // right
    [1, 7, 3],
    [1, 5, 7],
    // back
    [5, 6, 7],
    [5, 4, 6],
    // left
    [4, 2, 6],
    [4, 0, 2],
    // top
    [2, 7, 6],
    [2, 3, 7],
    // bottom
    [4, 1, 0],
    [4, 5, 1],
  ]

  return { vectors, triangles }
}

module.exports = router
