const pool = require("../model/database");

const HTTPStatusCodes = require("../utils/HTTPStatusCodes");

const AffiliationModel = require("../model/affiliation");

module.exports.getAffiliatesByGardenID = async (req, res) => {
    const { gardenID } = req.params;
    const connection = await pool.connect();

    try {
        const result = await AffiliationModel.getAffiliationOfGarden(
            connection,
            gardenID
        );

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};
