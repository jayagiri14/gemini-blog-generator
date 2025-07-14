const express = require('express');
const aiRoutes = require('./routes/ai.routes')
const cors = require('cors')

const app = express()

// Configure CORS to allow your frontend domain
const corsOptions = {
  origin: [
    'http://localhost:5173', // For local development
    'https://gemini-blog-generator-frontend.onrender.com', // Your frontend domain
    'https://gemini-blog-generator.onrender.com', // Alternative frontend domain
    'https://gemini-blog-generator-liy3.onrender.com' // Your actual backend domain (for testing)
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions))


app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.use('/ai', aiRoutes)

module.exports = app