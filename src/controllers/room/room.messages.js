export const RoomMsg = Object.freeze({
    NOT_CREATED: () => {
        return `room creation failed`
    },
    CREATED: (number) => {
        return `room with number: ${number} created successfully`
    }
})