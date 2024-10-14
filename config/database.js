const mongoose = require("mongoose");

/**
 * to make a connection to MongoDb, if the connection fails the application will be closed
 */
const mongodbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database Connected : ${conn.connection.host}`);
  } catch (err) {
    console.log(`Database Connect Error: ${err}`);
    process.exit(1);
  }
};

module.exports = { mongodbConnection };
