const pool = require("../model/database");

const HTTPStatusCodes = require("../utils/HTTPStatusCodes");

const TransactionModule = require("../model/transaction");

const GardenModel = require("../model/garden");
const AffiliationModel = require("../model/affiliation");
const AreaModel = require("../model/area");

module.exports.searchGarden = async (req, res) => {
    const { query } = req.body;
    const connection = await pool.connect();

    try {
        const result = await GardenModel.searchGarden(connection, query);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.getPublicGardens = async (req, res) => {
    const connection = await pool.connect();

    try {
        const result = await GardenModel.getPublicGardens(connection);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.join = async (req, res) => {
    const gardenID = req.body.gardenID;
    const user = req.client.user;

    if (!gardenID) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send("gardenID is undefined");
    }

    const connection = await pool.connect();

    try {
        const result = await AffiliationModel.hasAffiliation(
            connection,
            user,
            gardenID
        );

        if (result) {
            res.status(HTTPStatusCodes.CONFLICT).send(
                "User is already affiliated"
            );
        } else {
            await AffiliationModel.addNewAffiliation(
                connection,
                user,
                gardenID
            );
            res.status(HTTPStatusCodes.CREATED).send(
                "User successfuly joined the garden"
            );
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.getByID = async (req, res) => {
    const { gardenID } = req.params;

    const connection = await pool.connect();

    try {
        const result = await GardenModel.getByID(connection, gardenID);

        if (!result) {
            res.status(HTTPStatusCodes.NOT_FOUND).send("Unable to find garden");
        } else {
            res.status(HTTPStatusCodes.OK).json(result);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.getOwnCreatedGarden = async (req, res) => {
    const connection = await pool.connect();

    const email = req.client.user;

    try {
        const result = await GardenModel.getOwnCreatedGarden(connection, email);

        if (!result) {
            res.status(HTTPStatusCodes.NOT_FOUND).send("Unable to find garden");
        } else {
            res.status(HTTPStatusCodes.OK).json(result);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.getAllUserAffiliatedGardens = async (req, res) => {
    const user = req.client.user;

    const connection = await pool.connect();

    try {
        const result = await GardenModel.getAffiliates(connection, user);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.deleteMember = async (req, res) => {
    const { garden, user } = req.body;

    const currentOwner = req.client.user;

    if (user === currentOwner) {
        res.status(HTTPStatusCodes.FORBIDDEN).send(
            "You cannot delete yourself"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await AffiliationModel.delete(connection, user, garden);

        res.sendStatus(HTTPStatusCodes.OK);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};

module.exports.giveOwnership = async (req, res) => {
    const { garden, user: newOwner } = req.body;
    const oldOwner = req.client.user;

    const connection = await pool.connect();

    try {
        const result = await AffiliationModel.isAdminFromAnyGarden(
            connection,
            newOwner,
            garden
        );

        if (result) {
            res.status(HTTPStatusCodes.FORBIDDEN).send(
                "User is already owning a garden"
            );
        } else {
            await TransactionModule.beginTransaction(connection);

            await AffiliationModel.deleteCrown(connection, garden, oldOwner);
            await AffiliationModel.giveCrown(connection, garden, newOwner);

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

function areAreasValid(areas) {
    if (!(areas instanceof Array)) {
        return false;
    }

    let index = 0;

    for (let area of areas) {
        if (
            area.name === undefined ||
            typeof area.name !== "string" ||
            area.name === ""
        ) {
            return false;
        }

        if (area.description !== null && typeof area.description !== "string") {
            return false;
        }

        if (area.area_index !== index) {
            return false;
        }

        index++;
    }
    return true;
}

function isPlanValid(plan, areasIndexMax) {
    if (plan === undefined || typeof plan !== "string") {
        return false;
    }

    const planSerialized = JSON.parse(plan);

    if (
        planSerialized.meta === undefined ||
        planSerialized.content === undefined
    ) {
        return false;
    }

    if (
        planSerialized.meta.sizeX === undefined ||
        typeof planSerialized.meta.sizeX !== "number" ||
        planSerialized.meta.sizeY === undefined ||
        typeof planSerialized.meta.sizeY !== "number"
    ) {
        return false;
    }

    if (
        !isGardenSizeValid(planSerialized.meta.sizeX) ||
        !isGardenSizeValid(planSerialized.meta.sizeX)
    ) {
        return false;
    }

    if (planSerialized.content.length !== planSerialized.meta.sizeY) {
        return false;
    }

    for (let row of planSerialized.content) {
        if (row.length !== planSerialized.meta.sizeX) {
            return false;
        }

        for (let data of row) {
            if (data !== null) {
                if (typeof data !== "number") {
                    return false;
                }

                if (data < 0 || data > areasIndexMax) {
                    return false;
                }
            }
        }
    }
    return true;
}

function isGardenSizeValid(size) {
    if (size < 1 || size > process.env.MAX_GARDEN_SIZE) {
        return false;
    }
    return true;
}

function isCreateGardenValid(body) {
    if (
        body === undefined ||
        body.garden === undefined ||
        body.areas === undefined
    ) {
        return false;
    }

    if (!areAreasValid(body.areas)) {
        return false;
    }

    if (!isPlanValid(body.garden.plan, body.areas.length - 1)) {
        return false;
    }
    return true;
}

module.exports.createGarden = async (req, res) => {
    const user = req.client.user;

    const payload = req.body;

    if (!isCreateGardenValid(payload)) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "body provided is invalid"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        await TransactionModule.beginTransaction(connection);

        let { id } = await GardenModel.addNewGarden(connection, payload.garden);

        await AffiliationModel.addNewAffiliation(connection, user, id, "admin");

        for (let area of payload.areas) {
            await AreaModel.addNewArea(connection, id, area);
        }

        await TransactionModule.commitTransaction(connection);
        res.sendStatus(HTTPStatusCodes.CREATED);
    } catch (error) {
        await TransactionModule.rollbackTransaction(connection);
        console.error(error);
        res.status(HTTPStatusCodes.SERVER_ERROR).send(error);
    } finally {
        connection.release();
    }
};

module.exports.editGarden = async (req, res) => {
    const user = req.client.user;

    const payload = req.body;

    if (!isCreateGardenValid(payload)) {
        res.status(HTTPStatusCodes.BAD_REQUEST).send(
            "body provided is invalid"
        );
        return;
    }

    const connection = await pool.connect();

    try {
        const garden = await GardenModel.getOwnCreatedGarden(connection, user);
        const gardenID = garden.id;
        await TransactionModule.beginTransaction(connection);

        await GardenModel.updateGardenWithCurrentDate(
            connection,
            payload.garden,
            gardenID
        );

        if (
            "areasDeleted" in payload &&
            Array.isArray(payload.areasDeleted) &&
            payload.areasDeleted.length > 0
        ) {
            for (let areaToDelete of payload.areasDeleted) {
                await AreaModel.delete(connection, areaToDelete);
            }
        }

        for (let area of payload.areas) {
            if ("id" in area) {
                await AreaModel.update(connection, area);
            } else {
                await AreaModel.addNewArea(connection, gardenID, area);
            }
        }
        await TransactionModule.commitTransaction(connection);
        res.sendStatus(HTTPStatusCodes.OK);
    } catch (error) {
        await TransactionModule.rollbackTransaction(connection);
        console.error(error);
        res.status(HTTPStatusCodes.SERVER_ERROR).send(error);
    } finally {
        connection.release();
    }
};

module.exports.gardenFromArea = async (req, res) => {
    const { areaID } = req.params;

    const connection = await pool.connect();

    try {
        const result = await GardenModel.gardenFromArea(connection, areaID);

        res.status(HTTPStatusCodes.OK).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(HTTPStatusCodes.SERVER_ERROR);
    } finally {
        connection.release();
    }
};
