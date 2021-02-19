require('dotenv/config')

const express = require('express')
const app = express()

const port = 3000

const api = process.env.API_URL

app.get(`${api}/products`, (req, res) => {
  res.send('hello API')
})

app.listen(port, () => {
  console.log(api)
  console.log(`Server is running http://localhost:${port}`)
})
