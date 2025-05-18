const express = require("express");
const router = express.Router();


const Quiz = require("../controllers/quiz.controller");


router.post('/quiz', Quiz.upload.single("quizImage"), Quiz.postCreateNewQuiz);
router.get("/quiz/all", Quiz.getQuizList);

module.exports = router;