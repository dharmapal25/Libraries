// route.middleware.js
import jwt from "jsonwebtoken";

const routeMiddleware = (req, res, next) => {
    try {
        // 1. Token get karo
        const token = req.cookies.JWT_TOKEN;

        // 2. Check karo token hai ya nahi
        if (!token) {
            return res.redirect("/login");
        }

        // 3. Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded user:", decode);

        // 4. User info request me attach karo
        req.user = decode;

        next();

    } catch (err) {
        console.log("JWT Error:", err.message);
        return res.redirect("/login");
    }
};

export default routeMiddleware;