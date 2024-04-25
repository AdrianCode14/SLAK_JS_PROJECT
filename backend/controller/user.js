const pool = require("../model/database");
const UserModel = require("../model/user");
const Crypt = require("../utils/crypt");
const JWT = require("../utils/jwt");
const HTTPStatusCodes = require("../utils/HTTPStatusCodes");
const ConflictError = require("../errors/conflictError");

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    const connection = await pool.connect();

    try {
        const result = await UserModel.getUser(connection, email);

        if (result) {
            const arePasswordEquals = Crypt.comparePasswords(
                password,
                result.password
            );
            if (arePasswordEquals) {
                res.status(HTTPStatusCodes.OK).json(
                    JWT.sign(
                        result.isAdmin,
                        email,
                        result.first_name,
                        result.name
                    )
                );
            } else {
                res.sendStatus(HTTPStatusCodes.FORBIDDEN);
            }
        } else {
            res.sendStatus(HTTPStatusCodes.FORBIDDEN);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

/** Register a new user in database
 *
 * Router Handler
 */
module.exports.register = async (req, res) => {
    const { email, name, firstName, password } = req.body;

    const connection = await pool.connect();

    try {
        await UserModel.addNewUser(
            connection,
            email,
            name,
            firstName,
            Crypt.genPasswordHash(password)
        );

        res.sendStatus(HTTPStatusCodes.CREATED);
    } catch (error) {
        if (error instanceof ConflictError) {
            res.sendStatus(error.statusCode);
        } else {
            console.error(error);
            res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        }
    } finally {
        connection.release();
    }
};

module.exports.getUserData = async (req, res) => {
    const email = req.client.user;
    const connection = await pool.connect();

    try {
        const result = await UserModel.getUserData(connection, email);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.updateUserData = async (req, res) => {
    const email = req.client.user;
    const connection = await pool.connect();
    const { newName: name, newFirstName: firstName } = req.body;

    try {
        await UserModel.updateUserData(connection, email, name, firstName);

        res.sendStatus(HTTPStatusCodes.OK);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.hasAdminPrivileges = async (req, res) => {
    const user = req.client.user;

    const connection = await pool.connect();

    try {
        const result = await UserModel.getUser(connection, user);

        if (!result) {
            res.sendStatus(HTTPStatusCodes.BAD_REQUEST);
        }

        if (result.is_admin) {
            res.sendStatus(HTTPStatusCodes.OK);
        } else {
            res.sendStatus(HTTPStatusCodes.FORBIDDEN);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};
