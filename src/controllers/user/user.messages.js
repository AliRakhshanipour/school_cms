export const UserMsg = (username) => {
    return Object.freeze({
        CREATED: `user : ${username} created successfully`,
        UPDATED: `user : ${username} updated successfully`,
        DELETED: `user : ${username} deleted successfully`,
        FETCHED: `user : ${username} found successfully`,
        NOT_FOUND: `user not found`,
    })
}