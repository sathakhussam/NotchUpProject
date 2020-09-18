const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const url = "mongodb://localhost/notchup";

// Intializing Express
const app = express();
app.use(express.json());
app.use(cors());
const path = require("path");

// Routers
const FormRouter = require(`${__dirname}/routes/forms.js`);
app.use("/forms", FormRouter);
app.use(express.static(path.join(__dirname, "views")));
app.get("/", function (req, res) {
  res.sendFile(`${__dirname}/views/index.html`);
});
// Database Connection
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const con = mongoose.connection;
con.on("open", () => console.log("Connected"));

app.listen(3000, () => console.log("The server is running on the port 3000"));
