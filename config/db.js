const mongoose = require("mongoose");
const connectDB = async () => {
  const dbconn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `MongoDB Connected: ${dbconn.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;