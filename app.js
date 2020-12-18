const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 80
const parser = bodyParser()


app.use('/', express.static(path.join(__dirname, 'client', 'build')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})


app.use(parser)
app.use('/api', require('./routes'))


app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`)
})
