const pool = require("../model/database");

const HTTPStatusCodes = require("../utils/HTTPStatusCodes");

const AreaModel = require("../model/area");

module.exports.areaFromID = async (req, res) => {
    const { areaID } = req.params;

    const connection = await pool.connect();

    try {
        const result = await AreaModel.areaFromID(connection, areaID);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.getAreasByGardenID = async (req, res) => {
    const { gardenID } = req.params;
    const connection = await pool.connect();

    try {
        const result = await AreaModel.getAllByGardenID(connection, gardenID);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};
