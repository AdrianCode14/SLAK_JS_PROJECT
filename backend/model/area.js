module.exports.addNewArea = async (connection, garden_id, area) => {
    await connection.query(
        `
    INSERT INTO Area(garden_id, area_index, name, description) VALUES ($1, $2, $3, $4);
    `,
        [garden_id, area.area_index, area.name, area.description]
    );
};

module.exports.update = async (connection, area) => {
    await connection.query(
        `
    UPDATE Area SET area_index = $1, name = $2, description = $3 WHERE id = $4;
    `,
        [area.area_index, area.name, area.description, area.id]
    );
};

module.exports.getAllPaginated = async (connection, offset) => {
    const result = await connection.query(
        `
    SELECT * FROM Area OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS]
    );
    return result.rows;
};

module.exports.getCount = async (connection) => {
    const result = await connection.query(`SELECT COUNT(*) FROM Area`);

    return result.rows[0].count;
};

module.exports.getAllPaginatedWithSearch = async (
    connection,
    offset,
    query
) => {
    const result = await connection.query(
        `SELECT * FROM Area WHERE name LIKE '%' || $3 || '%' OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS, query]
    );

    return result.rows;
};

module.exports.getCountSearch = async (connection, query) => {
    const result = await connection.query(
        `SELECT COUNT(*) FROM Area WHERE name LIKE '%' || $1 || '%'`,
        [query]
    );

    return result.rows[0].count;
};

module.exports.delete = async (connection, areaId) => {
    await connection.query("DELETE FROM Area WHERE id = $1", [areaId]);
};

module.exports.areaFromID = async (connection, id) => {
    const result = await connection.query(
        `
    SELECT * FROM Area WHERE id = $1
    `,
        [id]
    );

    return result.rows[0];
};

module.exports.getAllByGardenID = async (connection, gardenID) => {
    const result = await connection.query(
        `
    SELECT * FROM Area WHERE garden_id = $1`,
        [gardenID]
    );
    return result.rows;
};
