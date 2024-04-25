const router = require("express").Router();
const AreaController = require("../../controller/area");
const RoleMiddleware = require("../../middleware/role");
const AuthMiddleware = require("../../middleware/auth");

router.get(
    "/from-area/:areaID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeAffiliateAtArea,
    AreaController.areaFromID
);
router.get(
    "/:gardenID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeAffiliate,
    AreaController.getAreasByGardenID
);

module.exports = router;
