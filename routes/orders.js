const express = require('express')
const router = express.Router()

const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')

router.get(`/`, async (req, res) => {
  try {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 })

    if(!orderList) {
      return res.status(500).json({ success: false, error: 'Unable to find order!' })
    }

    res.send(orderList)
  } catch (error) {
    res.send(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const orderItemIds = await Promise.all(req.body.orderItems.map(async orderItem => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      })

      newOrderItem = await newOrderItem.save()

      return newOrderItem.id
    }))

    let order = new Order({
      orderItems: orderItemIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
      dateOrdered: req.body.dateOrdered,
    })

    order = await order.save()

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order cannot be created!' })
    }

    res.send(order)
  } catch (error) {
    res.send(error)
  }
})

module.exports =router
