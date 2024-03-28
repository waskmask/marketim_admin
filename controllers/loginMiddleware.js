const jwt = require("jsonwebtoken");

// Inside authMiddleware.js
module.exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.loginToken;

  if (!token) {
    console.log("No token found");
    return res.redirect("/");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log("Error verifying token:", err);
      return res.redirect("/");
    }

    req.user = decodedToken;
    next();
  });
};

// const authenticateToken = (req, res, next) => {

// };
// module.exports = {
//   authenticateToken,
// };
