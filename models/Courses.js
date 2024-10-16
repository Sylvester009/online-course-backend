const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Quiz schema (nested within lessons)
const quizSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },  // Array of options
  correctAnswer: { type: String, required: true }  // The correct answer
});

// Define the Lesson schema (nested within courses)
const lessonSchema = new Schema({
  title: { type: String, required: true },  // Lesson title
  content: {
    type: { type: String, enum: ['video', 'text'], required: true },  // Content type: video or text
    url: { type: String, required: function() { return this.type === 'video'; } },  // URL for video content
    text: { type: String, required: function() { return this.type === 'text'; } }  // Text content for text type lessons
  },
  quiz: [quizSchema]  // Optional quiz for the lesson
});

// Define the Course schema
const courseSchema = new Schema({
  title: { type: String, required: true },  // Course title
  description: { type: String, required: true },  // Course description
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appuser', required: true },  // Reference to the Instructor (User)
  lessons: [lessonSchema],  // Array of lessons
  createdAt: { type: Date, default: Date.now },  // Automatically set creation date
});

// Create the Course model from the schema
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
