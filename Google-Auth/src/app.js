import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Session Configuration
app.use(
  session({
    secret: "abcd-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
// Starts Passport authentication
// ---------------------------------------------
app.use(passport.initialize());


// Enable Passport Session
// Keeps user logged in after authentication
// ---------------------------------------------
app.use(passport.session());


// Google OAuth Strategy
// Configure Google Login
// ---------------------------------------------
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},

  (accessToken, refreshToken, profile, done) => {

    // Normally:
    // - Find user in database
    // - Create user if not exists
    // - Generate JWT (optional)

    return done(null, profile);
  }
)
);


// Serialize User
// Save user into session
// ---------------------------------------------
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize User
// Get user from session
// ---------------------------------------------
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Home
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

// Google Login
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback Route
// Google redirects user here after login
// ---------------------------------------------
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Protected Profile Route
// Only logged-in users can access
// ---------------------------------------------
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.json({ "user": req.user });
  console.log("req.isAuthenticated() : >> ", req.isAuthenticated())
});


// Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});


//  Login Failed Route
app.get("/failed", (req, res) => {
  res.send("Login Failed");
});



app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});