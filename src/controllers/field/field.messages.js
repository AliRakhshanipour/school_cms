export const FieldMsg = Object.freeze({
    CREATED: (field, grade) => {
        return `field: ${field} in grade: ${grade} created successfully`
    },
    NOT_FOUND: (fieldId) => {
        return `no field found with this id: ${fieldId}`
    }
})