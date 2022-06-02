require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const port = 4000; //process.env.PORT;

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => console.log(error));

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});


/* const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to DB")); */
