import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// Verify JWT Token
// Check user authentication
// ---------------------------------------------
const verifyToken = (req, res, next) => {

  // Get token from cookie
  const token = req.cookies.token;

  // Check token exists
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user data in request
    req.user = decoded;

    // Go to next route
    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid Token",
    });

  }

};

export default verifyToken;