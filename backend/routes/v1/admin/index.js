const router = require("express").Router();

const AccountRouter = require("./account");
const GardenRouter = require("./garden");
const AffiliationRouter = require("./affiliation");
const AreaRouter = require("./area");
const TaskRouter = require("./task");

router.use("/account", AccountRouter);
router.use("/garden", GardenRouter);
router.use("/affiliation", AffiliationRouter);
router.use("/area", AreaRouter);
router.use("/task", TaskRouter);

module.exports = router;
