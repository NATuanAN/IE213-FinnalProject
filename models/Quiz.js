const mongoose = require('mongoose');

const QuizSchema = mongoose.Schema(
    {
        id: String,
        description: String,
        name: String,
        difficulty: {
            type: String,
            enum: ["EASY", "MEDIUM", "HARD"],
            default: "EASY",
        },
        quizImage: String,
    },
    { timestamps: true }
);

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;