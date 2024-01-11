const express = require("express");
const bodyParser = require('body-parser');
const dbConnect = require("./db/dbConnect");

const corsHandler = require("./handlers/corsHandler");

const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(corsHandler);

app.use("/api/", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes); // authentication endpoints

module.exports = app;
