import express from 'express';
import ejs from "ejs";
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routeMiddleware from "./src/middleware/route.middleware.js";
import jwt from "jsonwebtoken";
import loginController from './src/middleware/login.middleware.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// middleware
const middleware = (req, res, next) => {
  console.log("Middleware run ho raha hai");
  next();
}
// app.use(middleware);


// middleware - 2
// app.use((req, res, next) => {
//   console.log("Second middleware!");
//   next()
// })


// Routers
app.get('/', (req, res) => {
  res.send("Hello world!");
});

app.get("/login", (req,res)=> {
  res.render("login")
})

app.post("/login", loginController);

// Apply middleware only to protected routes
app.use(routeMiddleware);

app.get('/home', (req, res) => {
  let name = "Flash"
  res.render("index", { name })
});

app.get('/about', (req, res) => {
  res.send("hello About!")
});

app.post("/submit-form", (req, res) => {
  console.log(req.body);
  res.json({ message: "Form submitted successfully", data: req.body });
})




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});