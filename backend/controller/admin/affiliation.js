const pool = require("../../model/database");
const AffiliationModel = require("../../model/affiliation");
const HTTPStatusCodes = require("../../utils/HTTPStatusCodes");
const TransactionModule = require("../../model/transaction");
const ConflictError = require("../../errors/conflictError");

/**
 * @swagger
 *  components:
 *      responses:
 *          Affiliation:
 *              description: A page containing X affiliation
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              garden_id:
 *                                  type: integer
 *                              user_id:
 *                                  type: string
 *                                  format: email
 *                              role:
 *                                  type: string
 *                                  enum:
 *                                      - affiliate
 *                                      - admin
 *                              join_date:
 *                                  type: string
 *                                  format: date-time
 *          AffiliationCount:
 *              description: The number of affiliations in the table
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: integer
 *
 *      requestBodies:
 *          AffiliationsToDelete:
 *              description: An Array containing all the affiliations to delete
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  garden_id:
 *                                      type: integer
 *                                  user_id:
 *                                      type: string
 *                                      format: email
 *                              required:
 *                                  - garden_id
 *                                  - user_id
 *          AffiliationToCreate:
 *              description: An object describing the affiliation to create
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              garden_id:
 *                                  type: integer
 *                              user_id:
 *                                  type: string
 *                                  format: email
 *                          required:
 *                              - garden_id
 *                              - user_id
 *          AffiliationToEdit:
 *              description: An object describing the affiliation to edit
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              garden_id:
 *                                  type: integer
 *                              user_id:
 *                                  type: string
 *                                  format: email
 *                              join_date:
 *                                  type: string
 *                                  format: date-time
 *                          required:
 *                              - garden_id
 *                              - user_id
 *                              - join_date
 */

module.exports.create = async (req, res) => {
    const payload = req.body;

    if (!payload.garden_id || !payload.user_id) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send("Body passed is invalid");
        return;
    }

    const connection = await pool.connect();

    try {
        await AffiliationModel.addNewAffiliation(
            connection,
            payload.user_id,
            payload.garden_id,
            payload.role
        );

        res.status(HTTPStatusCodes.CREATED).send(
            "Affiliation successfuly created !"
        );
    } catch (error) {
        if (error instanceof ConflictError) {
            res.status(HTTPStatusCodes.CONFLICT).send(
                "This affiliation already exist"
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
        const result = await AffiliationModel.getAllPaginated(
            connection,
            offset
        );

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
        const result = await AffiliationModel.getCount(connection);

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
        const result = await AffiliationModel.getAllPaginatedWithSearch(
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
        const result = await AffiliationModel.getCountSearch(connection, query);

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

    if (!payload.garden_id || !payload.user_id || !payload.join_date) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send("Body passed is invalid");
        return;
    }

    const connection = await pool.connect();

    try {
        await AffiliationModel.updateAffiliation(
            connection,
            payload.user_id,
            payload.garden_id,
            payload.join_date
        );
        res.status(HTTPStatusCodes.OK).send("Affiliation successfuly edited !");
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.delete = async (req, res) => {
    const payload = req.body;

    if (!(payload instanceof Array)) {
        res.sendStatus(HTTPStatusCodes.BAD_REQUEST);
        return;
    }

    const connection = await pool.connect();

    try {
        await TransactionModule.beginTransaction(connection);
        let invalid = false;

        for (let row of payload) {
            if ("user_id" in row && "garden_id" in row) {
                await AffiliationModel.delete(
                    connection,
                    row.user_id,
                    row.garden_id
                );
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
            res.sendStatus(HTTPStatusCodes.OK);
        }
    } catch (error) {
        await TransactionModule.rollbackTransaction(connection);
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};
