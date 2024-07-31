export const RoomMsg = Object.freeze({
    NOT_CREATED: () => {
        return `room creation failed`
    },
    CREATED: (number) => {
        return `room with number: ${number} created successfully`
    },
    ROOM_ID_REQUIRED: () => {
        return `room id is required`
    },
    NOT_FOUND: (roomId) => {
        return `room not found with this id:${roomId}`
    },
    UPDATED: (roomId) => {
        return `room  with this id:${roomId} updated successfully`
    },
    DELETED: (roomId) => {
        return `room  with this id:${roomId} deleted successfully`
    },
})