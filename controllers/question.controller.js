const Question = require('../models/Question');
const Answer = require('../models/Answer');
const _ = require("lodash");

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isContext } = require('vm');

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
            const { question_id, description, correct_answer } = req.body;

            if (!question_id || !description || correct_answer === undefined || correct_answer === null) {
                console.log("Missing fields in postAnswer");
                return res.status(400).json({
                    message: "Missing required fields for answer",
                    EC: -1,
                    DT: null,
                });
            }


            const answer = await Answer.create({ question_id, description, correct_answer });
            console.log("Add answer successfully");
            return res.status(200).json({
                message: "Answer created successfully",
                EC: 0,
                DT: answer
            });

        } catch (error) {
            console.log("Error in postAnswer", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    getQuesbyQuizz: async (req, res) => {
        try {
            const { quizId } = req.query;
            if (!quizId) {
                console.log("Missing fields in getQuesbyQuizz");
                return res.status(400).json({
                    message: "Missing required fields for question",
                    EC: -1,
                    DT: null,
                });
            }

            const questions = await Question.find({ quiz_id: quizId });

            // Dùng Promise.all để xử lý song song các câu hỏi
            const questionWithAnswers = await Promise.all(
                questions.map(async (q) => {
                    const answers = await Answer.find({ question_id: q._id });
                    return {
                        ...q.toObject(),
                        answers
                    };
                })
            );

            console.log("Questions fetched successfully");
            return res.status(200).json({
                message: "Questions fetched successfully",
                EC: 0,
                DT: questionWithAnswers
            });

        } catch (e) {
            console.log("Error in getQuesbyQuizz", e);
            res.status(500).json({
                message: 'Internal server error',
                EC: -1,
                DT: null
            });
        }
    },

    postSubmitQuiz: async (req, res) => {
        try {
            const { quizId, answers } = req.body;

            if (!quizId || !answers) {
                console.log("quizId and answers is required to submit quiz");
                return res.status(400).json({
                    EM: "Missing required fields",
                    EC: -1,
                    DT: null,
                });
            }

            let countCorrect = 0;
            let countTotal = answers.length;
            let quizData = [];

            for (const ans of answers) {
                const questionId = ans.questionId;
                const userAnswersId = ans.userAnswerId;

                const correctAnswers = await Answer.find({
                    question_id: questionId,
                    correct_answer: true,
                });

                const userAnswer = await Answer.find({ _id: userAnswersId });

                const correctAnswerIds = correctAnswers.map((a) => a._id.toString());

                const isCorrect = _.isEqual(
                    _.sortBy(correctAnswerIds),
                    _.sortBy(userAnswersId.map((_id) => _id.toString()))
                );

                if (isCorrect) countCorrect++;

                const correctAnswersDes = correctAnswers.map((a) => a.description);
                const userAnswersDes = userAnswer.map((a) => a.description)
                quizData.push({
                    questionId,
                    userAnswersId: userAnswersDes,
                    correctAnswers: correctAnswersDes,
                    isCorrect,
                });
            }

            return res.status(200).json({
                EM: "Submit quiz successfully",
                EC: 0,
                DT: {
                    countCorrect,
                    countTotal,
                    quizData,
                },
            });
        } catch (error) {
            console.log("Error submitting quiz:", error);
            return res.status(500).json({
                EM: "Internal server error",
                EC: -1,
                DT: null,
            });
        }
    },
    postSubmitQuiz2: async (req, res) => {
        // countCorrect: res.DT.countCorrect,
        //     countTotal: res.DT.countTotal,
        //         quizData: res.DT.quizData,
        try {
            const { quizId, answers } = req.body;
            if (!quizId || !answers) {
                console.log("quizId and questions is required to submit quiz");
                return res.status(400).json({
                    EM: -1,
                    DT: null
                });
            }

            let countCorrect = 0;
            let countTotal = answers.length;
            let quizData = [];

            for (ans of answers) {

                const realAnswer = await Answer.find({ quetion_id: ans.questionId, correct_answer: true });
                const isCorrect = _.isEqual(
                    _.sortBy(realAnswer.map((a) => a._id.toString())),
                    _.sortBy(ans.userAnswerId.map((a) => a.toString()))
                )
                if (isCorrect) countCorrect++;

            }



        } catch (error) {
            console.log("Error is cant post submit");
            return res.status(500).json({ EM: -1, DT: null });
        }
    }

};
