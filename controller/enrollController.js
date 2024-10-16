const Enrollment = require('../models/Enrollment'); 
const Course = require('../models/Courses'); 



exports.newEnroll = async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const studentId = req.user.id;
    
        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }
    
        // Check if the student is already enrolled in the course
        const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
        if (existingEnrollment) {
          return res.status(400).json({ message: 'You are already enrolled in this course' });
        }
    
        // Create a new enrollment document
        const newEnrollment = new Enrollment({
          studentId,
          courseId,
          completedLessons: [],  // Initialize with no completed lessons
          progress: 0,           // Progress starts at 0%
          completed: false
        });
    
        // Save the new enrollment to the database
        await newEnrollment.save();
    
        res.status(201).json({
          message: 'Successfully enrolled in the course',
          data: newEnrollment
        });
      } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ message: 'Error enrolling in course' });
      }
};


exports.getEnroll = async (req, res, next) => {
    try {
        const studentId = req.user._id; 
    
        // Find all enrollments for the logged-in student
        const enrollments = await Enrollment.find({ studentId })
          .populate('courseId', 'title lessons') 
          .lean(); // Use .lean() to get plain JavaScript objects
    
        const enrichedEnrollments = await Promise.all(
          enrollments.map(async (enrollment) => {
            const course = enrollment.courseId;
    
            // Total number of lessons in the course
            const totalLessons = course.lessons.length;
    
            // Number of lessons the student has completed
            const completedLessonsCount = enrollment.completedLessons.length;
    
            // Compute the progress as a percentage
            const progress = (completedLessonsCount / totalLessons) * 100;
    
            // Mark as completed if all lessons are done
            const completed = completedLessonsCount === totalLessons;

            return {
              _id: enrollment._id,
              courseId: course._id,
              courseTitle: course.title,
              progress: Math.round(progress), 
              completed,
            };
          })
        );
    
        res.status(200).json(enrichedEnrollments);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ message: 'Error fetching enrollments' });
      }
};


exports.completeLesson = async (req, res, next) => {
    try {
        const { lessonId } = req.body; 
        const { enrollmentId } = req.params;
        const studentId = req.user._id; 
    
        const enrollment = await Enrollment.findOne({ _id: enrollmentId, studentId });
    
        if (!enrollment) {
          return res.status(404).json({ message: 'Enrollment not found' });
        }
    
        // Find the course and verify if the lesson is part of the course
        const course = await Course.findById(enrollment.courseId);
    
        if (!course) {
          return res.status(404).json({ message: 'Course not found' });
        }
    
        // Check if the lesson exists in the course
        const lessonExists = course.lessons.some((lesson) => lesson._id.toString() === lessonId);
    
        if (!lessonExists) {
          return res.status(400).json({ message: 'Invalid lesson for this course' });
        }
    
        // Check if the lesson has already been marked as completed
        const alreadyCompleted = enrollment.completedLessons.includes(lessonId);
    
        if (alreadyCompleted) {
          return res.status(400).json({ message: 'Lesson already completed' });
        }
    
        // Add the completed lesson to the list of completed lessons
        enrollment.completedLessons.push(lessonId);
    
        // Recalculate the progress
        const totalLessons = course.lessons.length;
        const completedLessonsCount = enrollment.completedLessons.length;
        const progress = (completedLessonsCount / totalLessons) * 100;
    
        // Update the enrollment progress and completion status
        enrollment.progress = Math.round(progress); // Round to nearest integer
        enrollment.completed = completedLessonsCount === totalLessons; // Mark as completed if all lessons are done
    
        // Save the updated enrollment
        await enrollment.save();
    
        res.status(200).json({
          message: 'Progress updated successfully',
          enrollment: {
            courseId: enrollment.courseId,
            progress: enrollment.progress,
            completed: enrollment.completed,
            completedLessons: enrollment.completedLessons
          }
        });
      } catch (error) {
        console.error('Error updating progress:', error);
        res.status(500).json({ message: 'Error updating progress' });
      }
}
