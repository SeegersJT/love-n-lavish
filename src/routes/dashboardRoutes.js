const express = require("express");
const router = express.Router();
const handleErrors = require("../handlers/errorHandler");

const auth = require("../handlers/authHandler");

router.get("/", auth, handleErrors(async (request, response, next) => {
    response.json({ message: "You are authorized to access me" });
    next();
}));

module.exports = router;
