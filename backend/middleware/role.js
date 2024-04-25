const pool = require("../model/database");
const HTTPStatusCodes = require("../utils/HTTPStatusCodes");
const AffiliationModel = require("../model/affiliation");
const GardenModel = require("../model/garden");
const UserModel = require("../model/user");

module.exports.mustBeAffiliateAtArea = async (req, res, next) => {
    const user = req.client.user;
    const { areaID } = req.params;

    const connection = await pool.connect();

    try {
        const result = await AffiliationModel.hasAffiliationToArea(
            connection,
            areaID,
            user
        );

        if (result) {
            next();
        } else {
            res.status(HTTPStatusCodes.UNAUTHORIZED).send(
                "User must be affiliate at area"
            );
        }
    } catch (error) {
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        console.error(error);
    } finally {
        connection.release();
    }
};

module.exports.mustBeOwnerAtArea = async (req, res, next) => {
    const user = req.client.user;
    const { areaID } = req.params;

    const connection = await pool.connect();

    try {
        const result = await AffiliationModel.hasOwnerAffiliationToArea(
            connection,
            areaID,
            user
        );

        if (result) {
            next();
        } else {
            res.status(HTTPStatusCodes.UNAUTHORIZED).send(
                "User must be owner at area"
            );
        }
    } catch (error) {
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        console.error(error);
    } finally {
        connection.release();
    }
};

module.exports.mustBeAffiliate = async (req, res, next) => {
    const user = req.client.user;

    const { gardenID } = req.params;

    const connection = await pool.connect();

    try {
        const result = await AffiliationModel.hasAffiliation(
            connection,
            user,
            gardenID
        );

        if (result) {
            next();
        } else {
            res.status(HTTPStatusCodes.FORBIDDEN).send("NOT_AFFILIATE");
        }
    } catch (error) {
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        console.error(error);
    } finally {
        connection.release();
    }
};

module.exports.isNotOwner = async (req, res, next) => {
    const user = req.client.user;

    const connection = await pool.connect();

    try {
        const result = await AffiliationModel.getAdminAffiliation(
            connection,
            user
        );

        if (result) {
            res.status(HTTPStatusCodes.CONFLICT).send("ALREADY_OWNER");
        } else {
            next();
        }
    } catch (error) {
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        console.error(error);
    } finally {
        connection.release();
    }
};

module.exports.isOwner = async (req, res, next) => {
    const email = req.client.user;

    const connection = await pool.connect();

    try {
        const result = await GardenModel.getOwnCreatedGarden(connection, email);

        if (result) {
            next();
        } else {
            res.status(HTTPStatusCodes.FORBIDDEN).send("NOT_OWNER");
        }
    } catch (error) {
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        console.error(error);
    } finally {
        connection.release();
    }
};

module.exports.isSuperAdmin = async (req, res, next) => {
    const user = req.client.user;

    const connection = await pool.connect();

    try {
        const result = await UserModel.getUser(connection, user);

        if (!result) {
            res.status(HTTPStatusCodes.BAD_REQUEST).send("USER_NOT_FOUND");
        } else {
            if (result.is_admin) {
                next();
            } else {
                res.status(HTTPStatusCodes.FORBIDDEN).send("NOT_ADMIN");
            }
        }
    } catch (error) {
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
        console.error(error);
    } finally {
        connection.release();
    }
};
