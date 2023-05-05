// Import Statements...
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./helper/jwt.js");
const errorHandler = require("./helper/errorHandler.js");

// Environment Variables
require("dotenv/config");
const api = process.env.API_URL;

// CORS Setup
app.use(cors());
app.options("*", cors());

// Middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

/// Routers...--------------------------------------------------

// Routers Files Import...
const usersRouter = require("./routers/users.js");

const restaurantsRouter = require("./routers/restaurants.js");
const foodMenusRouter = require("./routers/foodMenus.js");
const tableBookingsRouter = require("./routers/tableBookings.js");

const tiffinServicesRouter = require("./routers/tiffinServices.js");
const tiffinMenusRouter = require("./routers/tiffinMenus.js");

const restaurantOrdersRouter = require("./routers/restaurantOrders.js");
const tiffinOrdersRouter = require("./routers/tiffinOrders.js");

// Routes Set
app.use(`${api}/restaurants`, restaurantsRouter);
app.use(`${api}/foodMenus`, foodMenusRouter);
app.use(`${api}/tableBookings`, tableBookingsRouter);
app.use(`${api}/tiffinServices`, tiffinServicesRouter);
app.use(`${api}/tiffinMenus`, tiffinMenusRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/restaurantOrders`, restaurantOrdersRouter);
app.use(`${api}/tiffinOrders`, tiffinOrdersRouter);
///-------------------------------------------------------------

// Database connection
mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "foodbite-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

// {Development} :- Server Starts...
// app.listen(3000, () => {
//   console.log("server is running http://localhost:3000");
// });

// {Production} :- Server Starts...
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port" + port);
});
