const express = require('express');
const router = express.Router();

const { isAuthenticated, isAdmin } = require('../middleware/auth');
const { newEnroll, getEnroll, completeLesson } = require('../controller/enrollController');


//create new /api/newenroll
router.post("/newenroll" ,isAuthenticated, newEnroll);

//get enrolled
router.get("/getenroll", isAuthenticated, getEnroll);

//update course as complete
router.put("/course/:enrollmentId/complete", isAuthenticated, completeLesson);


module.exports = router;