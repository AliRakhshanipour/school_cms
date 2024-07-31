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
    }
});
