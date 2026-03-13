const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern Mongoose versions (6+) don't require the deprecated options,
      // but ensure your URI is correct in your .env file.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Optional: Log to confirm indexing is initialized
    mongoose.connection.on('index', (err) => {
      if (err) console.error('❌ Indexing error: ', err);
    });

  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;