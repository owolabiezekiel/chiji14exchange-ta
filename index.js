const app = require("./server");
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(
    `Chiji14xchange technical assessment app listening at http://localhost:${port}`
  );
});
