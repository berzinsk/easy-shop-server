const express = require('express')
const router = express.Router()
const multer = require('multer')

const { Product } = require('../models/product')
const { Category } = require('../models/category')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype]
    let uploadError = new Error('invalid image type')

    if (isValid) {
      uploadError = null
    }

    cb(uploadError, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(' ').join('-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
})

const uploadOptions = multer({ storage: storage })

router.get('/', async (req, res) => {
  try {
    let filter = {}
    if (req.query.categories) {
      filter = { category: req.query.categories.split(',') }
    }

    const productList = await Product.find(filter).populate('category')
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

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)

    if (!category) {
      return res.status(400).json({ success: false, error: 'Category not found!' })
    }

    const file = req.file
    if (!file) {
      return res.status(400).json({ success: false, error: 'No image in the request!' })
    }

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`,
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

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id)

    if (product) {
      res.status(200).json({ success: true, message: 'The product is deleted.' })
    } else {
      res.status(404).json({ success: false, message: 'Product not found' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.get('/get/count', async (req, res) => {
  try {
    const productCount = await Product.countDocuments(count => count)

    if (productCount) {
      res.send({ productCount })
    } else {
      res.status(404).json({ success: false, message: 'Product not found!' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.get('/get/featured/:count', async (req, res) => {
  try {
    const count = req.params.count ? parseInt(req.params.count) : 0
    const productList = await Product.find({ isFeatured: true }).limit(count).populate('category')

    res.send(productList)
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
  try {
    const files = req.files
    let imagesPathArray = []
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

    if (files) {
      files.map(file => {
        imagesPathArray.push(`${basePath}${file.filename}`)
      })
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {
      images: imagesPathArray
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
