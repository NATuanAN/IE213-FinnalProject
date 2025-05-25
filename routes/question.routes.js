const express = require("express");
const router = express.Router();
const questionController = require("../controllers/question.controller");
const multer = require('multer')


router.post('/question', questionController.upload.single('questionImage'), questionController.postQuestion);
router.post("/answer", questionController.postAnswer);


module.exports = router;