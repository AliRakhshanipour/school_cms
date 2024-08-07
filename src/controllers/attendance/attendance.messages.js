// TODO complete AttendanceMsg
export const AttendanceMsg = Object.freeze({
  NOT_CREATED: () => `Attendance record could not be created`,
  NOT_FOUND_SESSION: (sessionId) =>
    `attendance creation faild, no session found with ID: ${sessionId}`,
  NOT_FOUND_STUDENT: (studentId) =>
    `attendance creation faild, no student found with ID: ${studentId}`,
  NOT_FOUND: (attendanceId) =>
    `Attendance record not found with ID: ${attendanceId}`,
  ATTENDANCE_ID_REQUIRED: () => `Attendance ID is required`,
  ATTENDANCE_UPDATED: (attendanceId) =>
    `Attendance with ID :${attendanceId} updated successfully`,
  ATTENDANCE_DELETED: (attendanceId) =>
    `Attendance with ID :${attendanceId} deleted successfully`,
});
