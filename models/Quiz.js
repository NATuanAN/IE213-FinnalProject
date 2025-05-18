const mongoose = require('mongoose');

const QuizSchema = mongoose.Schema({
    id: Number,
    description: String,
    name: String,
    difficulty: String,
    quizImage: String,
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;