require('dotenv/config')

const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

const Product = require('./models/product')

const productRouter = require('./routers/products')

// middleware
app.use(express.json())
app.use(morgan('tiny'))

const port = 3000
const api = process.env.API_URL

// Routers
app.use(`${api}/products`, productRouter)

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'eshop-database'
}).then(() => {
    console.log('Database Connection is ready...')
  })
  .catch(err => console.log(err))

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`)
})
