const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.midddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
// router.post('/logout', authMiddleware.verifyToken, authController.logout);
// router.post('/change-password', authMiddleware.verifyToken, authController.changePassword);
// router.post('/update-profile', authMiddleware.verifyToken, authController.updateProfile);
// router.get('/dashboard-overview', authMiddleware.verifyToken, authController.dashboardOverview);
// router.get('/history', authMiddleware.verifyToken, authController.history);

module.exports = router;
