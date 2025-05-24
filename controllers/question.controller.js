;
const Question = require('../models/Question')


module.exports = {
    // (quiz_id, description, image) 
    postQuestion: async (req, res) => {
        try {
            const { quiz_id, description, image } = req.body;
            const question = await Question.create({ quiz_id, description, image });

            if (!quiz_id || !description || !image) {
                console.log(
                    `Checking the required fields in question controller`
                );
                return res.status(400).json({ message: 'Please provide all required fields' });
            }
            console.log("Add question successfully");
            return res
                .status(200)
                .json({
                    message: `Question ${question.quiz_id} created successfully`,
                });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

    },


}