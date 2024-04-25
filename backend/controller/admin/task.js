const pool = require("../../model/database");
const TaskModel = require("../../model/task");
const HTTPStatusCodes = require("../../utils/HTTPStatusCodes");
const TransactionModule = require("../../model/transaction");

/**
 * @swagger
 *  components:
 *      responses:
 *          Task:
 *              description: A page containing X tasks
 *              content:
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              area_id:
 *                                  type: integer
 *                              title:
 *                                  type: string
 *                              start_date:
 *                                  type: string
 *                                  format: date-string
 *                              deadline_date:
 *                                  type: string
 *                                  format: date-string
 *                              validated:
 *                                  type: boolean
 *                              description:
 *                                  type: string
 *          TaskCount:
 *              description: The number of tasks in the table
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: integer
 *
 *      requestBodies:
 *          TasksToDelete:
 *              description: An Array containing all the tasks to delete
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
 *          TaskToCreate:
 *              description: An object describing the tasj to create
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              area_id:
 *                                  type: integer
 *                              title:
 *                                  type: string
 *                              start_date:
 *                                  type: string
 *                                  format: date-string
 *                              deadline_date:
 *                                  type: string
 *                                  format: date-string
 *                              description:
 *                                  type: string
 *                          required:
 *                              - area_id
 *                              - title
 *                              - start_date
 *                              - deadline
 *                              - description
 *          TaskToEdit:
 *              description: An object describing the task to edit
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: integer
 *                              area_id:
 *                                  type: integer
 *                              title:
 *                                  type: string
 *                              start_date:
 *                                  type: string
 *                                  format: date-string
 *                              deadline_date:
 *                                  type: string
 *                                  format: date-string
 *                              validated:
 *                                  type: boolean
 *                              description:
 *                                  type: string
 *                          required:
 *                              - id
 *                              - area_id
 *                              - title
 *                              - start_date
 *                              - deadline
 *                              - validated
 *                              - description
 */

module.exports.create = async (req, res) => {
    const payload = req.body;

    if (
        isNaN(payload.area_id) ||
        !payload.title ||
        !payload.deadline_date ||
        !payload.start_date
    ) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send("Body passed is invalid!");
        return;
    }

    const connection = await pool.connect();

    try {
        await TaskModel.addTaskWithStartDateCustom(
            connection,
            payload.area_id,
            payload.title,
            payload.description,
            payload.start_date,
            payload.deadline_date
        );
        res.status(HTTPStatusCodes.CREATED).send("Task successfuly created !");
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
        const result = await TaskModel.getAllPaginated(connection, offset);

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
        const result = await TaskModel.getAllPaginatedWithSearch(
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
        const result = await TaskModel.getCountSearch(connection, query);

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
        const result = await TaskModel.getCount(connection);

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
        isNaN(payload.area_id) ||
        !payload.title ||
        !payload.start_date ||
        !payload.deadline_date
    ) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send("Body passed is invalid!");
    }

    const connection = await pool.connect();

    try {
        await TaskModel.updateTask(
            connection,
            payload.id,
            payload.area_id,
            payload.title,
            payload.description,
            payload.start_date,
            payload.deadline_date,
            payload.validated
        );
        res.status(HTTPStatusCodes.OK).send("Task successfuly edited !");
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
                await TaskModel.delete(connection, row.id);
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
