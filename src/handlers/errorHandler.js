const errorMessages = {
    500: (error) => ({
        status: 500,
        message: error.message || "Internal Server Error",
    }),
    401: (error) => ({
        status: 401,
        message: error.message || "Unathorized Request",
    }),
    404: (error) => ({
        status: 404,
        message: error.message || "Not Found",
    }),
    11000: (error) => ({
        status: 400,
        message: `Duplicate key error. ${error.keyValue.email} already exists. Please choose a different email.`,
    }),
};

const defaultErrorHandler = (error) => ({
    status: 500,
    message: error.message || "Internal Server Error",
});

const handleErrors = (fn) => async (request, response, next) => {
    try {
        await fn(request, response, next);
    } catch (error) {
        console.log(error)
        const errorHandler = errorMessages[error.code] || defaultErrorHandler;
        const { status, message } = errorHandler(error);

        response.status(status).json({ message });
    }
};

module.exports = handleErrors;
