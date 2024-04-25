const router = require("express").Router();

const UserRouter = require("./user");
const GardenRouter = require("./garden");
const AreaRouter = require("./area");
const TaskRouter = require("./task");
const AdminRouter = require("./admin");
const AffiliateRouter = require("./affiliate");

router.use("/area", AreaRouter);
router.use("/task", TaskRouter);
router.use("/user", UserRouter);
router.use("/garden", GardenRouter);

router.use("/admin", AdminRouter);
router.use("/area", AreaRouter);
router.use("/affiliate", AffiliateRouter);
module.exports = router;
