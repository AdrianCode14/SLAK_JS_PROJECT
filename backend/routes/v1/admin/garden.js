const router = require("express").Router();
const GardenController = require("../../../controller/admin/garden");
const AuthMiddleware = require("../../../middleware/auth");
const RoleMiddleware = require("../../../middleware/role");

/**
 * @swagger
 * /v1/admin/garden/page/{page}:
 *  get:
 *      tags:
 *          - Garden
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
 *              $ref: "#/components/responses/Garden"
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
 * /v1/admin/garden/count:
 *  get:
 *      tags:
 *          - Garden
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: "#/components/responses/GardenCount"
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
 * /v1/admin/garden/page-search/{page}:
 *  post:
 *      tags:
 *          - Garden
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
 *              $ref: "#/components/responses/Garden"
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
 * /v1/admin/garden/count-search:
 *  post:
 *      tags:
 *          - Garden
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: "#/components/requestBodies/SearchQuery"
 *      responses:
 *          200:
 *              $ref: "#/components/responses/GardenCount"
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
 * /v1/admin/garden:
 *  delete:
 *      tags:
 *          - Garden
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/GardensToDelete'
 *      responses:
 *          200:
 *              description: Garden successfuly deleted
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
 *  post:
 *      tags:
 *          - Garden
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/GardenToCreate'
 *      responses:
 *          201:
 *              description: Garden successfuly created
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
 *
 *  patch:
 *      tags:
 *          - Garden
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/GardenToEdit'
 *      responses:
 *          200:
 *              description: Garden successfuly Edited
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
    GardenController.read
);
router.get(
    "/count",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    GardenController.count
);

router.post(
    "/page-search/:page",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    GardenController.readSearch
);

router.post(
    "/count-search",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    GardenController.countSearch
);

router.delete(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    GardenController.delete
);
router.patch(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    GardenController.update
);
router.post(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    GardenController.create
);
module.exports = router;
