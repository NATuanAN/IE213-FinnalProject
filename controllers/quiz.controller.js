const Quiz = require("../models/Quiz");


module.exports =
{
    postCreateNewQuiz: async (req, res) => {
        try {
            const { description, name, difficulty, quizImage } = body.req;

            const quiz = new Quiz({
                description,
                name,
                difficulty,
                quizImage
            });

            await quiz.save();

            console.log("New quiz has add");
            res.status(200).json({ message: "New quiz has add" });
        }
        catch (e) {
            console.log("New quiz has not add");
            res.status(500).json({ message: `New quiz has not add, err: ${e}` });
        }

    }
}