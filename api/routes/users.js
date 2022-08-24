var express = require("express");
var router = express.Router();
const users = require("../models").User;
const { authUser } = require("../middleware/authenticate");

router.use(express.json());

//GET http://localhost:5000/api/users HTTP/1.1
router.get("/api/users", authUser, async (req, res) => {
  try {
    const user = req.currentUser;

    res.json(user);
  } catch (err) {
    res.json({
      message: "Problem with the server!",
    });
  }
});

//POST http://localhost:5000/api/users HTTP/1.1
router.post("/api/users", async (req, res) => {
  try {
    const newUser = await users.create(req.body);
    res.location("/");
    res.sendStatus(201);
  } catch (err) {
    res.status(400);
    res.json({
      message: err.errors.map((erry) => erry.message),
    });
  }
});

module.exports = router;
