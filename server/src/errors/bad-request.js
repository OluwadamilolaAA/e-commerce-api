const customAPIError = require("./custom-error");

class BadRequestError extends customAPIError {
    constructor(message){
        super(message, 400);
        this.statusCode = 400;
    }
}
module.exports = BadRequestError;