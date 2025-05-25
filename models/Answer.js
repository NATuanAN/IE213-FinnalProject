const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
    {
        question_id: {
            type: String,
            required: true,
        },
        correct_answer: {
            type: Boolean,
            required: true,
            default: false, // use boolean, not string
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Answer", AnswerSchema);