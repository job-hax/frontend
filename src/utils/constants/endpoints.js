const apiRoot = 'https://backend.jobhax.com/';

export const SYNC_USER_EMAILS = `${apiRoot}api/users/sync_user_emails`;

export const GET_JOB_APPS = `${apiRoot}api/jobapps/get_jobapps`;

export const ADD_JOB_APPS = `${apiRoot}api/jobapps/add_jobapp`;

export const GET_STATUS = `${apiRoot}api/api/jobapps/get_statuses`;

export const AUTHENTICATE = `${apiRoot}api/users/auth_social_user`;

export const REGISTER_USER = `${apiRoot}api/users/register`;

export const LOGIN_USER = `${apiRoot}api/users/login`;

export const GET_TOTAL_APPLICATION_COUNT = `${apiRoot}api/metrics/get_total_application_count`;

export const GET_APPLICATION_COUNT_BY_MONTH = `${apiRoot}api/metrics/get_application_count_by_month`;

export const GET_APPLICATION_COUNT_BY_MONTH_WITH_TOTAL = `${apiRoot}api/metrics/get_application_count_by_month_with_total`;

export const GET_COUNT_BY_STATUSES = `${apiRoot}api/metrics/get_count_by_statuses`;

export const GET_COUNT_BY_JOBTITLE_AND_STATUSES = `${apiRoot}api/metrics/get_count_by_jobtitle_and_statuses`;

export const GET_WORD_COUNT = `${apiRoot}api/metrics/get_word_count`;

export const UPDATE_JOB_STATUS = `${apiRoot}api/jobapps/update_jobapp`;

export const UPDATE_NOTE = `${apiRoot}api/jobapps/update_jobapp_note`;

export const ADD_NOTE = `${apiRoot}api/jobapps/add_jobapp_note`;

export const DELETE_NOTE = `${apiRoot}api/jobapps/delete_jobapp_note`;

export const GET_NOTES = `${apiRoot}api/jobapps/get_jobapp_notes`;

export const DELETE_JOB = `${apiRoot}api/jobapps/delete_jobapp`;

