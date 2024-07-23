/**
 * @swagger
 * tags:
 *   - name: Logger
 *     description: Endpoints related to logging and user activity tracking
 */

/**
 * @swagger
 * /logs/activities/user/{id}:
 *   get:
 *     summary: Retrieves activities by user ID
 *     description: Retrieves a list of activities performed by a specific user, sorted by timestamp in descending order.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user whose activities are to be retrieved.
 *     responses:
 *       '200':
 *         description: A list of activities for the given user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       '404':
 *         description: User not found or no activities for the given user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found or no activities for the given user."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving activities: <error-message>"
 *     security:
 *       - JwtAuth: []
 *     tags:
 *       - Logger
 */

/**
 * @swagger
 * /logs/activities:
 *   get:
 *     summary: Retrieves all activities
 *     description: Retrieves a list of all activities performed by users, sorted by timestamp in descending order.
 *     responses:
 *       '200':
 *         description: A list of all activities.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving activities: <error-message>"
 *     security:
 *       - JwtAuth: []
 *     tags:
 *       - Logger
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           description: The ID of the user who performed the action.
 *         action:
 *           type: string
 *           description: A brief description of the action performed.
 *         details:
 *           type: object
 *           description: Additional details about the action.
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the action was performed.
 *       example:
 *         userId: 1
 *         action: User logged in
 *         details: {}
 *         timestamp: '2024-07-23T12:00:00Z'
 */
