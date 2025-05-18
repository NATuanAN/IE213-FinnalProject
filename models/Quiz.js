const mongoose = require('mongoose');



// const data = new FormData();
// data.append("description", description);
// data.append("name", name);
// data.append("difficulty", difficulty);
// data.append("quizImage", image);
// return await axios.post("/api/v1/quiz", data);

const QuizSchema = mongoose.Schema({
    description: String,
    name: String,
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
    },
    quizImage: String,
}, { timestamps: true });
const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;