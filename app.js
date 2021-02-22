require('dotenv/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

// middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

const port = 3000

const api = process.env.API_URL

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'Hair dresser',
    image: 'some_url'
  }

  const products = [product]

  res.send(products)
})

app.post(`${api}/product`, (req, res) => {
  const newProduct = req.body
  console.log(newProduct)

  res.send(newProduct)
})

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`)
})
