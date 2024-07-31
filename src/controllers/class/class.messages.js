export const ClassMsg = Object.freeze({
    NOT_CREATED: () => {
        return `class creation failed`
    },
    CREATED: (number) => {
        return `class with number: ${number} created successfully`
    },
    CLASS_ID_REQUIRED: () => {
        return `class id is required`
    },
    NOT_FOUND: (classId) => {
        return `class not found with this id:${classId}`
    },
    UPDATED: (classId) => {
        return `class  with this id:${classId} updated successfully`
    },
    DELETED: (classId) => {
        return `class with this id:${classId} deleted successfully`
    },
    EXISTS: (number) => {
        return `class with this id:${number} already exists`
    },
})