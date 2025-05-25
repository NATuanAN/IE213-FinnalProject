const Question = require('../models/Question');
const Answer = require('../models/Answer');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadsQuestion/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

module.exports = {
    upload,

    postQuestion: async (req, res) => {
        try {
            const { quiz_id, description } = req.body;
            const questionImage = req.file?.filename || null;

            if (!quiz_id || !description) {
                console.log("Missing fields in postQuestion");
                return res.status(400).json({
                    message: "Please provide all required fields",
                    EC: -1,
                    DT: null,
                });
            }

            const question = await Question.create({ quiz_id, description, questionImage });
            const question_id = question._id;
            question.question_id = question_id;
            question.save();
            console.log("Add question successfully");

            return res.status(200).json({
                message: `Question ${question.quiz_id} created successfully`,
                EC: 0,
                DT: question,
            });

        } catch (error) {
            console.log(`Error in question`, error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    postAnswer: async (req, res) => {
        try {
            const { description, correct_answer, question_id } = req.body;

            if (!description || typeof correct_answer === "undefined" || !question_id) {
                console.log("Missing fields in postAnswer");
                return res.status(400).json({
                    message: "Missing required fields for answer",
                    EC: -1,
                    DT: null,
                });
            }

            const answer = await Answer.create({ description, correct_answer, question_id });
            console.log("Add answer successfully");
            return res.status(200).json({
                message: "Answer created successfully",
                EC: 0,
                DT: answer
            });

        } catch (e) {
            console.log("Error in postAnswer", e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
