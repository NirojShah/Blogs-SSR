class CustomError extends Error {
    constructor(statusCode,message){
        super(message)
        this.statusCode = statusCode;
        this.status=statusCode>=400 && statusCode<=500 ? "FAIL !!":"error";

        this.isOperational = true
        Error.captureStackTrace(this,this.constructor) // copying or set the stack trace of Error class to CustomError class
    }
}

module.exports = CustomError