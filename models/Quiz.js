const mongoose = require('mongoose');



const QuizSchema = mongoose.Schema({
    description: String,
    name: String,
    difficulty: String,
    quizImage: String,
}, { timestamps: true });

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;