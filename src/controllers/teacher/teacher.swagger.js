/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         first_name:
 *           type: string
 *           example: "Jane"
 *           description: The first name of the teacher.
 *         last_name:
 *           type: string
 *           example: "Doe"
 *           description: The last name of the teacher.
 *         personal_code:
 *           type: string
 *           example: "PC123456"
 *           description: The unique personal code of the teacher.
 *         phone:
 *           type: string
 *           example: "1234567890"
 *           description: The phone number of the teacher.
 *         email:
 *           type: string
 *           example: "jane.doe@example.com"
 *           description: The email address of the teacher.
 *         hire_date:
 *           type: string
 *           format: date
 *           example: "2023-01-15"
 *           description: The date the teacher was hired.
 *         is_active:
 *           type: boolean
 *           example: true
 *           description: Indicates whether the teacher is currently active.
 *         subject_specialization:
 *           type: string
 *           example: "Mathematics"
 *           description: The subject the teacher specializes in.
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: "1985-05-20"
 *           description: The date of birth of the teacher.
 *         teacherPicture:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             title:
 *               type: string
 *               example: "teacher-pic-1"
 *             url:
 *               type: string
 *               example: "/uploads/teachers/12345.jpg"
 *             imageableId:
 *               type: integer
 *               example: 1
 *             imageableType:
 *               type: string
 *               example: "teacher"
 *     CreateTeacherRequest:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - personal_code
 *         - phone
 *         - email
 *         - hire_date
 *       properties:
 *         first_name:
 *           type: string
 *           description: The first name of the teacher.
 *         last_name:
 *           type: string
 *           description: The last name of the teacher.
 *         personal_code:
 *           type: string
 *           description: The unique personal code of the teacher.
 *         phone:
 *           type: string
 *           description: The phone number of the teacher.
 *         email:
 *           type: string
 *           description: The email address of the teacher.
 *         hire_date:
 *           type: string
 *           format: date
 *           description: The date the teacher was hired.
 *         subject_specialization:
 *           type: string
 *           description: The subject the teacher specializes in.
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: The date of birth of the teacher.
 *         profilePicture:
 *           type: string
 *           format: binary
 *           description: The profile picture file to upload.
 */

/**
 * @swagger
 * /teachers/create:
 *   post:
 *     summary: Create a new teacher
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The first name of the teacher.
 *               last_name:
 *                 type: string
 *                 description: The last name of the teacher.
 *               personal_code:
 *                 type: string
 *                 description: The unique personal code of the teacher.
 *               phone:
 *                 type: string
 *                 description: The phone number of the teacher.
 *               email:
 *                 type: string
 *                 description: The email address of the teacher.
 *               hire_date:
 *                 type: string
 *                 format: date
 *                 description: The date the teacher was hired.
 *               subject_specialization:
 *                 type: string
 *                 description: The subject the teacher specializes in.
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 description: The date of birth of the teacher.
 *               teacherPicture:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture file to upload.
 *     responses:
 *       201:
 *         description: Teacher created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 teacher:
 *                   $ref: '#/components/schemas/Teacher'
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
 *                   example: "Validation Error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "First name cannot be empty"
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "first_name"
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
 * /teachers/list:
 *   get:
 *     summary: Retrieve a list of teachers
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve (default is 1).
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         description: The number of records per page (default is 10).
 *         schema:
 *           type: integer
 *       - in: query
 *         name: first_name
 *         required: false
 *         description: Filter by the first name of the teacher (partial match).
 *         schema:
 *           type: string
 *       - in: query
 *         name: last_name
 *         required: false
 *         description: Filter by the last name of the teacher (partial match).
 *         schema:
 *           type: string
 *       - in: query
 *         name: personal_code
 *         required: false
 *         description: Filter by the unique personal code of the teacher (exact match).
 *         schema:
 *           type: string
 *       - in: query
 *         name: is_active
 *         required: false
 *         description: Filter by the active status of the teacher (true or false).
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: A list of teachers with pagination information
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
 *                     $ref: '#/components/schemas/Teacher'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
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
 * /teachers/{id}:
 *   get:
 *     summary: Retrieve a specific teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the teacher to retrieve
 *     responses:
 *       200:
 *         description: A teacher object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Bad request
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
 *                   example: "Teacher ID is required"
 *       404:
 *         description: Teacher not found
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
 *                   example: "Teacher not found"
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
 * /teachers/{id}/update:
 *   patch:
 *     summary: Update a specific teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the teacher to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               personal_code:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *               teacherPicture:
 *                 type: string
 *                 format: binary
 *                 description: New image file
 *     responses:
 *       200:
 *         description: The updated teacher object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: Bad request
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
 *                   example: "Teacher ID is required"
 *       404:
 *         description: Teacher not found
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
 *                   example: "Teacher not found"
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
 * /teachers/{id}/delete:
 *   delete:
 *     summary: Delete a specific teacher by ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the teacher to delete
 *     responses:
 *       200:
 *         description: Teacher deleted successfully
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
 *                   example: "Teacher with ID {teacherId} has been deleted."
 *       404:
 *         description: Teacher not found
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
 *                   example: "Teacher not found"
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
