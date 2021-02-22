require('dotenv/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

// middleware
app.use(bodyParser.json())
app.use(morgan('tiny'))

const port = 3000

const api = process.env.API_URL

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true
  }
})

const Product = mongoose.model('Product', productSchema)

app.get(`${api}/products`, async (req, res) => {
  try {
    const productList = await Product.find()
    res.send(productList)
  } catch (error) {
    res.status(500).json({ error, success: false })
  }
})

app.post(`${api}/product`, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      countInStock: req.body.countInStock
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(500).json({ error, success: false })
  }
})

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
