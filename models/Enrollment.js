const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }], // Array of completed lesson IDs
  progress: { type: Number, default: 0 }, 
  completed: { type: Boolean, default: false }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
module.exports = Enrollment;