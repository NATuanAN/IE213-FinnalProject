const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.midddleware');
const { generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken } = require('../utils/token');
const { verifyToken, verifyRole } = require('../middlewares/auth.midddleware');
router.use('/admins', verifyToken, verifyRole(['ADMIN']));
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post("/participant", authController.upload.single("userImage"), authController.createUser);
router.get('/participant/all', verifyToken, verifyRole(['ADMIN']), authController.getAllUser);


router.delete('/participant', authController.deleteUser);
router.put('/participant', authController.upload.single("userImage"), authController.updateUser);
router.get('/participant', authController.getUserWithPaginate);
router.get('/participant/:id', authController.getUserbyId);
// router.post('/logout', authMiddleware.verifyToken, authController.logout);
// router.post('/change-password', authMiddleware.verifyToken, authController.changePassword);
// router.post('/update-profile', authMiddleware.verifyToken, authController.updateProfile);
// router.get('/dashboard-overview', authMiddleware.verifyToken, authController.dashboardOverview);
// router.get('/history', authMiddleware.verifyToken, authController.history);

module.exports = router;
