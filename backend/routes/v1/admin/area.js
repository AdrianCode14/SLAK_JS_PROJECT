const router = require("express").Router();
const AreaController = require("../../../controller/admin/area");
const AuthMiddleware = require("../../../middleware/auth");
const RoleMiddleware = require("../../../middleware/role");

/**
 * @swagger
 * /v1/admin/area/page/{page}:
 *  get:
 *      tags:
 *          - Area
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
 *              $ref: "#/components/responses/Area"
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
 * /v1/admin/area/count:
 *  get:
 *      tags:
 *          - Area
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: "#/components/responses/AreaCount"
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
 * /v1/admin/area/page-search/{page}:
 *  post:
 *      tags:
 *          - Area
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
 *              $ref: "#/components/responses/Area"
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
 * /v1/admin/area/count-search:
 *  post:
 *      tags:
 *          - Area
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: "#/components/requestBodies/SearchQuery"
 *      responses:
 *          200:
 *              $ref: "#/components/responses/AreaCount"
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
 * /v1/admin/area:
 *  delete:
 *      tags:
 *          - Area
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AreasToDelete'
 *      responses:
 *          200:
 *              description: Area successfuly deleted
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
 *          - Area
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AreaToCreate'
 *      responses:
 *          201:
 *              description: Area successfuly created
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
 *          - Area
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AreaToEdit'
 *      responses:
 *          200:
 *              description: Area successfuly Edited
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
    AreaController.read
);
router.get(
    "/count",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AreaController.count
);

router.post(
    "/page-search/:page",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AreaController.readSearch
);

router.post(
    "/count-search",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AreaController.countSearch
);

router.delete(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AreaController.delete
);
router.patch(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AreaController.update
);
router.post(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AreaController.create
);
module.exports = router;
