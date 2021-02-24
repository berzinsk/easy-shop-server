const { User } = require('../models/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/', async (req, res) =>{
  const userList = await User.find().select('-passwordHash')

  if(!userList) {
    res.status(500).json({success: false})
  }

  res.send(userList)
})

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash')

    if (user) {
      res.status(200).send(user)
    } else {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.post('/', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  })

  try {
    user = await user.save()

    if (user) {
      res.send(user)
    } else {
      res.status(400).json({ success: false, error: 'The user cannot be created!' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    const secret = process.env.SECRET

    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found!' })
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        {
          expiresIn: '1d'
        }
      )

      res.status(200).json({ user: user.email, token })
    } else {
      res.status(400).json({ success: false, error: 'Wrong password!' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.post('/register', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: false,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  })

  try {
    user = await user.save()

    if (user) {
      res.send(user)
    } else {
      res.status(400).json({ success: false, error: 'The user cannot be registered!' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments(count => count)

    if (userCount) {
      res.send({ userCount })
    } else {
      res.status(404).json({ success: false, message: 'No users found' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)

    if (user) {
      res.status(200).json({ success: true, message: 'The user was deleted.' })
    } else {
      res.status(404).json({ success: false, message: 'User not found' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

module.exports =router
