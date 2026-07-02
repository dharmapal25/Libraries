const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/run", (req, res) => {
    const code = req.body.code;

    // D:\Libraries\Docker\sandbox
    console.log(__dirname);
    
    // D:\Libraries\Docker\sandbox\temp\temp.py
    // const filePath = path.join(__dirname, "temp", "temp.py");
    const filePath = path.join(__dirname, "temp", "temp.js");

    fs.writeFileSync(filePath, code);

    exec(`node "${filePath}"`, (error, stdout, stderr) => {

        console.log("stdout : ", stdout)
        console.log("stderr : ", stderr)

        if (error) {
            return res.json({
                success: false,
                output: stderr
            });
        }

        res.json({
            success: true,
            output: stdout
        });
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running : ${PORT}`);
});