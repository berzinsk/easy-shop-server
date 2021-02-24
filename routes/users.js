const { User } = require('../models/user')
const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

router.get('/', async (req, res) =>{
  const userList = await User.find()

  if(!userList) {
    res.status(500).json({success: false})
  }

  res.send(userList)
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

module.exports =router;
