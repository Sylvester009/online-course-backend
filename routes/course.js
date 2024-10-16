const express = require('express');
const router = express.Router();
const { isAuthenticated, isInstructor, canUpdate } = require('../middleware/auth');
const { createCourse, getallCourses, singleCourse, editCourse, deleteCourse } = require('../controller/courseController');


//create ca course
router.post("/createcourse",isAuthenticated, isInstructor, createCourse);

//show all courses
router.get("/allcourses", isAuthenticated, getallCourses);

//show single courses
router.get("/course/:id", isAuthenticated,singleCourse)

//edit a course
router.put("/editcourse/:id", isAuthenticated, canUpdate, editCourse);

//delete a course
router.delete("/delete/:id", isAuthenticated, canUpdate, deleteCourse);



module.exports = router;