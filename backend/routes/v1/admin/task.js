const router = require("express").Router();
const TaskController = require("../../../controller/admin/task");
const AuthMiddleware = require("../../../middleware/auth");
const RoleMiddleware = require("../../../middleware/role");

/**
 * @swagger
 * /v1/admin/task/page/{page}:
 *  get:
 *      tags:
 *          - Task
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
 *              $ref: "#/components/responses/Task"
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
 * /v1/admin/task/count:
 *  get:
 *      tags:
 *          - Task
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: "#/components/responses/TaskCount"
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
 * /v1/admin/task/page-search/{page}:
 *  post:
 *      tags:
 *          - Task
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
 *              $ref: "#/components/responses/Task"
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
 * /v1/admin/task/count-search:
 *  post:
 *      tags:
 *          - Task
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: "#/components/requestBodies/SearchQuery"
 *      responses:
 *          200:
 *              $ref: "#/components/responses/TaskCount"
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
 * /v1/admin/task:
 *  delete:
 *      tags:
 *          - Task
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/TasksToDelete'
 *      responses:
 *          200:
 *              description: Task successfuly deleted
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
 *          - Task
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/TaskToCreate'
 *      responses:
 *          201:
 *              description: Task successfuly created
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
 *          - Task
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          $ref: '#/components/requestBodies/TaskToEdit'
 *      responses:
 *          200:
 *              description: Task successfuly Edited
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
    TaskController.read
);
router.get(
    "/count",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    TaskController.count
);

router.post(
    "/page-search/:page",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    TaskController.readSearch
);

router.post(
    "/count-search",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    TaskController.countSearch
);

router.delete(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    TaskController.delete
);
router.patch(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    TaskController.update
);
router.post(
    "/",
    AuthMiddleware.auth,
    RoleMiddleware.isSuperAdmin,
    TaskController.create
);
module.exports = router;
