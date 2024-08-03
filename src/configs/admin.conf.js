// src/admin.config.js
import * as AdminJSSequelize from '@adminjs/sequelize';
import AdminJS from 'adminjs';
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
        label: 'کاربر', // Farsi name for the User model
        properties: {
          id: { isVisible: true, label: 'شناسه' },
          username: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نام کاربری',
          },
          email: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'ایمیل',
          },
          phone: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'تلفن',
          },
          role: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نقش',
          },
          isSuperuser: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'سوپر کاربر',
          },
          otp: {
            isVisible: { list: false, filter: false, show: true, edit: true },
            label: 'کد تایید',
          },
          otpExpiry: {
            isVisible: { list: false, filter: false, show: true, edit: true },
            label: 'تاریخ انقضای کد تایید',
          },
          activity: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'فعالیت',
          },
          profilePicture: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            label: 'تصویر پروفایل',
          },
        },
      },
    },
    {
      resource: models.Teacher,
      options: {
        // Customize admin panel for the Teacher model
        label: 'معلم', // Farsi name for the Teacher model
        properties: {
          id: { isVisible: true, label: 'شناسه' },
          first_name: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نام',
          },
          last_name: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نام خانوادگی',
          },
          personal_code: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'کد ملی',
          },
          phone: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'تلفن',
          },
          email: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'ایمیل',
          },
          hire_date: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'تاریخ استخدام',
          },
          is_active: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'وضعیت',
          },
          subject_specialization: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'تخصص',
          },
          date_of_birth: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'تاریخ تولد',
          },
          teacherPicture: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            label: 'تصویر معلم',
          },
        },
      },
    },
    {
      resource: models.Student,
      options: {
        // Customize admin panel for the Student model
        label: 'دانش‌آموز', // Farsi name for the Student model
        properties: {
          id: { isVisible: true, label: 'شناسه' },
          first_name: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نام',
          },
          last_name: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نام خانوادگی',
          },
          national_code: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'کد ملی',
          },
          fatehr_name: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نام پدر',
          },
          fatehr_job: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'شغل پدر',
          },
          mother_job: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'شغل مادر',
          },
          father_education: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'تحصیلات پدر',
          },
          mother_education: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'تحصیلات مادر',
          },
          math_grade: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نمره ریاضی',
          },
          avg_grade: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'میانگین نمرات',
          },
          discipline_grade: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نمره انضباط',
          },
          classId: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'شناسه کلاس',
          },
          studentPicture: {
            isVisible: { list: false, filter: false, show: true, edit: false },
            label: 'تصویر دانش‌آموز',
          },
        },
      },
    },
    {
      resource: models.Room,
      options: {
        // Customize admin panel for the Room model
        label: 'اتاق', // Farsi name for the Room model
        properties: {
          id: { isVisible: true, label: 'شناسه' },
          title: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'عنوان',
          },
          number: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'شماره',
          },
        },
      },
    },
    {
      resource: models.Image,
      options: {
        // Customize admin panel for the Image model
        label: 'تصویر', // Farsi name for the Image model
        properties: {
          id: { isVisible: true, label: 'شناسه' },
          title: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'عنوان',
          },
          url: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'آدرس',
          },
          imageableId: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'شناسه تصویرپذیر',
          },
          imageableType: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نوع تصویرپذیر',
          },
        },
      },
    },
    {
      resource: models.Field,
      options: {
        // Customize admin panel for the Field model
        label: 'فیلد', // Farsi name for the Field model
        properties: {
          id: { isVisible: true, label: 'شناسه' },
          title: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'عنوان',
          },
          short_text: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'متن کوتاه',
          },
          grade: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'نمره',
          },
          description: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'توضیحات',
          },
        },
      },
    },
    {
      resource: models.Class,
      options: {
        // Customize admin panel for the Class model
        label: 'کلاس', // Farsi name for the Class model
        properties: {
          id: { isVisible: true, label: 'شناسه' },
          title: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'عنوان',
          },
          number: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'شماره',
          },
          capacity: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            label: 'ظرفیت',
          },
        },
      },
    },
  ],
  dashboard: {
    // component: AdminJS.bundle('./my-dashboard-component'),
  },
  rootPath: '/admin',
};

export default adminOptions;
