require('dotenv/config')

const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')

// middleware
app.use(express.json())
app.use(morgan('tiny'))

const port = 3000
const api = process.env.API_URL

//Routes
const categoriesRoutes = require('./routers/categories');
const productsRoutes = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'eshop-database'
}).then(() => {
    console.log('Database Connection is ready...')
  })
  .catch(err => console.log(err))

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`)
})
