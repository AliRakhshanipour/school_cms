export const TeacherMsg = Object.freeze({
  NOT_CREATED: 'Teacher creation failed',
  CREATED: (personal_code) =>
    `Teacher with personal code ${personal_code} created successfully`,
  UNIQUE_PERSONAL_CODE: (personal_code) =>
    `The personal code ${personal_code} already exists`,
  TEACHER_ID_REQUIRED: 'Teacher ID is required',
  NOT_FOUND: (id) => `Teacher with ID ${id} not found`,
});
