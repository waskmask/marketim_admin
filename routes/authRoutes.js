const router = require("express").Router();

router.get("/", (req, res) => {
  const loginToken = req.cookies["loginToken"];
  if (loginToken) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

module.exports = router;
