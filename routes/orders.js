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

    const totalPrices = await Promise.all(orderItemIds.map(async orderItemId => {
      const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
      const totalPrice = orderItem.product.price * orderItem.quantity

      return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a,b) => a + b, 0)

    let order = new Order({
      orderItems: orderItemIds,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
      dateOrdered: req.body.dateOrdered,
    })

    order = await order.save()

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order cannot be created!' })
    }

    res.send(order)
  } catch (error) {
    res.status(500).json({ success: false, error })
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

router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id)

    if (order) {
      await Promise.all(order.orderItems.map(async orderItem => {
        await OrderItem.findByIdAndRemove(orderItem)
      }))

      res.status(200).json({ success: true, message: 'The order is deleted.' })
    } else {
      res.status(404).json({ success: false, message: 'Order not found' })
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/get/totalsales', async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: '$totalPrice' }}}
    ])

    if (!totalSales) {
      return res.status(400).json({ success: false, message: 'The order sales cannot be generated' })
    }

    res.send({ totalSales: totalSales.pop().totalsales })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/get/count', async (req, res) => {
  try {
    const orderCount = await Order.countDocuments(count => count)

    if (orderCount) {
      res.send({ orderCount })
    } else {
      res.status(404).json({ success: false, message: 'Orders not found!' })
    }
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
})

router.get('/get/userorders/:userId', async (req, res) => {
  try {
    const userOrderList = await Order.find({ user: req.params.userId })
      .populate({
        path: 'orderItems', populate: {
          path: 'product', populate: 'category',
        },
      })
      .sort({ 'dateOrdered': -1 })

    if(!userOrderList) {
      return res.status(500).json({ success: false, error: 'Unable to find orders!' })
    }

    res.send(userOrderList)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports =router
