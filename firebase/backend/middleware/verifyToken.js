const jwt = require("jsonwebtoken");

export const verifyToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Not authenticated"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, email, role }
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}


