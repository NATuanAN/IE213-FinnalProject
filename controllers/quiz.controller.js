const Quiz = require("../models/Quiz");

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadsQuizz/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

module.exports =
{
    postCreateNewQuiz: async (req, res) => {
        try {
            const { description, name, difficulty } = req.body;
            const quizImage = req.file?.filename || null;

            const quiz = new Quiz({
                description,
                name,
                difficulty,
                quizImage
            });
            quiz.id = quiz._id.toString();
            await quiz.save();

            console.log("New quiz has been added");
            res.status(201).json({ message: "New quiz has add", EC: 0 });
        }
        catch (e) {
            console.log("New quiz has not been added");
            res.status(500).json({ message: `New quiz has not add, err: ${e}` });
        }

    },
    upload,

    getQuizList: async (req, res) => {
        try {
            const quiz = await Quiz.find();
            console.log("Tablequizz has been added");
            res.status(200).json({ message: "Get tablequizz", EC: 0, DT: quiz });
        } catch (e) {
            console.error("Error while getting quiz list:", e);
            res.status(500).json({ message: `Error while getting quiz list`, error: e.message });
        }
    },
    deleteQuiz: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                console.log("There is not id");
                return res
                    .status(400)
                    .json({ message: "There is not id", EC: -1, EM: "There is not id", });
            }
            const quiz = await Quiz.findByIdAndDelete(id);
            console.log("Delete quiz has been added");
            res
                .status(200)
                .json({
                    message: "Delete quiz has add",
                    EC: 0,
                    DT: quiz,
                    EM: "Delete quiz has been added",
                });
        }
        catch (e) {
            console.log("Delete quiz has not been added")
            return res.status(500).json({ message: `Delete quiz has not added, err: ${e}`, EC: -1, EM: "Delete quiz has not added", });
        }
    },

}

