require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
const questionRoutes = require("./routes/question.routes");
const gptRoutes = require('./routes/GPT.routes');


const path = require("path");
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/uploadsQuizz', express.static(path.join(__dirname, 'uploadsQuizz')));
app.use('/uploadsQuestion', express.static(path.join(__dirname, 'uploadsQuestion')));
app.use('/uploadsUser', express.static(path.join(__dirname, 'uploadsUser')));

app.use('/api/v1', authRoutes);
app.use('/api/v1', quizRoutes);
app.use('/api/v1', questionRoutes);
app.use('/api/v1', gptRoutes);
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = { app, startServer };
