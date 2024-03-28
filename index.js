require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser"); // Make sure to install cookie-parser

const app = express();
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const port = 5000;

app.use(cookieParser());
// ejs
app.set("view engine", "ejs");

// static files
app.use("/public", express.static(path.join(__dirname, "public")));

// routes
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/getRoutes");

app.use(authRoutes);
app.use(dashboardRoutes);

app.use((error, req, res, next) => {
  console.error(error); // Log the error for debugging purposes
  res.status(error.status || 500).json({
    error: {
      message: error.message || "Internal Server Error",
    },
  });
});

app.listen(port, () => {
  console.log(`Serever listening at Port: ${port}`);
});
