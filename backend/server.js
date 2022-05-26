require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT;

mongoose.connect(process.env.DB, () => {
  console.log("Connected to DB");
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});

/* const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to DB")); */
