const express = require("express");
const router = express.Router();


const QuizController = require("../controllers/quiz.controller");
const quizController = require("../controllers/quiz.controller");
const Quiz = require("../models/Quiz");
const authController = require("../controllers/auth.controller");



router.post('/quiz', QuizController.upload.single("quizImage"), QuizController.postCreateNewQuiz);
router.get('/quiz/all', QuizController.getQuizList);
router.put('/quiz', QuizController.upload.single("quizImage"), quizController.pustQuizbyAdmin);
router.delete('/quiz/:id', QuizController.deleteQuiz);
router.get('/quiz-by-participant', QuizController.getQuizList);
// router.get('/questions-by-quiz', QuizController.getQuestionbyQuizz);

module.exports = router;