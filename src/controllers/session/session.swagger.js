/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         roomId:
 *           type: integer
 *           example: 101
 *         day:
 *           type: string
 *           enum: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"]
 *           example: "Monday"
 *         startTime:
 *           type: string
 *           format: time
 *           example: "08:00"
 *         endTime:
 *           type: string
 *           format: time
 *           example: "10:00"
 *         classId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         teacherId:
 *           type: integer
 *           nullable: true
 *           example: 12
 *         lesson:
 *           type: string
 *           nullable: true
 *           example: "Mathematics"
 *     CreateSessionRequest:
 *       type: object
 *       properties:
 *         roomId:
 *           type: integer
 *           description: The ID of the room where the session will take place.
 *           example: 101
 *         day:
 *           type: string
 *           description: The day of the week for the session.
 *           enum:
 *             - Saturday
 *             - Sunday
 *             - Monday
 *             - Tuesday
 *             - Wednesday
 *           example: Monday
 *         startTime:
 *           type: string
 *           description: The start time of the session in HH:mm format.
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "08:00"
 *         endTime:
 *           type: string
 *           description: The end time of the session in HH:mm format.
 *           pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: "10:00"
 *         classId:
 *           type: integer
 *           description: The ID of the class assigned to the session.
 *           example: 5
 *         teacherId:
 *           type: integer
 *           description: The ID of the teacher assigned to the session.
 *           example: 12
 *         lesson:
 *           type: string
 *           description: The lesson name for the session.
 *           example: "Mathematics"
 *     CreateSessionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Session'
 *       required:
 *         - success
 *         - data
 */

/**
 * @swagger
 * /sessions/create:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: integer
 *                 description: The ID of the room where the session will take place.
 *                 example: 101
 *               day:
 *                 type: string
 *                 description: The day of the week for the session.
 *                 enum:
 *                   - Saturday
 *                   - Sunday
 *                   - Monday
 *                   - Tuesday
 *                   - Wednesday
 *                 example: Monday
 *               startTime:
 *                 type: string
 *                 description: The start time of the session in HH:mm format.
 *                 pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *                 example: "08:00"
 *               endTime:
 *                 type: string
 *                 description: The end time of the session in HH:mm format.
 *                 pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *                 example: "10:00"
 *               classId:
 *                 type: integer
 *                 description: The ID of the class assigned to the session.
 *                 example: 5
 *               teacherId:
 *                 type: integer
 *                 description: The ID of the teacher assigned to the session.
 *                 example: 12
 *               lesson:
 *                 type: string
 *                 description: The lesson name for the session.
 *                 example: "Mathematics"
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Bad request due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "roomId is required"
 *                       path:
 *                         type: string
 *                         example: "roomId"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /sessions/{id}:
 *   get:
 *     summary: Retrieve a session by ID with associated data
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the session to retrieve
 *     responses:
 *       200:
 *         description: Session retrieved successfully with associated class, teacher, room data, and student count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     startTime:
 *                       type: string
 *                       format: time
 *                       example: "09:00:00"
 *                     endTime:
 *                       type: string
 *                       format: time
 *                       example: "11:00:00"
 *                     day:
 *                       type: string
 *                       example: Monday
 *                     lesson:
 *                       type: string
 *                       example: Algebra
 *                     Class:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 10
 *                         title:
 *                           type: string
 *                           example: Math 101
 *                         studentCount:
 *                           type: integer
 *                           example: 25
 *                     Teacher:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         personal_code:
 *                           type: string
 *                           example: T1234
 *                     Room:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 101
 *                         number:
 *                           type: string
 *                           example: 101
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Session not found with ID 1"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /sessions/list:
 *   get:
 *     summary: Retrieve all sessions with filtering options
 *     tags: [Sessions]
 *     parameters:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: integer
 *         description: The ID of the room
 *       - in: query
 *         name: roomNumber
 *         schema:
 *           type: string
 *         description: The number of the room
 *       - in: query
 *         name: classId
 *         schema:
 *           type: integer
 *         description: The ID of the class
 *       - in: query
 *         name: classNumber
 *         schema:
 *           type: string
 *         description: The number of the class
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: integer
 *         description: The ID of the teacher
 *       - in: query
 *         name: personalCode
 *         schema:
 *           type: string
 *         description: The personal code of the teacher
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *         description: The ID of the student
 *       - in: query
 *         name: nationalCode
 *         schema:
 *           type: string
 *         description: The national code of the student
 *       - in: query
 *         name: day
 *         schema:
 *           type: string
 *         description: The day of the week
 *         enum: [Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday]
 *       - in: query
 *         name: slotTime
 *         schema:
 *           type: string
 *           pattern: '^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$'
 *         description: The time slot in the format HH:mm-HH:mm
 *     responses:
 *       200:
 *         description: A list of sessions with associated data and student count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       day:
 *                         type: string
 *                         example: Monday
 *                       startTime:
 *                         type: string
 *                         example: 09:00
 *                       endTime:
 *                         type: string
 *                         example: 10:00
 *                       lesson:
 *                         type: string
 *                         example: Math
 *                       studentCount:
 *                         type: integer
 *                         example: 30
 *                       Class:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: Grade 1
 *                       Teacher:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           personal_code:
 *                             type: string
 *                             example: T123
 *                       Room:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           number:
 *                             type: string
 *                             example: R101
 *       400:
 *         description: Bad request due to invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Bad request due to invalid parameters
 *       404:
 *         description: No sessions found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: No sessions found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
