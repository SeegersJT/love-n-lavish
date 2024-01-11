const jwt = require("jsonwebtoken");
require('dotenv').config();

const handleErrors = require("../handlers/errorHandler");

module.exports = handleErrors(async (request, response, next) => {
    const tokenHeader = request.headers.authorization;

    if (!tokenHeader) {
        throw { status: 401, message: "Unauthorized Request." };
    }

    const token = tokenHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, userEmail } = decodedToken;

    request.user = { userId, userEmail };

    next();
});
