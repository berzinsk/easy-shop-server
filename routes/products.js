const express = require('express')
const router = express.Router()

const { Product } = require('../models/product')
const { Category } = require('../models/category')

router.get('/', async (req, res) => {
  try {
    const productList = await Product.find().populate('category')
    res.send(productList)
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.get(`/:id`, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')

    if (product) {
      res.send(product)
    } else {
      res.status(404).json({ success: false, message: 'Product not found!' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.post(`/`, async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)

    if (!category) {
      return res.status(400).json({ success: false, error: 'Category not found!' })
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)

    if (!category) {
      return res.status(400).json({ success: false, error: 'Category not found!' })
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    }, { new: true })

    if (product) {
      res.status(200).send(product)
    } else {
      res.status(404).json({ success: false, message: 'Product can\'t be updated.' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

module.exports = router
