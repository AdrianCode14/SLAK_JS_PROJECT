const pool = require("../../model/database");
const GardenModel = require("../../model/garden");
const HTTPStatusCodes = require("../../utils/HTTPStatusCodes");
const TransactionModule = require("../../model/transaction");

/**
 * @swagger
 *  components:
 *      schemas:
 *          PlanJson:
 *              type: string
 *              format: json
 *              example: '{"meta": {"sizeX": 1,"sizeY": 1},"content": [[null]]}'
 *      responses:
 *          Garden:
 *              description: A page containing X gardens
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              name:
 *                                  type: string
 *                              address:
 *                                  type: string
 *                                  format: address
 *                                  example: Rue du Condroz 43,#Namur 5000#Belgique
 *                              date:
 *                                  type: string
 *                                  format: date-time
 *                              plan:
 *                                  $ref: "#/components/schemas/PlanJson"
 *          GardenCount:
 *              description: The number of gardens in the table
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: integer
 *
 *      requestBodies:
 *          GardensToDelete:
 *              description: An Array containing all the gardens to delete
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
 *          GardenToCreate:
 *              description: An object describing the garden to create
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                              address:
 *                                  type: string
 *                                  format: address
 *                                  example: Rue du Condroz 43,#Namur 5000#Belgique
 *                              plan:
 *                                  $ref: "#/components/schemas/PlanJson"
 *                          required:
 *                              - name
 *                              - address
 *                              - plan
 *          GardenToEdit:
 *              description: An object describing the garden to edit
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              name:
 *                                  type: string
 *                              address:
 *                                  type: string
 *                                  format: address
 *                                  example: Rue du Condroz 43,#Namur 5000#Belgique
 *                              date:
 *                                  type: string
 *                                  format: date-time
 *                              plan:
 *                                  $ref: "#/components/schemas/PlanJson"
 *                          required:
 *                              - id
 *                              - name
 *                              - address
 *                              - date
 *                              - plan
 */

module.exports.create = async (req, res) => {
    const payload = req.body;

    if (!payload.name || !payload.address || !payload.plan) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "Body passed is invalid !"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await GardenModel.addNewGarden(connection, payload);

        res.status(HTTPStatusCodes.CREATED).send(
            "Garden successfuly created !"
        );
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
        const result = await GardenModel.getAllPaginated(connection, offset);

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
        const result = await GardenModel.getAllPaginatedWithSearch(
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
        const result = await GardenModel.getCountSearch(connection, query);

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
        const result = await GardenModel.getCount(connection);

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

    if (
        !payload.id ||
        !payload.name ||
        !payload.address ||
        !payload.plan ||
        !payload.date
    ) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "Body passed is invalid !"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await GardenModel.updateGarden(connection, payload, payload.id);
        res.status(HTTPStatusCodes.OK).send("Garden successfuly edited !");
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
                await GardenModel.delete(connection, row.id);
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
