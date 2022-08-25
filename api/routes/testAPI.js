var express = require("express");
var router = express.Router();
router.use(express.json());

router.get("/test", function (req, res, next) {
  res.send("API is working properly");
});

module.exports = router;
