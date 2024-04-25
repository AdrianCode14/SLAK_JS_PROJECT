const pool = require("../../model/database");
const fs = require("fs");
const path = require("path");

async function initDB() {
    const client = await pool.connect();
    try {
        const query = fs.readFileSync(
            path.join(__dirname, "../SQL/createDB.sql"),
            "utf-8"
        );
        await client.query(query);
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
        await pool.end();
    }
}

initDB().then(() => console.log("done"));
