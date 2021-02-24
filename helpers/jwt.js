const expressJwt = require('express-jwt')

function authJwt() {
  const secret = process.env.SECRET
  const api = process.env.API_URL

  return expressJwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      {
        url: `${api}/users/login`,
      },
      {
        url: `${api}/users/register`,
      },
      {
        url: /\/api\/v1\/products(.*)/,
        methods: ['GET', 'OPTIONS']
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ['GET', 'OPTIONS']
      },
    ],
  })
}

module.exports = authJwt
