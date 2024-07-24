export const StudentMsg = Object.freeze({
    CREATED: (first_name, last_name) => {
        return `student: ${first_name} ${last_name} created successfully`
    },
    UNIQUE_NATIONAL_CODE: (national_code) => {
        return `this national code: ${national_code} already exists`
    },
})