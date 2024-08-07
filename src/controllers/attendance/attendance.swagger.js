/**
 * @swagger
 * /attendances/create:
 *   post:
 *     summary: Create a new attendance record
 *     tags: [Attendances]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 1
 *               sessionId:
 *                 type: integer
 *                 example: 101
 *               status:
 *                 type: string
 *                 enum: [present, delay, absent]
 *                 example: present
 *               delayMinutes:
 *                 type: integer
 *                 example: 5
 *                 description: Required if status is 'delay'
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 1
 *               sessionId:
 *                 type: integer
 *                 example: 101
 *               status:
 *                 type: string
 *                 enum: [present, delay, absent]
 *                 example: present
 *               delayMinutes:
 *                 type: integer
 *                 example: 5
 *                 description: Required if status is 'delay'
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 attendance:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     sessionId:
 *                       type: integer
 *                       example: 101
 *                     status:
 *                       type: string
 *                       example: present
 *                     delayMinutes:
 *                       type: integer
 *                       example: 5
 *                       description: Present only if status is 'delay'
 *       400:
 *         description: Bad request due to validation error
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
 *                   example: studentId is required
 */

/**
 * @swagger
 * /attendances/{id}:
 *   get:
 *     summary: Retrieve an attendance record by ID
 *     tags: [Attendances]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attendance record
 *     responses:
 *       200:
 *         description: The attendance record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 attendance:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     sessionId:
 *                       type: integer
 *                       example: 101
 *                     status:
 *                       type: string
 *                       example: present
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2024-08-07
 *                     delayMinutes:
 *                       type: integer
 *                       example: 5
 *                       description: Present only if status is 'delay'
 *                     student:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         national_code:
 *                           type: string
 *                           example: "1234567890"
 *                         class:
 *                           type: object
 *                           properties:
 *                             number:
 *                               type: integer
 *                               example: 12
 *                     session:
 *                       type: object
 *                       properties:
 *                         lesson:
 *                           type: string
 *                           example: "Mathematics"
 *                         teacher:
 *                           type: object
 *                           properties:
 *                             personal_code:
 *                               type: string
 *                               example: "T123456"
 *       400:
 *         description: Attendance ID is required
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
 *                   example: "Attendance ID is required"
 *       404:
 *         description: Attendance not found
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
 *                   example: "Attendance record not found"
 */

/**
 * @swagger
 * /attendances/list:
 *   get:
 *     summary: Get attendance records with optional filters
 *     tags: [Attendances]
 *     parameters:
 *       - in: query
 *         name: first_name
 *         schema:
 *           type: string
 *         description: Filter by student's first name
 *       - in: query
 *         name: last_name
 *         schema:
 *           type: string
 *         description: Filter by student's last name
 *       - in: query
 *         name: national_code
 *         schema:
 *           type: string
 *         description: Filter by student's national code
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: integer
 *         description: Filter by session's room ID
 *     responses:
 *       200:
 *         description: List of attendance records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 attendances:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                             example: John
 *                           last_name:
 *                             type: string
 *                             example: Doe
 *                           national_code:
 *                             type: string
 *                             example: 1234567890
 *                       session:
 *                         type: object
 *                         properties:
 *                           lesson:
 *                             type: string
 *                             example: Math
 *                           roomId:
 *                             type: integer
 *                             example: 3
 *                       class:
 *                         type: object
 *                         properties:
 *                           number:
 *                             type: string
 *                             example: A1
 *                       teacher:
 *                         type: object
 *                         properties:
 *                           first_name:
 *                             type: string
 *                             example: Jane
 *                           last_name:
 *                             type: string
 *                             example: Smith
 *                           personal_code:
 *                             type: string
 *                             example: 9876543210
 */

/**
 * @swagger
 * /attendances/{id}/update:
 *   patch:
 *     summary: Update an existing attendance record
 *     tags: [Attendances]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the attendance record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [present, delay, absent]
 *                 example: present
 *               delayMinutes:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance record updated successfully
 *                 attendance:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     studentId:
 *                       type: integer
 *                       example: 1
 *                     sessionId:
 *                       type: integer
 *                       example: 101
 *                     status:
 *                       type: string
 *                       example: present
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2023-08-01
 *                     delayMinutes:
 *                       type: integer
 *                       example: 15
 *       400:
 *         description: Bad request due to missing or invalid data
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
 *                   example: Attendance ID is required
 *       404:
 *         description: Attendance record not found
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
 *                   example: Attendance record not found
 */
