const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const parser = bodyParser()

app.use(parser)
app.use('/api', require('./routes'))


app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`)
})