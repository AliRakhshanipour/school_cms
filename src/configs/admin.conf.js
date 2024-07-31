// admin.config.js
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSSequelize from '@adminjs/sequelize';
import { models } from '../models/index.js';


AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
});

// Define AdminJS options with models and their associations
export const adminOptions = {
    resources: [
        {
            resource: models.User,
            options: {
                // Customize admin panel for the User model
                properties: {
                    id: { isVisible: true },
                    username: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    email: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    phone: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    role: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    isSuperuser: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    otp: { isVisible: { list: false, filter: false, show: true, edit: true } },
                    otpExpiry: { isVisible: { list: false, filter: false, show: true, edit: true } },
                    activity: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    profilePicture: { isVisible: { list: false, filter: false, show: true, edit: false } },
                },
            }
        },
        {
            resource: models.Teacher,
            options: {
                // Customize admin panel for the Teacher model
                properties: {
                    id: { isVisible: true },
                    first_name: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    last_name: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    personal_code: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    phone: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    email: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    hire_date: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    is_active: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    subject_specialization: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    date_of_birth: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    teacherPicture: { isVisible: { list: false, filter: false, show: true, edit: false } },
                }
            }
        },
        {
            resource: models.Student,
            options: {
                // Customize admin panel for the Student model
                properties: {
                    id: { isVisible: true },
                    first_name: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    last_name: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    national_code: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    fatehr_name: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    fatehr_job: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    mother_job: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    father_education: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    mother_education: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    math_grade: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    avg_grade: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    discipline_grade: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    classId: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    studentPicture: { isVisible: { list: false, filter: false, show: true, edit: false } },
                }
            }
        },
        {
            resource: models.Room,
            options: {
                // Customize admin panel for the Room model
                properties: {
                    id: { isVisible: true },
                    title: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    number: { isVisible: { list: true, filter: true, show: true, edit: true } },
                }
            }
        },
        {
            resource: models.Image,
            options: {
                // Customize admin panel for the Image model
                properties: {
                    id: { isVisible: true },
                    title: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    url: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    imageableId: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    imageableType: { isVisible: { list: true, filter: true, show: true, edit: true } },
                }
            }
        },
        {
            resource: models.Field,
            options: {
                // Customize admin panel for the Field model
                properties: {
                    id: { isVisible: true },
                    title: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    short_text: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    grade: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    description: { isVisible: { list: true, filter: true, show: true, edit: true } },
                }
            }
        },
        {
            resource: models.Class,
            options: {
                // Customize admin panel for the Class model
                properties: {
                    id: { isVisible: true },
                    title: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    number: { isVisible: { list: true, filter: true, show: true, edit: true } },
                    capacity: { isVisible: { list: true, filter: true, show: true, edit: true } },
                }
            }
        },
    ],
    dashboard: {
        // component: AdminJS.bundle('./my-dashboard-component'),
    },
    rootPath: '/admin',
};

export default adminOptions;
