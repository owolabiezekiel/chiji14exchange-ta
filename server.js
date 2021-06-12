const app = require("./app");
const colors = require("colors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

app.listen(port, () => {
  console.log(
    `Chiji14xchange technical assessment app listening at http://localhost:${port}`
      .yellow.bold
  );
});

//Handle unhandles promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
