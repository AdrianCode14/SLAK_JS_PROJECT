const pool = require("../model/database");

const HTTPStatusCodes = require("../utils/HTTPStatusCodes");

const TaskModel = require("../model/task");

module.exports.addTask = async (req, res) => {
    const { areaID } = req.params;
    const { title, description, deadline } = req.body;

    const connection = await pool.connect();

    try {
        await TaskModel.addTask(
            connection,
            areaID,
            title,
            description,
            deadline
        );

        res.sendStatus(HTTPStatusCodes.CREATED);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.validateTask = async (req, res) => {
    const { taskID } = req.body;

    const connection = await pool.connect();

    try {
        await TaskModel.validateTask(connection, taskID);

        res.sendStatus(HTTPStatusCodes.OK);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.getNoValidatedTasks = async (req, res) => {
    const { areaID } = req.params;

    const connection = await pool.connect();

    try {
        const result = await TaskModel.getNoValidatedTasks(connection, areaID);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};
