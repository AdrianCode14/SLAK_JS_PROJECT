const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const port = process.env.BACKEND_PORT;

const Router = require("./routes");

app.use(cors());
app.use(express.json());
app.use(Router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
