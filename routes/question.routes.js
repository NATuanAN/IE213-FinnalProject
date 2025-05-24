const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");


router.post("/question", questionController.postQuestion);
router.post("/answer", questionController.postQuestion);


module.exports = router;