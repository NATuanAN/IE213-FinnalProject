const express = require("express");
const router = express.Router();

const Quiz = require("../controllers/quiz.controller");

router.post('/quiz', Quiz.postCreateNewQuiz);