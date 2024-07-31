export const ClassMsg = Object.freeze({
    NOT_CREATED: () => {
        return 'Class creation failed';
    },
    CREATED: (number) => {
        return `Class with number: ${number} created successfully`;
    },
    CLASS_ID_REQUIRED: () => {
        return 'Class ID is required';
    },
    NOT_FOUND: (classId) => {
        return `Class not found with this ID: ${classId}`;
    },
    UPDATED: (classId) => {
        return `Class with this ID: ${classId} updated successfully`;
    },
    DELETED: (classId) => {
        return `Class with this ID: ${classId} deleted successfully`;
    },
    EXISTS: (number) => {
        return `Class with this number: ${number} already exists. Please choose another number.`;
    },
    NUMBER_CONFLICT: (number) => {
        return `Another class with number: ${number} already exists. Please choose another number.`;
    },
    CAPACITY_UPDATED: (classId, newCapacity) => {
        return `Capacity of class with ID ${classId} updated to ${newCapacity}.`;
    },
    INVALID_CAPACITY: () => {
        return 'Invalid capacity. It must be a positive integer.';
    },
    STUDENT_ADDED: (classId) => {
        return `Students added to class with ID ${classId}.`;
    },
    STUDENT_ALREADY_ENROLLED: (studentId, classId) => {
        return `Student with ID ${studentId} is already enrolled in class ${classId}.`;
    },
    INVALID_INPUT: () => {
        return "Invalid input. 'studentIds' and 'nationalCodes' must be arrays.";
    },
    STUDENT_NOT_FOUND: (identifier) => {
        return `Student with ID or national code ${identifier} not found.`;
    }
});