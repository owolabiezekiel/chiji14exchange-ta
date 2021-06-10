const app = require("./app");
const colors = require("colors");
const port = process.env.PORT || 3000;

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
