/**
 * @swagger
 * /fields/create:
 *   post:
 *     summary: Create a new field with associated images
 *     tags: [Fields]
 *     requestBody:
 *       required: true
 *       content:
 *        multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 enum: 
 *                   - 'برق ساختمان'
 *                   - 'نصب و تعمیر آسانسور'
 *                   - 'برق صنعتی'
 *                   - 'مکانیک خودرو'
 *                   - 'صنایع چوب و مبلمان'
 *               short_text:
 *                 type: string
 *               grade:
 *                 type: string
 *                 enum: 
 *                   - 'دهم'
 *                   - 'یازدهم'
 *                   - 'دوازدهم'
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Field created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 field:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     short_text:
 *                       type: string
 *                     grade:
 *                       type: string
 *                     description:
 *                       type: string
 *                     images:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           url:
 *                             type: string
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
 */

/**
 * @swagger
 * /fields/list:
 *   get:
 *     summary: Get a list of fields with optional filters
 *     tags: [Fields]
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Number of fields to return
 *         required: false
 *         schema:
 *           type: integer
 *       - name: offset
 *         in: query
 *         description: The number of fields to skip before starting to collect the result set
 *         required: false
 *         schema:
 *           type: integer
 *       - name: title
 *         in: query
 *         description: Filter by field's title
 *         required: false
 *         schema:
 *           type: string
 *           enum: 
 *             - 'برق ساختمان'
 *             - 'نصب و تعمیر آسانسور'
 *             - 'برق صنعتی'
 *             - 'مکانیک خودرو'
 *             - 'صنایع چوب و مبلمان'
 *       - name: grade
 *         in: query
 *         description: Filter by field's grade
 *         required: false
 *         schema:
 *           type: string
 *           enum: 
 *             - 'دهم'
 *             - 'یازدهم'
 *             - 'دوازدهم'
 *     responses:
 *       200:
 *         description: A list of fields with their associated image URLs
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
 *                       title:
 *                         type: string
 *                         example: عنوان رشته
 *                       short_text:
 *                         type: string
 *                         example: متن کوتاه
 *                       grade:
 *                         type: string
 *                         example: پایه کلاس
 *                       description:
 *                         type: string
 *                         example: توضیحات رشته
 *                       fieldPicture:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           url:
 *                             type: string
 *                             example: /uploads/fields/12345.jpg
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
 * /fields/{id}:
 *   get:
 *     summary: Retrieve a field by ID
 *     tags: [Fields]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the field to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the field data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: عنوان رشته
 *                 short_text:
 *                   type: string
 *                   example: متن کوتاه
 *                 grade:
 *                   type: string
 *                   example: پایه کلاس
 *                 description:
 *                   type: string
 *                   example: توضیحات رشته
 *                 fieldPicture:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: /uploads/fields/12345.jpg
 *       404:
 *         description: Field not found.
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
 *                   example: Field not found.
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
