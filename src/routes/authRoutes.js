const express = require("express");
const router = express.Router();
require('dotenv').config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleErrors = require("../handlers/errorHandler");
const User = require("../db/userModel");

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw { code: 500, message: "Password hashing failed" };
    }
};

const comparePassword = async (password, dbPassword) => {
    try {
        const comparePassword = await bcrypt.compare(password, dbPassword);

        if (!comparePassword) {
            throw { code: 401, message: "Incorrect Username or Password" };
        }

        return comparePassword;
    } catch (error) {
        throw error;
    }
};

const createUser = async (email, hashedPassword) => {
    try {
        const user = new User({ email, password: hashedPassword });
        const result = await user.save();
        return result;
    } catch (error) {
        throw error; // Let the custom error handler deal with it
    }
};

const getUser = async (email) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw { code: 401, message: "Incorrect Username or Password" };
        }

        return user;
    } catch (error) {
        throw error; // Let the custom error handler deal with it
    }
};

const generateToken = (userId, userEmail) => {
    try {
        return jwt.sign(
            {
                userId,
                userEmail,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
    } catch (error) {
        throw { code: 500, message: "Token generation failed" };
    }
};

router.post("/register", handleErrors(async (request, response) => {
    const hashedPassword = await hashPassword(request.body.password);
    const result = await createUser(request.body.email, hashedPassword);

    response.status(201).send({
        message: "User Created Successfully",
        result,
    });
}));

router.post("/login", handleErrors(async (request, response) => {
    const user = await getUser(request.body.email);
    await comparePassword(request.body.password, user.password);

    const token = generateToken(user._id, user.email);

    response.status(200).send({
        message: "Login Successful",
        email: user.email,
        token,
    });
}));

module.exports = router;
