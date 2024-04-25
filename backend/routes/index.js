const router = require("express").Router();
const HTTPStatusCode = require("../utils/HTTPStatusCodes");

const V1Router = require("./v1");

router.use("/v1", V1Router);
router.get("/health", (req, res) => {
    res.sendStatus(HTTPStatusCode.OK);
})

module.exports = router;
