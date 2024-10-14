require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const { rateLimit } = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const { xss } = require("express-xss-sanitizer");
const hpp = require("hpp");
const routes = require("./routes/index");
const errorHandle = require("./middlewares/ErrorMiddlewares");

const app = express();

// cors settings
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Mount App Settings
app.use(
  express.json({
    limit: "100kb",
  })
);

//HPP puts array parameters in req.query and/or req.body aside
//and just selects the last parameter value. You add the middleware and you are done.

app.use(hpp({ whitelist: ["price", "sold"] }));

// Mongoose Sanitize
app.use(
  mongoSanitize({
    // allowDots: true,
    // replaceWith: "_",
  })
);

// sanitizes user input data (in req.body, req.query, req.headers and req.params)
// to prevent Cross Site Scripting (XSS) attack.
app.use(xss());

//static files
app.use(express.static(path.join(__dirname, "storage", "upload")));

if (process.env.APP_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
app.use(routes);

// requests limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

// Global error handling middleware inside express
app.use(errorHandle.errorHandle());

module.exports = app;
