const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

// Serve HTML
app.use(express.static(path.join(__dirname, "public")));

// Python Run API
app.post("/run", (req, res) => {

    const code = req.body.code;

    fs.writeFileSync("./temp/temp.py", code);

    exec("python3 ./temp/temp.py", (err, stdout, stderr) => {

        if (err) {
            return res.json({
                output: stderr
            });
        }

        res.json({
            output: stdout
        });

    });

});

app.listen(3000, () => {
    console.log("Server Running");
});