const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async() => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log("database connection established");
  } catch (error) {
    console.log(error);
  }
}
module.exports = connectDB;
