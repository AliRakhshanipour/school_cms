/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         first_name:
 *           type: string
 *           example: John
 *         last_name:
 *           type: string
 *           example: Doe
 *         national_code:
 *           type: string
 *           example: 1234567890
 *         fatehr_name:
 *           type: string
 *           example: Jack
 *         fatehr_job:
 *           type: string
 *           example: Engineer
 *         mother_job:
 *           type: string
 *           example: Teacher
 *         father_education:
 *           type: string
 *           enum: ["diplom", "bachelor", "master", "phd", "others"]
 *           example: bachelor
 *         mother_education:
 *           type: string
 *           enum: ["diplom", "bachelor", "master", "phd", "others"]
 *           example: master
 *         math_grade:
 *           type: string
 *           example: A
 *         avg_grade:
 *           type: string
 *           example: B+
 *         discipline_grade:
 *           type: string
 *           example: A-
 *         studentPicture:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             title:
 *               type: string
 *               example: student-pic-1
 *             url:
 *               type: string
 *               example: /uploads/students/12345.jpg
 *             imageableId:
 *               type: integer
 *               example: 1
 *             imageableType:
 *               type: string
 *               example: student
 *     CreateStudentRequest:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           first_name:
 *             type: string
 *             description: The first name of the student.
 *           last_name:
 *             type: string
 *             description: The last name of the student.
 *           national_code:
 *             type: string
 *             description: The national code of the student.
 *           fatehr_name:
 *             type: string
 *             description: The name of the student's father.
 *           fatehr_job:
 *             type: string
 *             description: The job of the student's father.
 *           mother_job:
 *             type: string
 *             description: The job of the student's mother.
 *           father_education:
 *             type: string
 *             description: The education level of the student's father.
 *             enum: ["diplom", "bachelor", "master", "phd", "others"]
 *           mother_education:
 *             type: string
 *             description: The education level of the student's mother.
 *             enum: ["diplom", "bachelor", "master", "phd", "others"]
 *           math_grade:
 *             type: string
 *             description: The math grade of the student.
 *           avg_grade:
 *             type: string
 *             description: The average grade of the student.
 *           discipline_grade:
 *             type: string
 *             description: The discipline grade of the student.
 *           profilePicture:
 *             type: string
 *             format: binary
 *             description: The profile picture file to upload.
 *     CreateStudentsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         students:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Student'
 *       required:
 *         - success
 *         - students
 */


/**
 * @swagger
 * /students/bulk-create:
 *   post:
 *     summary: Create multiple new students
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Students created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateStudentsResponse'
 *       400:
 *         description: Bad request due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation Error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "first_name is required"
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /students/create:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation Error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "first_name is required"
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


/**
 * @swagger
 * /students/list:
 *   get:
 *     summary: Get a list of students with optional filters
 *     tags: [Students]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of students to return
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: offset
 *         in: query
 *         description: The number of students to skip before starting to collect the result set
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *       - name: national_code
 *         in: query
 *         description: Filter by student's national code
 *         required: false
 *         schema:
 *           type: string
 *       - name: first_name
 *         in: query
 *         description: Filter by student's first name
 *         required: false
 *         schema:
 *           type: string

 *       - name: last_name
 *         in: query
 *         description: Filter by student's last name
 *         required: false
 *         schema:
 *           type: string
 *       - name: min_avg_grade
 *         in: query
 *         description: Minimum average grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *       - name: max_avg_grade
 *         in: query
 *         description: Maximum average grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *       - name: min_math_grade
 *         in: query
 *         description: Minimum math grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *       - name: max_math_grade
 *         in: query
 *         description: Maximum math grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *       - name: min_discipline_grade
 *         in: query
 *         description: Minimum discipline grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *       - name: max_discipline_grade
 *         in: query
 *         description: Maximum discipline grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of students with their associated image URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       first_name:
 *                         type: string
 *                         example: John
 *                       last_name:
 *                         type: string
 *                         example: Doe
 *                       national_code:
 *                         type: string
 *                         example: 1234567890
 *                       fatehr_name:
 *                         type: string
 *                         example: Jack
 *                       fatehr_job:
 *                         type: string
 *                         example: Engineer
 *                       mother_job:
 *                         type: string
 *                         example: Teacher
 *                       father_education:
 *                         type: string
 *                         enum: ["diplom", "bachelor", "master", "phd", "others"]
 *                         example: bachelor
 *                       mother_education:
 *                         type: string
 *                         enum: ["diplom", "bachelor", "master", "phd", "others"]
 *                         example: master
 *                       math_grade:
 *                         type: string
 *                         example: A
 *                       avg_grade:
 *                         type: string
 *                         example: B+
 *                       discipline_grade:
 *                         type: string
 *                         example: A-
 *                       studentPicture:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: student-pic-1
 *                           url:
 *                             type: string
 *                             example: /uploads/students/12345.jpg
 *                           imageableId:
 *                             type: integer
 *                             example: 1
 *                           imageableType:
 *                             type: string
 *                             example: student
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retrieve a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the student to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the student data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 student:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     national_code:
 *                       type: string
 *                       example: 1234567890
 *                     father_name:
 *                       type: string
 *                       example: Jack
 *                     father_job:
 *                       type: string
 *                       example: Engineer
 *                     mother_job:
 *                       type: string
 *                       example: Teacher
 *                     father_education:
 *                       type: string
 *                       example: bachelor
 *                     mother_education:
 *                       type: string
 *                       example: master
 *                     math_grade:
 *                       type: string
 *                       example: A
 *                     avg_grade:
 *                       type: string
 *                       example: B+
 *                     discipline_grade:
 *                       type: string
 *                       example: A-
 *                     studentPicture:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         title:
 *                           type: string
 *                           example: student-pic-1
 *                         url:
 *                           type: string
 *                           example: /uploads/students/12345.jpg
 *                         imageableId:
 *                           type: integer
 *                           example: 1
 *                         imageableType:
 *                           type: string
 *                           example: student
 *       404:
 *         description: Student not found.
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
 *                   example: Student not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */


