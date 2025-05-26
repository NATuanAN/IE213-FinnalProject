const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");



router.post('/question', questionController.upload.single('questionImage'), questionController.postQuestion);
router.post("/answer", questionController.postAnswer);
router.get('/questions-by-quiz/', questionController.getQuesbyQuizz);
router.post("/quiz-submit", questionController.postSubmitQuiz);
module.exports = router;