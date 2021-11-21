const cors = require('cors')

const corsMiddleware = cors({
  // origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  origin: "https://moliver-api.herokuapp.com",
  allowedHeaders: ['Content-Type'],
  credentials: true
})

module.exports = corsMiddleware
