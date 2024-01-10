const express = require("express");
const router = express.Router();
const handleErrors = require("../handlers/errorHandler");

router.get("/", handleErrors(async (request, response, next) => {
    response.json({ message: "You are free to access me anytime" });
    next();
}));

module.exports = router;
