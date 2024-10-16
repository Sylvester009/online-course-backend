const User = require('../models/User');
const Course = require('../models/Courses');

exports.createCourse = async (req, res, next) => {
    try {
        
        const { title, description, lessons } = req.body;
        const newCourse = new Course({
          title,
          description,
          instructorId: req.user._id, // Retrieved from JWT token
          lessons,
        });
        await newCourse.save();
        res.status(201).json({
            "message":"Course Creaed Successfully",
            newCourse});
      } catch (err) {
        res.status(500).json({ message: 'Error creating course', error: err });
      }
    
};

exports.getallCourses = async (req, res, next) => {
    try {
        //apply pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const count = await Course.find({}).estimatedDocumentCount();

        // Fetch all courses and populate instructor information
        const courses = await Course.find()
          .populate('instructorId', 'name email')  // Populate instructor's username and email
          .select('title description instructorId createdAt')
          .skip(skip)
          .limit(limit)  // Limit fields to be returned
    
        res.status(200).json({
            "success": true,
            data: courses,
            page,
            pages: Math.ceil(count / limit),
            count});  // Send the list of courses as JSON
      } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses' });
      }
}

exports.singleCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: course
        })
        next();
    } catch (error) {
        return next(error);
    }
}


//edit course
exports.editCourse = async (req, res, next) => {
        try {
            const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json({
                success: true,
                data: course
            })
            next()
        } catch (error) {
            return next(error);
        }
}

//delete course
exports.deleteCourse = async (req, res, next) => {
        try {
            const course = await Course.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "course deleted successfully"
            })
            next()
        } catch (error) {
            return next(error);
        }
}

