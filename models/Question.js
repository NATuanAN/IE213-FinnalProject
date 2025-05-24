const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    quiz_id: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quiz_id: {
        type: String,
        required: true,
    },
    questionImage: {
        type: String,
        required: true,
    },
});


module.exports = mongoose.model("Question", QuestionSchema);
