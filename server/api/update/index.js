const express = require("express");

const profileRoute = require("./profile");
const passwordRoute = require("./password");
const requestRoute = require("./request");

const app = express.Router();

app.use("/profile", profileRoute.app);
app.use("/password", passwordRoute.app);
app.use("/request", requestRoute.app);

module.exports = { app };
