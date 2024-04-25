const router = require("express").Router();
const RoleMiddleware = require("../../middleware/role");
const AuthMiddleware = require("../../middleware/auth");
const TaskController = require("../../controller/task");

router.get(
    "/:areaID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeAffiliateAtArea,
    TaskController.getNoValidatedTasks
);
router.patch(
    "/validate/:areaID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeAffiliateAtArea,
    TaskController.validateTask
);
router.post(
    "/add/:areaID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeOwnerAtArea,
    TaskController.addTask
);

module.exports = router;
