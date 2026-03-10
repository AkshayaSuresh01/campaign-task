const express = require("express");

const app = express();

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello world");
});

// sending json;
app.get("/users/:userId/books/:bookId/", (req, res) => {
  res.send(`User ID: ${req.params.userId}, Book ID: ${req.params.bookId}`);
});

app.listen(port, () => {
  console.log(`Server listening on the port ${port}`);
});
