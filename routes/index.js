const express = require("express");
const apiRoutes = require("./api/index");
const Errors = require("../utils/errors/Errors.js");

const NotFoundError = (req, res, next) => {
  next(new Errors(`this path ${req.originalUrl} not Found `, 404));
};

const routes = express.Router();

routes.use("/api", apiRoutes);

routes.all("*", NotFoundError);

module.exports = routes;
