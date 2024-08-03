export const UserMsg = (username) => {
  return Object.freeze({
    CREATED: `user : ${username} created successfully`,
    UPDATED: `user : ${username} updated successfully`,
    DELETED: `user : ${username} deleted successfully`,
    FETCHED: `user : ${username} found successfully`,
    NOT_FOUND: `user not found`,
    ROLE_CHANGED: (role) => {
      return `user role changed to ${role} successfully`;
    },
    INVALID_ROLE: (role) => {
      return `Invalid role: ${role} provided or missing parameters`;
    },
    NO_FILE_UPLOADED: 'No file was uploaded.',
    PROFILE_PICTURE_UPDATED: 'Profile picture updated successfully.',
  });
};
