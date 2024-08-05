export const SessionMsg = Object.freeze({
  NOT_FOUND: (sessionId) => `Session not found with ID ${sessionId}`,
  CREATED_SUCCESS: (sessionId) =>
    `Session with ID ${sessionId} created successfully.`,
  OVERLAP_DETECTED: () =>
    'The session time slot overlaps with an existing session.',
  INVALID_DAY: () =>
    'The provided day is invalid. It must be one of Saturday, Sunday, Monday, Tuesday, or Wednesday.',
  MISSING_FIELDS: () =>
    'Required fields are missing. Please provide roomId, day, startTime, and endTime.',
  CLASS_NOT_FOUND: (classId) => `Class with ID ${classId} does not exist.`,
  TEACHER_NOT_FOUND: (teacherId) =>
    `Teacher with ID ${teacherId} does not exist.`,
  INVALID_TIME_SLOT: () =>
    'Invalid time slot format. Please use "HH:MM-HH:MM" format.',
  TIME_SLOT_CONFLICT: () =>
    'Time slot conflict detected. Please choose a different time slot.',
  SUCCESS: () => 'Operation completed successfully.',
  ERROR: () => 'An error occurred during the operation.',
  TEACHER_OVERLAP_DETECTED: (teacherId) =>
    `this teacher: ${teacherId} has already a session in this slot time, choose another teacher`,
  REQUIRED_SESSION_ID: () => `Session ID is required`,
  UPDATED_SUCCESS: (id) => `session ${id} updated successfully`,
  NO_VALID_FIELDS_UPDATE: () => `No valid fields provided for update`,
  DELETED: (sessionId) => `Session with ID ${sessionId} has been deleted.`,
  REQUIRED_TEACHER_ID: () => `teacher id is required`,
  REQUIRED_ROOM_ID: () => `room id is required`,
});
