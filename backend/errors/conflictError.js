const HTTPStatusCodes = require("../utils/HTTPStatusCodes");
const BaseError = require("./baseError");

class ConflictError extends BaseError {
    constructor(
        name,
        statusCode = HTTPStatusCodes.CONFLICT,
        isOperational = true,
        description = "Conflict with database"
    ) {
        super(name, statusCode, isOperational, description);
    }
}

module.exports = ConflictError;
