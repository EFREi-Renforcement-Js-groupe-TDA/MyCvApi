const express = require("express");
const AuthenticationRouter = require("./AuthenticationRouter");
const UserRouter = require("./UserRouter");
const CvRouter = require("./cvRouter");

const app = express();

app.use("/auth", AuthenticationRouter);
app.use("/user", UserRouter);
app.use("/cv", CvRouter);

module.exports = app;
