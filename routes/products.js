const express = require('express')
const router = express.Router()

const { Product } = require('../models/product')

router.get(`/`, async (req, res) => {
  try {
    const productList = await Product.find()
    res.send(productList)
  } catch (error) {
    res.status(500).json({ error, success: false })
  }
})

router.post(`/`, async (req, res) => {
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

module.exports = router
