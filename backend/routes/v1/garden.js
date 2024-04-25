const router = require("express").Router();
const GardenController = require("../../controller/garden");
const RoleMiddleware = require("../../middleware/role");
const AuthMiddleware = require("../../middleware/auth");

//Search a list of gardens by a query
router.post("/search", GardenController.searchGarden);

//Get a list of all gardens (this only give basic infos of a garden)
router.get("/", GardenController.getPublicGardens);

//Get all affiliated gardens for a user
router.get(
    "/user-affiliated-gardens",
    AuthMiddleware.auth,
    GardenController.getAllUserAffiliatedGardens
);

//Get a garden by id only if user is affiliate
router.get(
    "/byID/:gardenID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeAffiliate,
    GardenController.getByID
);

//Get a garden by an area id if user is affiliate
router.get(
    "/fromArea/:areaID",
    AuthMiddleware.auth,
    RoleMiddleware.mustBeAffiliateAtArea,
    GardenController.gardenFromArea
);

//Get own garden if user has a created garden
router.get(
    "/own-created-garden",
    AuthMiddleware.auth,
    GardenController.getOwnCreatedGarden
);
//Create a new garden for a user if it has no garden created
router.post(
    "/create",
    AuthMiddleware.auth,
    RoleMiddleware.isNotOwner,
    GardenController.createGarden
);
router.post(
    "/edit",
    AuthMiddleware.auth,
    RoleMiddleware.isOwner,
    GardenController.editGarden
);

//To move into affiliation
//Join a garden by garden id
router.post("/join", AuthMiddleware.auth, GardenController.join);
//remove a member from a garden
router.delete(
    "/remove-member",
    AuthMiddleware.auth,
    RoleMiddleware.isOwner,
    GardenController.deleteMember
);
router.patch(
    "/give-ownership",
    AuthMiddleware.auth,
    RoleMiddleware.isOwner,
    GardenController.giveOwnership
);

module.exports = router;