/**
 * @swagger
 * /students/{id}/update:
 *   patch:
 *     summary: Update student details and profile picture
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student to update
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: The first name of the student.
 *               last_name:
 *                 type: string
 *                 description: The last name of the student.
 *               national_code:
 *                 type: string
 *                 description: The national code of the student.
 *               father_name:
 *                 type: string
 *                 description: The name of the student's father.
 *               father_job:
 *                 type: string
 *                 description: The job of the student's father.
 *               mother_job:
 *                 type: string
 *                 description: The job of the student's mother.
 *               father_education:
 *                 type: string
 *                 description: The education level of the student's father.
 *                 enum:
 *                   - diplom
 *                   - bachelor
 *                   - master
 *                   - phd
 *                   - others
 *               mother_education:
 *                 type: string
 *                 description: The education level of the student's mother.
 *                 enum:
 *                   - diplom
 *                   - bachelor
 *                   - master
 *                   - phd
 *                   - others
 *               math_grade:
 *                 type: string
 *                 description: The math grade of the student.
 *               avg_grade:
 *                 type: string
 *                 description: The average grade of the student.
 *               discipline_grade:
 *                 type: string
 *                 description: The discipline grade of the student.
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: The new profile picture file to upload.
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 student:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     national_code:
 *                       type: string
 *                     father_name:
 *                       type: string
 *                     father_job:
 *                       type: string
 *                     mother_job:
 *                       type: string
 *                     father_education:
 *                       type: string
 *                     mother_education:
 *                       type: string
 *                     math_grade:
 *                       type: string
 *                     avg_grade:
 *                       type: string
 *                     discipline_grade:
 *                       type: string
 *                     studentPicture:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                         title:
 *                           type: string
 *                         url:
 *                           type: string
 *                         imageableId:
 *                           type: integer
 *                         imageableType:
 *                           type: string
 *       400:
 *         description: Bad request due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       path:
 *                         type: array
 *                         items:
 *                           type: string
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 message:
 *                   type: string
 */

/**
* @swagger
* /students/{id}/delete:
*   delete:
*     summary: Delete a student by ID
*     tags: [Students]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: integer
*         required: true
*         description: The user ID
*         example: 1
*     responses:
*       204:
*         description: Student deleted successfully
*       404:
*         description: Student not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 404
*                 message:
*                   type: string
*                   example: Student not found
*       401:
*         description: Unauthorized - User is not authenticated.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 401
*                 message:
*                   type: string
*                   example: User is not authenticated.
*       403:
*         description: Forbidden - User does not have permission to delete this student.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 403
*                 message:
*                   type: string
*                   example: Access denied. You do not have permission to delete this Student.
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: integer
*                   example: 500
*                 message:
*                   type: string
*                   example: Internal server error
*/


/**
 * @swagger
 * /students/student-create:
 *   post:
 *     summary: Create a new student with signup route
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request due to validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Validation Error
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         example: "first_name is required"
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
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

