const router = require("express").Router();
const AffiliateController = require("../../controller/affiliate");
const RoleMiddleware = require("../../middleware/role");
const AuthMiddleware = require("../../middleware/auth");

router.get(
    "/:gardenID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeAffiliate,
    AffiliateController.getAffiliatesByGardenID
);

module.exports = router;
