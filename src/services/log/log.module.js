import Activity from './schema/log.schema.js'

/**
 * Service for handling user activities.
 */
class ActivityService {
    /**
     * Logs a new activity.
     * @param {number} userId - The ID of the user who performed the action.
     * @param {string} action - A brief description of the action performed.
     * @param {Object} [details={}] - Additional details about the action.
     * @returns {Promise<Activity>} - The created activity record.
     */
    async logActivity(userId, action, details = {}) {
        try {
            const activity = new Activity({
                userId,
                action,
                details,
            });
            return await activity.save();
        } catch (error) {
            throw new Error('Error logging activity: ' + error.message);
        }
    }
}

export default new ActivityService();
