const ConflictError = require("../errors/conflictError");

module.exports.getUser = async (connection, email) => {
    const result = await connection.query(
        `
    SELECT * FROM Account WHERE email = $1
    `,
        [email]
    );

    return result.rows[0];
};

module.exports.getAllPaginated = async (connection, offset) => {
    const result = await connection.query(
        `SELECT email, name, first_name, is_admin FROM Account OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS]
    );

    return result.rows;
};

module.exports.getAllPaginatedWithSearch = async (
    connection,
    offset,
    query
) => {
    const result = await connection.query(
        `SELECT email, name, first_name, is_admin FROM Account WHERE name LIKE '%' || $3 || '%' OFFSET $1 LIMIT $2`,
        [offset, process.env.PAGINATION_ROWS, query]
    );

    return result.rows;
};

module.exports.getCountSearch = async (connection, query) => {
    const result = await connection.query(
        `SELECT COUNT(*) FROM Account WHERE name LIKE '%' || $1 || '%'`,
        [query]
    );

    return result.rows[0].count;
};

module.exports.getCount = async (connection) => {
    const result = await connection.query(`SELECT COUNT(*) FROM Account`);

    return result.rows[0].count;
};

module.exports.addNewUser = async (
    connection,
    email,
    name,
    firstName,
    password,
    isAdmin = false
) => {
    let result = true;
    await connection
        .query(
            `
    INSERT INTO Account(email, name, first_name, password, is_admin) 
    VALUES ($1, $2, $3, $4, $5)  
    `,
            [email, name, firstName, password, isAdmin]
        )
        .catch((error) => {
            if (error.code === "23505") {
                throw new ConflictError();
            }
        });

    return result;
};

module.exports.getUserData = async (connection, email) => {
    const result = await connection.query(
        `
    SELECT email, name, first_name from Account WHERE email = $1`,
        [email]
    );

    return result.rows[0];
};

module.exports.updateUserData = async (connection, email, name, firstName) => {
    await connection.query(
        `
    UPDATE Account SET name = $1, first_name = $2 WHERE email = $3`,
        [name, firstName, email]
    );
};

module.exports.editUser = async (
    connection,
    email,
    name,
    firstName,
    isAdmin
) => {
    await connection.query(
        `
    UPDATE Account SET name = $2, first_name = $3, is_admin = $4 WHERE email = $1  
    `,
        [email, name, firstName, isAdmin]
    );
};

module.exports.delete = async (connection, email) => {
    await connection.query(`DELETE FROM Account WHERE email = $1`, [email]);
};
