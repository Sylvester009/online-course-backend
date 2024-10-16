const User = require('../models/User');
const Course = require('../models/Courses');
const jwt = require('jsonwebtoken');

//check if user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    //make sure token exist
    if (!token) {
        res.status(401).json({
            "error": "Kindly login to access this endpoint"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log("Decoded token:", decoded);
        req.user = await User.findById(decoded.id);
        if (!req.user){
            res.status(404).json({
                "error": "No user found"
            });
        }
        next()
    } catch (error) {
        return res.status(500).json({
            error: error
        });
    }
};

//middleware to check admin
exports.isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        res.status(401).json({
            "error": "Only Admins can access"
        });
        //return next(new ErrorResponse("Only Admins can access", 401))
    }
    next();
};

// Middleware to check if the authenticated user is an instructor
exports.isInstructor = async (req, res, next) => {
    try {  
    //   if (!user) {
    //     return res.status(404).json({ message: 'User not found' });
    //   }
  
      // Check if the user has the role of 'Instructor'
      if (req.user.role !== 'tutor') {
        return res.status(403).json({ message: 'Access denied. Instructor role required.' });
      } 
      // If the user is an instructor, continue to the next middleware or route handler
      next();
    } catch (err) {
      console.error('Error in isInstructor middleware:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  };


  // Middleware to check if the user can update or delete the course
exports.canUpdate = async (req, res, next) => {
    try {
      const courseId = req.params.id; // Get course ID from URL params
      const userId = req.user.id; // Authenticated user's ID from JWT (assumed to be decoded already)
      const userRole = req.user.role; // User's role (e.g., 'Instructor', 'Admin')
  
      // Find the course by its ID
      const course = await Course.findById(courseId);
      //console.log(course)
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Check if the current user is either the creator of the course (instructorId) or an admin
      if (course.instructorId.toString() === userId.toString() || userRole === 'admin') {
        // User is authorized, proceed to the next middleware or route handler
        next();
      } else {
        // User is not authorized to update/delete this course
        return res.status(403).json({ message: 'You are not authorized to update or delete this course.' });
      }
    } catch (error) {
      console.error('Error in canUpdate middleware:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };