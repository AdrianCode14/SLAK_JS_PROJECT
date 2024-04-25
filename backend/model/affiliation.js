const ConflictError = require("../errors/conflictError");

//make role default value to 'affiliate' if no value is given for this parameter
module.exports.addNewAffiliation = async (
    connection,
    email,
    gardenID,
    role = "affiliate"
) => {
    await connection
        .query(
            `
    INSERT INTO Affiliation (garden_id, user_id, role, join_date) VALUES
        ($1, $2, $3, NOW())
    `,
            [gardenID, email, role]
        )
        .catch((error) => {
            if (error.code === "23505") {
                throw new ConflictError();
            }
        });
};

module.exports.updateAffiliation = async (
    connection,
    email,
    gardenID,
    join_date
) => {
    await connection.query(
        `
    UPDATE Affiliation SET join_date = $3 WHERE garden_id = $1 AND user_id = $2
    `,
        [gardenID, email, join_date]
    );
};

module.exports.hasAffiliation = async (connection, email, gardenID) => {
    const result = await connection.query(
        `
    SELECT * FROM Affiliation WHERE garden_id = $1 AND user_id = $2
    `,
        [gardenID, email]
    );

    return result.rows[0];
};

module.exports.getAdminAffiliation = async (connection, email) => {
    const result = await connection.query(
        `
    SELECT * FROM Affiliation WHERE user_id = $1 AND role = 'admin'
    `,
        [email]
    );

    return result.rows[0];
};

module.exports.getAllPaginated = async (connection, offset) => {
    const result = await connection.query(
        `
    SELECT * FROM Affiliation OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS]
    );
    return result.rows;
};

module.exports.getCount = async (connection) => {
    const result = await connection.query(`SELECT COUNT(*) FROM Affiliation`);

    return result.rows[0].count;
};

module.exports.getAllPaginatedWithSearch = async (
    connection,
    offset,
    query
) => {
    const result = await connection.query(
        `SELECT * FROM Affiliation WHERE user_id LIKE '%' || $3 || '%' OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS, query]
    );

    return result.rows;
};

module.exports.getCountSearch = async (connection, query) => {
    const result = await connection.query(
        `SELECT COUNT(*) FROM Affiliation WHERE user_id LIKE '%' || $1 || '%'`,
        [query]
    );

    return result.rows[0].count;
};

module.exports.delete = async (connection, userId, gardenId) => {
    await connection.query(
        `DELETE FROM Affiliation WHERE user_id = $1 AND garden_id = $2`,
        [userId, gardenId]
    );
};

module.exports.getAffiliationOfGarden = async (connection, gardenID) => {
    const result = await connection.query(
        `
    SELECT Affiliation.user_id as "email", Affiliation.garden_id as "gardenID", Account.name, Account.first_name as "firstName", Affiliation.role FROM Affiliation
    INNER JOIN Account ON Affiliation.user_id = Account.email
    WHERE Affiliation.garden_id = $1 `,
        [gardenID]
    );

    return result.rows;
};

module.exports.isAdmin = async (connection, email, gardenID) => {
    const result = await connection.query(
        "SELECT * FROM Affiliation WHERE user_id = $1 AND garden_id = $2 AND role = 'admin'",
        [email, gardenID]
    );
    return result.rows[0];
};

module.exports.isAdminFromAnyGarden = async (connection, email) => {
    const result = await connection.query(
        "SELECT * FROM Affiliation WHERE user_id = $1 AND role = 'admin'",
        [email]
    );
    return result.rows[0];
};

module.exports.deleteCrown = async (connection, garden, user) => {
    await connection.query(
        "UPDATE Affiliation SET role = 'affiliate' WHERE garden_id = $1 AND user_id = $2",
        [garden, user]
    );
};

module.exports.giveCrown = async (connection, garden, user) => {
    await connection.query(
        "UPDATE Affiliation SET role = 'admin' WHERE garden_id = $1 AND user_id = $2",
        [garden, user]
    );
};

module.exports.hasAffiliationToArea = async (connection, area_id, email) => {
    const result = await connection.query(
        `
        SELECT Affiliation.* FROM Affiliation INNER JOIN Area ON Area.id = $1 WHERE Area.garden_id = Affiliation.garden_id AND Affiliation.user_id = $2 

    `,
        [area_id, email]
    );

    return result.rows[0];
};

module.exports.hasOwnerAffiliationToArea = async (
    connection,
    area_id,
    email
) => {
    const result = await connection.query(
        `SELECT Affiliation.* FROM Affiliation INNER JOIN Area ON Area.id = $1 WHERE Area.garden_id = Affiliation.garden_id AND Affiliation.user_id = $2 AND role = 'admin'`,
        [area_id, email]
    );

    return result.rows[0];
};
