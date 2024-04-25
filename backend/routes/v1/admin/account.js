const router = require("express").Router();
const AccountController = require("../../../controller/admin/account");
const AuthMiddleware = require("../../../middleware/auth");
const RoleMiddleware = require("../../../middleware/role");

/**
 * @swagger
 * /v1/admin/account/page/{page}:
 *  get:
 *      tags:
 *          - Account
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - name: page
 *            description: the selected page
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: "#/components/responses/Account"
 *          400:
 *              description: User invalid
 *          403:
 *              description: User is not admin
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          5XX:
 *              description: Unexpected server error
 *
 * /v1/admin/account/count:
 *  get:
 *      tags:
 *          - Account
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: "#/components/responses/AccountCount"
 *          400:
 *              description: User invalid
 *          403:
 *              description: User is not admin
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          5XX:
 *              description: Unexpected server error
 * /v1/admin/account/page-search/{page}:
 *  post:
 *      tags:
 *          - Account
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: "#/components/requestBodies/SearchQuery"
 *      parameters:
 *          - name: page
 *            description: the selected page
 *            in: path
 *            required: true
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              $ref: "#/components/responses/Account"
 *          400:
 *              description: User invalid
 *          403:
 *              description: User is not admin
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          5XX:
 *              description: Unexpected server error
 *
 * /v1/admin/account/count-search:
 *  post:
 *      tags:
 *          - Account
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: "#/components/requestBodies/SearchQuery"
 *      responses:
 *          200:
 *              $ref: "#/components/responses/AccountCount"
 *          400:
 *              description: User invalid
 *          403:
 *              description: User is not admin
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          5XX:
 *              description: Unexpected server error
 *
 * /v1/admin/account:
 *  delete:
 *      tags:
 *          - Account
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AccountsToDelete'
 *      responses:
 *          200:
 *              description: Account successfuly deleted
 *          400:
 *              description: User is invalid or the body passed is invalid
 *          403:
 *              description: User is not admin or the user tries to delete himself
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          5XX:
 *              description: Unexpected server error
 *  post:
 *      tags:
 *          - Account
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AccountToCreate'
 *      responses:
 *          201:
 *              description: Account successfuly created
 *          400:
 *              description: User is invalid or the body passed is invalid
 *          403:
 *              description: User is not admin
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          409:
 *              description: Account already exist
 *          5XX:
 *              description: Unexpected server error
 *
 *  patch:
 *      tags:
 *          - Account
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AccountToEdit'
 *      responses:
 *          200:
 *              description: Account successfuly Edited
 *          400:
 *              description: User is invalid or the body passed is invalid
 *          403:
 *              description: User is not admin
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          5XX:
 *              description: Unexpected server error
 */

router.get(
    "/page/:page",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AccountController.read
);

router.post(
    "/page-search/:page",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AccountController.readSearch
);

router.post(
    "/count-search",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AccountController.countSearch
);

router.get(
    "/count",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AccountController.count
);

router.delete(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AccountController.delete
);
router.patch(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AccountController.update
);
router.post(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AccountController.create
);

module.exports = router;
