const Quiz = require("../models/Quiz");

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
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
    }

}