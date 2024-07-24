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
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: The first name of the student.
 *           example: John
 *         last_name:
 *           type: string
 *           description: The last name of the student.
 *           example: Doe
 *         national_code:
 *           type: string
 *           description: The national code of the student.
 *           example: 1234567890
 *         fatehr_name:
 *           type: string
 *           description: The name of the student's father.
 *           example: Jack
 *         fatehr_job:
 *           type: string
 *           description: The job of the student's father.
 *           example: Engineer
 *         mother_job:
 *           type: string
 *           description: The job of the student's mother.
 *           example: Teacher
 *         father_education:
 *           type: string
 *           description: The education level of the student's father.
 *           enum: ["diplom", "bachelor", "master", "phd", "others"]
 *           example: bachelor
 *         mother_education:
 *           type: string
 *           description: The education level of the student's mother.
 *           enum: ["diplom", "bachelor", "master", "phd", "others"]
 *           example: master
 *         math_grade:
 *           type: string
 *           description: The math grade of the student.
 *           example: A
 *         avg_grade:
 *           type: string
 *           description: The average grade of the student.
 *           example: B+
 *         discipline_grade:
 *           type: string
 *           description: The discipline grade of the student.
 *           example: A-
 *         profilePicture:
 *           type: string
 *           format: binary
 *           description: The profile picture file to upload.
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
 * /students:
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
 *           example: 1234567890
 *       - name: first_name
 *         in: query
 *         description: Filter by student's first name
 *         required: false
 *         schema:
 *           type: string
 *           example: John
 *       - name: last_name
 *         in: query
 *         description: Filter by student's last name
 *         required: false
 *         schema:
 *           type: string
 *           example: Doe
 *       - name: min_avg_grade
 *         in: query
 *         description: Minimum average grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *           example: B
 *       - name: max_avg_grade
 *         in: query
 *         description: Maximum average grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *           example: A
 *       - name: min_math_grade
 *         in: query
 *         description: Minimum math grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *           example: B
 *       - name: max_math_grade
 *         in: query
 *         description: Maximum math grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *           example: A
 *       - name: min_discipline_grade
 *         in: query
 *         description: Minimum discipline grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *           example: B
 *       - name: max_discipline_grade
 *         in: query
 *         description: Maximum discipline grade to filter by
 *         required: false
 *         schema:
 *           type: string
 *           example: A
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