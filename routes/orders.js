const express = require('express')
const router = express.Router()

const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')

router.get('/', async (req, res) => {
  try {
    const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 })

    if(!orderList) {
      return res.status(500).json({ success: false, error: 'Unable to find orders!' })
    }

    res.send(orderList)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name')
      .populate({
          path: 'orderItems', populate: {
            path: 'product', populate: 'category',
          },
        })

    if(!order) {
      return res.status(500).json({ success: false, error: 'Unable to find order!' })
    }

    res.send(order)
  } catch (error) {
    res.status(500).send(error)
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
    res.status(500).send(error)
  }
})

router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    }, { new: true })

    if (order) {
      res.status(200).send(order)
    } else {
      res.status(404).json({ success: false, message: 'Order can\'t be updated.' })
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports =router
