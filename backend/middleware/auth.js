const JWT = require("../utils/jwt");
const HTTPStatusCodes = require("../utils/HTTPStatusCodes");
const UserModel = require("../model/user");
const pool = require("../model/database");

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

module.exports.auth = async (req, res, next) => {
    const header = req.get("Authorization");
    if (header === undefined) {
        res.status(HTTPStatusCodes.UNAUTHORIZED).send(
            "You must be logged in to use this feature"
        );
    } else {
        const connection = await pool.connect();

        try {
            if (header.includes("Bearer")) {
                const token = header.substring(7);

                const decoded = JWT.verify(token);
                req.client = {};
                req.client.user = decoded.data.email;

                const user = await UserModel.getUser(
                    connection,
                    req.client.user
                );

                if (user) {
                    next();
                } else {
                    res.status(HTTPStatusCodes.UNAUTHORIZED).send(
                        "TOKEN_INVALID"
                    );
                }
            } else {
                res.status(HTTPStatusCodes.NOT_FOUND).send(
                    "Request header auth not found"
                );
            }
        } catch (error) {
            if (error.name === "TokenExpiredError")
                res.status(HTTPStatusCodes.UNAUTHORIZED).send("TOKEN_EXPIRED");
            else {
                res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
                console.error(error);
            }
        } finally {
            connection.release();
        }
    }
};
