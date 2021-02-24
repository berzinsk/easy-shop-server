function errorHandler(err, req, res, next) {
  if (err) {
    res.status(err.status).json(err)
  }
}

module.exports = errorHandler
