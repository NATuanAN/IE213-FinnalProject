const express = require("express");
const router = express.Router();


const QuizController = require("../controllers/quiz.controller");


router.post('/quiz', QuizController.upload.single("quizImage"), QuizController.postCreateNewQuiz);
router.get('/quiz/all', QuizController.getQuizList);
router.delete('/quiz/:id', QuizController.deleteQuiz);
module.exports = router;