import jwt from "jsonwebtoken";

const loginController = (req, res) => {

    // Assume user verified from DB
    let user = {
        _id: "123",
        name: "Flash",
        email: "a@b.com"
    };

    // 1. Token generate
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    // 2. Cookie me store
    res.cookie("JWT_TOKEN", token, {
        maxAge: 24 * 60 * 60 * 1000
    });

    // 3. Redirect ya response
    res.redirect("/home");
};

export default loginController;