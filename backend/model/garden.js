module.exports.searchGarden = async (connection, query) => {
    const result = await connection.query(
        `
    SELECT id, name, address, date FROM Garden WHERE name LIKE '%' || $1 || '%'
    `,
        [query]
    );

    return result.rows;
};

module.exports.getPublicGardens = async (connection) => {
    const result = await connection.query(`
    SELECT id, name, address, date FROM Garden LIMIT 30 
    `);

    return result.rows;
};

module.exports.delete = async (connection, gardenID) => {
    await connection.query(
        `
    DELETE FROM Garden WHERE id = $1
    `,
        [gardenID]
    );
};

module.exports.getAllPaginated = async (connection, offset) => {
    const result = await connection.query(
        `
    SELECT * FROM Garden OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS]
    );
    return result.rows;
};

module.exports.getByID = async (connection, id) => {
    const result = await connection.query(
        `
    SELECT * FROM Garden WHERE id = $1 LIMIT 1;
    `,
        [id]
    );

    return result.rows[0];
};

module.exports.getCount = async (connection) => {
    const result = await connection.query(`SELECT COUNT(*) FROM Garden`);

    return result.rows[0].count;
};

module.exports.getAllPaginatedWithSearch = async (
    connection,
    offset,
    query
) => {
    const result = await connection.query(
        `SELECT * FROM Garden WHERE name LIKE '%' || $3 || '%' OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS, query]
    );

    return result.rows;
};

module.exports.getCountSearch = async (connection, query) => {
    const result = await connection.query(
        `SELECT COUNT(*) FROM Garden WHERE name LIKE '%' || $1 || '%'`,
        [query]
    );

    return result.rows[0].count;
};

module.exports.getOwnCreatedGarden = async (connection, email) => {
    const result = await connection.query(
        `
    SELECT Garden.address, Garden.date, Garden.id, Garden.name, Garden.plan FROM Garden INNER JOIN Affiliation On Garden.id = Affiliation.garden_id WHERE Affiliation.user_id = $1 AND Affiliation.role = 'admin'
    `,
        [email]
    );

    return result.rows[0];
};

module.exports.getAffiliates = async (connection, email) => {
    const result = await connection.query(
        `
    SELECT Garden.id, Garden.name, Garden.address, Garden.date FROM Garden INNER JOIN Affiliation ON Garden.id = Affiliation.garden_id WHERE Affiliation.user_id = $1 AND Affiliation.role = 'affiliate'
    `,
        [email]
    );

    return result.rows;
};

module.exports.deleteMember = async (connection, garden, user) => {
    await connection.query(
        "DELETE FROM Affiliation WHERE garden_id = $1 AND user_id = $2",
        [garden, user]
    );
};

module.exports.addNewGarden = async (connection, garden) => {
    const result = await connection.query(
        `
    INSERT INTO Garden (date, name, address, plan) VALUES
    (NOW(), $1, $2, $3) RETURNING id
    `,
        [garden.name, garden.address, garden.plan]
    );

    return result.rows[0];
};

module.exports.updateGarden = async (connection, garden, gardenID) => {
    await connection.query(
        `
    UPDATE Garden SET date = $5, name = $1, address = $2, plan = $3 WHERE id = $4
    `,
        [garden.name, garden.address, garden.plan, gardenID, garden.date]
    );
};

module.exports.updateGardenWithCurrentDate = async (
    connection,
    garden,
    gardenID
) => {
    await connection.query(
        `
    UPDATE Garden SET date = NOW(), name = $1, address = $2, plan = $3 WHERE id = $4
    `,
        [garden.name, garden.address, garden.plan, gardenID]
    );
};

module.exports.gardenFromArea = async (connection, id) => {
    const result = await connection.query(
        `
        SELECT Garden.* from Garden INNER JOIN Area ON Area.id = $1 WHERE Area.garden_id = Garden.id
    `,
        [id]
    );
    return result.rows[0];
};
