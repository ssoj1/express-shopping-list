/** Shopping List app */

const express = require("express");
const app = express();
const shoppingListRoutes = require("./shoppingListRoutes");

const { NotFoundError } = require("./expressError");

// for processing JSON data
app.use(express.json());

// for processing traditional form data 
app.use(express.urlencoded({ extend : true }));

// apply a prefix to every route in shoppingListRoutes
app.use("/items", shoppingListRoutes);




/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});


// error handler - runs when an error is thrown
app.use(function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message;
  if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
  return res.status(status).json({ error: { message, status } });
});


module.exports = app;