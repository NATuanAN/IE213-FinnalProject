const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question_id: String,
    answer: String,
    correctAnswer: String,
    description: String,
    quiz_id: String,
    questionImage: String,
}, { timestamps: true });


module.exports = mongoose.model("Question", QuestionSchema);
