const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const connectiondb = await mongoose.connect(process.env.MONGO_URI,{
      dbName: "sadamataDB",
      serverSelectionTimeoutMS: 5000, 
    })
    console.log(`MongoDB Connected: ${connectiondb.connection.host}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

module.exports = connectDB