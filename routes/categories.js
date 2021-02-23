const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) =>{
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false })
  }

  res.status(200).send(categoryList);
})

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (category) {
      res.status(200).send(category)
    } else {
      res.status(404).json({ success: false, message: 'Category not found' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.post('/', async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  })

  try {
    category = await category.save()
    res.send(category)
  } catch {
    res.status(404).send('the category cannot be created!')
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id)

    if (category) {
      res.status(200).json({ success: true, message: 'The category is deleted.' })
    } else {
      res.status(404).json({ success: false, message: 'Category not found' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

module.exports = router;
