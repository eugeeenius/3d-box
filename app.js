const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5000
const parser = bodyParser()

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.use(parser)
app.use('/api', require('./routes'))


app.listen(port, () => {
  console.log(`App started at http://localhost:${port}`)
})
