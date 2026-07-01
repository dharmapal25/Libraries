import app from "./src/app.js";

const PORT = 5000;


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from the server!" });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});