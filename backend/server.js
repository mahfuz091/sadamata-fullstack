const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes')

const app = express()
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDB()

app.get('/api', (req, res) => {
  res.json({ msg: 'hello world' })
})

app.use('/api/users', userRoutes)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})