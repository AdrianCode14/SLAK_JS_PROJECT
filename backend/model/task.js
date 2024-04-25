module.exports.getAllPaginated = async (connection, offset) => {
    const result = await connection.query(
        `
    SELECT * FROM task OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS]
    );
    return result.rows;
};

module.exports.getCount = async (connection) => {
    const result = await connection.query(`SELECT COUNT(*) FROM Task`);

    return result.rows[0].count;
};

module.exports.getAllPaginatedWithSearch = async (
    connection,
    offset,
    query
) => {
    const result = await connection.query(
        `SELECT * FROM Task WHERE title LIKE '%' || $3 || '%' OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS, query]
    );

    return result.rows;
};

module.exports.getCountSearch = async (connection, query) => {
    const result = await connection.query(
        `SELECT COUNT(*) FROM Task WHERE title LIKE '%' || $1 || '%'`,
        [query]
    );

    return result.rows[0].count;
};

module.exports.delete = async (connection, taskId) => {
    await connection.query("DELETE FROM Task WHERE id = $1", [taskId]);
};

module.exports.getNoValidatedTasks = async (connection, id) => {
    const result = await connection.query(
        `
    SELECT * FROM Task WHERE area_id = $1 AND validated = false ORDER BY deadline_date
    `,
        [id]
    );

    return result.rows;
};

module.exports.validateTask = async (connection, id) => {
    await connection.query(
        `
    UPDATE Task SET validated = true WHERE id = $1
    `,
        [id]
    );
};

module.exports.addTask = async (
    connection,
    area_id,
    title,
    description,
    deadline
) => {
    await connection.query(
        `
    INSERT INTO Task (area_id, title, description, start_date, deadline_date) VALUES
    ($1, $2, $3, NOW(), $4)
    `,
        [area_id, title, description, deadline]
    );
};

module.exports.addTaskWithStartDateCustom = async (
    connection,
    area_id,
    title,
    description,
    startDate,
    deadline
) => {
    await connection.query(
        `
    INSERT INTO Task (area_id, title, description, start_date, deadline_date) VALUES
    ($1, $2, $3, $4, $5)
    `,
        [area_id, title, description, startDate, deadline]
    );
};

module.exports.updateTask = async (
    connection,
    id,
    area_id,
    title,
    description,
    start_date,
    deadline,
    validated
) => {
    await connection.query(
        `
    UPDATE Task SET area_id = $2, title = $3, description = $4, start_date = $5, deadline_date = $6, validated = $7 WHERE id = $1
    `,
        [id, area_id, title, description, start_date, deadline, validated]
    );
};
