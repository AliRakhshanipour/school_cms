import mongoose from "mongoose";

/**
 * Schema for user activity logs in MongoDB.
 * @typedef {Object} Activity
 * @property {number} userId - The ID of the user who performed the action. This should be an integer that matches the PostgreSQL user ID.
 * @property {string} action - A brief description of the action performed by the user.
 * @property {Object} [details={}] - Additional details about the action performed. Can be any JSON-serializable object.
 * @property {Date} [timestamp=Date.now] - The timestamp of when the action was performed. Defaults to the current date and time.
 */
const activitySchema = new mongoose.Schema({
    userId: {
        type: Number, // Use Number for integer values
        required: true,
        description: 'The ID of the user who performed the action. Should match the integer ID used in PostgreSQL.'
    },
    action: {
        type: String,
        required: true,
        description: 'A brief description of the action performed by the user.'
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
        description: 'Additional details about the action performed. Can be any JSON-serializable object.'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        description: 'Timestamp of when the action was performed.'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

/**
 * The Activity model represents a record of user actions and interactions in the system.
 * @type {mongoose.Model<Activity>}
 */
const Activity = mongoose.model('Activity', activitySchema);

export default Activity;