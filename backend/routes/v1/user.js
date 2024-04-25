const router = require("express").Router();
const UserController = require("../../controller/user");
const AuthMiddleware = require("../../middleware/auth");

router.post("/login", UserController.login);
router.post("/register", UserController.register);
router.get("/userdata", AuthMiddleware.auth, UserController.getUserData);
router.patch(
    "/updateUserData",
    AuthMiddleware.auth,
    UserController.updateUserData
);
router.get("/is-admin", AuthMiddleware.auth, UserController.hasAdminPrivileges);

module.exports = router;
