var express = require("express");
var router = express.Router();
const courses = require("../models").Course;
const { authUser } = require("../middleware/authenticate");
const users = require('../models').User

router.use(express.json());

//GET http://localhost:5000/api/courses HTTP/1.1
router.get("/api/courses", async (req, res) => {
  try {
    const allCourses = await courses.findAll({
      include: {
        model: users,
        attributes: {
          exclude: ['id', 'password', 'createdAt', 'updatedAt']
        }
      }
    });
    res.json(allCourses);
  } catch (err) {
    res.json({
      message: "Problem with the server!",
    });
    console.log(err);
  }
});
//// GET http://localhost:5000/api/courses/1 HTTP/1.1
router.get("/api/courses/:id", async (req, res) => {
  try {
    const singleCourse = await courses.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: users,
        attributes: {
          exclude: ['id', 'password', 'createdAt', 'updatedAt']
        }
      }
    });
    if (singleCourse) {
      

      res.status(200).json(singleCourse);


    } else {
      res.status(404);
      res.json({
        message: "Course not found!",
      });
    }
  } catch (err) {
    res.json({
      message: "Sorry, problem with the server!",
    });
    console.log(err);
  }
});

// POST http://localhost:5000/api/courses HTTP/1.1
router.post("/api/courses/", authUser, async (req, res) => {
  try {
   
      const newCourse = await courses.create(req.body);
      res.location("/api/course/" + newCourse.id);
      res.status(201);
      res.end();
    
    
  } catch (err) {
    res.json({
      message: err.errors.map(erry => erry.message)
    });
  }
});

// PUT http://localhost:5000/api/courses/1 HTTP/1.1
router.put("/api/courses/:id", authUser, async (req, res) => {
  try {
    const findCourse = await courses.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (findCourse) {
      const updateCourse = await findCourse.update(req.body);
      res.sendStatus(204);
    } else {
      res.json({
        message: "Sorry, course not found!",
      });
    }
  } catch (err) {
    res.json({
      message: "Error",
    });
    console.log(err);
  }
});

// DELETE http://localhost:5000/api/courses/4 HTTP/1.1

router.delete("/api/courses/:id", authUser, async (req, res) => {
  try {
    const findCourse = await courses.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (findCourse) {
      const deleteCourse = await findCourse.destroy();
      res.sendStatus(204);
    } else {
      res.json({
        message: "The course does not exist",
      });
    }
  } catch (err) {
    res.json({
        message: "Error",
      });
      console.log(err);
  }
});

module.exports = router;
