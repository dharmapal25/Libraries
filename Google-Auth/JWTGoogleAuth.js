import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import verifyToken from "./verifyToken.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Initialize Passport
// Starts Passport authentication
// ---------------------------------------------
app.use(passport.initialize());


// Google OAuth Strategy
// Configure Google Login
// ---------------------------------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {

      // Normally:
      // - Find user in MongoDB
      // - Create user if not exists

      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };

      // Send user to callback route
      return done(null, user);
    }
  )
);


// Home Route
// ---------------------------------------------
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});


// Google Login Route
// Redirect user to Google Login Page
// ---------------------------------------------
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);


// Google Callback Route
// Google redirects user here after login
// ---------------------------------------------
app.get(
  "/auth/google/callback",

  passport.authenticate("google", {
    failureRedirect: "/failed",
    session: false,
  }),

  (req, res) => {

    // Create JWT Token
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store JWT in Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect("/profile");
  }
);


// Protected Profile Route
// Only logged-in users can access
// ---------------------------------------------
app.get("/profile", verifyToken, (req, res) => {

  res.json({
    message: "Login Success",
    user: req.user,
  });

});


// Logout Route
// Remove JWT Cookie
// ---------------------------------------------
app.get("/logout", (req, res) => {

  res.clearCookie("token");

  res.send(`Logout Successfully
    <button style="padding : 10px 20px; background : #ccc; color : #000; font-size : 15px" ><a href="/auth/google">Login with Google</a></button>`)

});


// Login Failed Route
// ---------------------------------------------
app.get("/failed", (req, res) => {
  res.send("Login Failed");
});


// Start Server
// ---------------------------------------------
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});