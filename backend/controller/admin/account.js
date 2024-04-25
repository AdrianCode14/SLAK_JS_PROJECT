const pool = require("../../model/database");
const UserModel = require("../../model/user");
const TransactionModule = require("../../model/transaction");
const HTTPStatusCodes = require("../../utils/HTTPStatusCodes");
const Crypt = require("../../utils/crypt");
const ConflictError = require("../../errors/conflictError");

/**
 * @swagger
 *  components:
 *      responses:
 *          Account:
 *              description: A page containing X accounts
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  format: email
 *                              name:
 *                                  type: string
 *                              first_name:
 *                                  type: string
 *                              is_admin:
 *                                  type: boolean
 *          AccountCount:
 *              description: The number of accounts in the table
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: integer
 *
 *      requestBodies:
 *          AccountsToDelete:
 *              description: An Array containing all the accounts to delete
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  email:
 *                                      type: string
 *                                      format: email
 *                              required:
 *                                  - email
 *          AccountToCreate:
 *              description: An object describing the account to create
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  format: email
 *                              password:
 *                                  type: string
 *                              name:
 *                                  type: string
 *                              first_name:
 *                                  type: string
 *                              is_admin:
 *                                  type: boolean
 *                          required:
 *                              - email
 *                              - password
 *                              - name
 *                              - first_name
 *                              - is_admin
 *          AccountToEdit:
 *              description: An object describing the account to edit
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  format: email
 *                              name:
 *                                  type: string
 *                              first_name:
 *                                  type: string
 *                              is_admin:
 *                                  type: boolean
 *                          required:
 *                              - email
 *                              - name
 *                              - first_name
 *                              - is_admin
 *
 *          SearchQuery:
 *              description: An object representing a query
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              query:
 *                                  type: string
 */

module.exports.create = async (req, res) => {
    const payload = req.body;

    if (
        !payload.email ||
        !payload.name ||
        !payload.first_name ||
        !payload.password
    ) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "Body passed is invalid !"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await UserModel.addNewUser(
            connection,
            payload.email,
            payload.name,
            payload.first_name,
            Crypt.genPasswordHash(payload.password),
            payload.is_admin
        );

        res.status(HTTPStatusCodes.CREATED).send("User successfuly created !");
    } catch (error) {
        if (error instanceof ConflictError) {
            res.status(HTTPStatusCodes.CONFLICT).send(
                "This user already exist"
            );
        } else {
            console.error(error);
            res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        }
    } finally {
        connection.release();
    }
};

module.exports.read = async (req, res) => {
    const connection = await pool.connect();
    const page = req.params.page;
    const paginationRows = process.env.PAGINATION_ROWS;

    const offset = (page - 1) * paginationRows;

    try {
        const result = await UserModel.getAllPaginated(connection, offset);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.count = async (req, res) => {
    const connection = await pool.connect();
    try {
        const result = await UserModel.getCount(connection);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.readSearch = async (req, res) => {
    const connection = await pool.connect();
    const page = req.params.page;
    const { query } = req.body;
    const paginationRows = process.env.PAGINATION_ROWS;

    const offset = (page - 1) * paginationRows;

    try {
        const result = await UserModel.getAllPaginatedWithSearch(
            connection,
            offset,
            query
        );

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.countSearch = async (req, res) => {
    const { query } = req.body;
    const connection = await pool.connect();
    try {
        const result = await UserModel.getCountSearch(connection, query);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.update = async (req, res) => {
    const payload = req.body;

    if (!payload.email || !payload.name || !payload.first_name) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "Body passed is invalid !"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await UserModel.editUser(
            connection,
            payload.email,
            payload.name,
            payload.first_name,
            payload.is_admin
        );

        res.status(HTTPStatusCodes.OK).send("User successfuly Edited !");
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.delete = async (req, res) => {
    const payload = req.body;
    const current = req.client.user;

    if (!(payload instanceof Array)) {
        res.sendStatus(HTTPStatusCodes.BAD_REQUEST);
        return;
    }

    const filtered = payload.filter((row) => {
        if ("email" in row && row.email === current) return false;
        return true;
    });

    if (filtered.length === 0) {
        res.status(HTTPStatusCodes.FORBIDDEN).send(
            "You cannot delete yourself"
        );
        return;
    }

    const connection = await pool.connect();
    let invalid = false;
    try {
        await TransactionModule.beginTransaction(connection);

        for (let row of filtered) {
            if ("email" in row) {
                await UserModel.delete(connection, row.email);
            } else {
                invalid = true;
                break;
            }
        }

        if (invalid) {
            await TransactionModule.rollbackTransaction(connection);
            res.sendStatus(HTTPStatusCodes.BAD_REQUEST);
        } else {
            await TransactionModule.commitTransaction(connection);
        }
    } catch (error) {
        await TransactionModule.rollbackTransaction(connection);
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }

    if (!invalid) res.sendStatus(HTTPStatusCodes.OK);
};
