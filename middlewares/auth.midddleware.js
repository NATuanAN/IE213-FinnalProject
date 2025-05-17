
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    // TODO: verify token, decode user info ...

    next();
};

module.exports = authMiddleware;
