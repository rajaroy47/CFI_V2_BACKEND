const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");


const isLoggedIn = async function (req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            statusCode: 401,
            success: false,
            message: "Unauthorized access (token not set)",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ attach user to request
        req.user = decoded.data;

        next();

    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            success: false,
            message: "Invalid or expired token",
            errorMsg: error.message
        });
    }
}

module.exports = {
    isLoggedIn
}