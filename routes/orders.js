const {Order} = require('../models/order')
const express = require('express')
const router = express.Router()

router.get(`/`, async (req, res) => {
  try {
    const orderList = await Order.find()

    if(!orderList) {
      return res.status(500).json({ success: false, error: 'Unable to find order!' })
    }

    res.send(orderList)
  } catch (error) {
    res.send(error)
  }
})

module.exports =router
