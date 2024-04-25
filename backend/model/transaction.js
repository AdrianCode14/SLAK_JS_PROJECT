module.exports.beginTransaction = async (connection) => {
    await connection.query(`BEGIN`);
};

module.exports.commitTransaction = async (connection) => {
    await connection.query(`COMMIT`);
};

module.exports.rollbackTransaction = async (connection) => {
    await connection.query(`ROLLBACK`);
};
