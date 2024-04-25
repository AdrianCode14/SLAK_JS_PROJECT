const pool = require("../../model/database");
const AreaModel = require("../../model/area");
const HTTPStatusCodes = require("../../utils/HTTPStatusCodes");
const TransactionModule = require("../../model/transaction");

/**
 * @swagger
 *  components:
 *      responses:
 *          Area:
 *              description: A page containing X areas
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              garden_id:
 *                                  type: integer
 *                              area_index:
 *                                  type: integer
 *                              name:
 *                                  type: string
 *                              description:
 *                                  type: string
 *          AreaCount:
 *              description: The number of areas in the table
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: integer
 *
 *      requestBodies:
 *          AreasToDelete:
 *              description: An Array containing all the areas to delete
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: integer
 *                              required:
 *                                  - id
 *
 *          AreaToCreate:
 *              description: An object describing the area to create
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              garden_id:
 *                                  type: integer
 *                              area_index:
 *                                  type: integer
 *                              name:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                          required:
 *                              - garden_id
 *                              - area_index
 *                              - name
 *                              - description
 *          AreaToEdit:
 *              description: An object describing the area to edit
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              area_index:
 *                                  type: integer
 *                              name:
 *                                  type: string
 *                              description:
 *                                  type: string
 *                          required:
 *                              - id
 *                              - area_index
 *                              - name
 *                              - description
 */

module.exports.create = async (req, res) => {
    const payload = req.body;

    if (!payload.garden_id || isNaN(payload.area_index) || !payload.name) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "Body passed is invalid !"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await AreaModel.addNewArea(connection, payload.garden_id, payload);

        res.status(HTTPStatusCodes.CREATED).send("Area successfuly created !");
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
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
        const result = await AreaModel.getAllPaginated(connection, offset);

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
        const result = await AreaModel.getAllPaginatedWithSearch(
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
        const result = await AreaModel.getCountSearch(connection, query);

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
        const result = await AreaModel.getCount(connection);

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

    if (!payload.id || isNaN(payload.area_index) || !payload.name) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "Body passed is invalid !"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await AreaModel.update(connection, payload);
        res.status(HTTPStatusCodes.OK).send("Area successfuly edited !");
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
            if ("id" in row) {
                await AreaModel.delete(connection, row.id);
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
