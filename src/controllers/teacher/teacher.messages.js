export const TeacherMsg = Object.freeze({
  NOT_CREATED: () => {
    return `teacher creation failed`;
  },
  CREATED: (personal_code) => {
    return `teacher: ${personal_code} created successfully`;
  },
  UNIQUE_PERSONAL_CODE: (personal_code) => {
    return `this personal code: ${personal_code} already exists`;
  },
  TEACHER_ID_REQUIRED: () => {
    return `Teacher ID is required`;
  },
  NOT_FOUND: (id) => {
    return `teacher with id: ${id} not found`;
  },
});
