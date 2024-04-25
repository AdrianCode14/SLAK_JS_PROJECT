const router = require("express").Router();
const AffiliationController = require("../../../controller/admin/affiliation");
const AuthMiddleware = require("../../../middleware/auth");
const RoleMiddleware = require("../../../middleware/role");

/**
 * @swagger
 * /v1/admin/affiliation/page/{page}:
 *  get:
 *      tags:
 *          - Affiliation
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
 *              $ref: "#/components/responses/Affiliation"
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
 * /v1/admin/affiliation/count:
 *  get:
 *      tags:
 *          - Affiliation
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: "#/components/responses/AffiliationCount"
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
 * /v1/admin/affiliation/page-search/{page}:
 *  post:
 *      tags:
 *          - Affiliation
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
 *              $ref: "#/components/responses/Affiliation"
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
 * /v1/admin/affiliation/count-search:
 *  post:
 *      tags:
 *          - Affiliation
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: "#/components/requestBodies/SearchQuery"
 *      responses:
 *          200:
 *              $ref: "#/components/responses/AffiliationCount"
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
 * /v1/admin/affiliation:
 *  delete:
 *      tags:
 *          - Affiliation
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AffiliationsToDelete'
 *      responses:
 *          200:
 *              description: Affiliation successfuly deleted
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
 *          - Affiliation
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AffiliationToCreate'
 *      responses:
 *          201:
 *              description: Affiliation successfuly created
 *          400:
 *              description: User is invalid or the body passed is invalid
 *          403:
 *              description: User is not admin
 *          404:
 *              description: JWT token header not found
 *          401:
 *              description: Token is invalid or user does not exist
 *          409:
 *              description: Affiliation already exist
 *          5XX:
 *              description: Unexpected server error
 *
 *  patch:
 *      tags:
 *          - Affiliation
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/AffiliationToEdit'
 *      responses:
 *          200:
 *              description: Affiliation successfuly Edited
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
    AffiliationController.read
);
router.get(
    "/count",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AffiliationController.count
);

router.post(
    "/page-search/:page",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AffiliationController.readSearch
);

router.post(
    "/count-search",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AffiliationController.countSearch
);

router.delete(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AffiliationController.delete
);
router.patch(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AffiliationController.update
);
router.post(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    AffiliationController.create
);
module.exports = router;
