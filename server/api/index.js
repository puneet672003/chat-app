const express = require("express");

const authRoute = require("./auth");
const fetchRoute = require("./fetch");
const posetRoute = require("./post");
const updateRoute = require("./update");

const app = express.Router();

app.use("/auth", authRoute.app);
app.use("/fetch", fetchRoute.app);
app.use("/post", posetRoute.app);
app.use("/update", updateRoute.app);

const authenticate = authRoute.authenticate;

module.exports = { app, authenticate };
