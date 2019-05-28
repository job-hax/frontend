export const apiRoot = "https://backend.jobhax.com";

export const SYNC_USER_EMAILS = `${apiRoot}/api/users/sync_user_emails`;

export const GET_JOB_APPS = `${apiRoot}/api/jobapps/get_jobapps`;

export const ADD_JOB_APPS = `${apiRoot}/api/jobapps/add_jobapp`;

export const GET_STATUS = `${apiRoot}/api//api/jobapps/get_statuses`;

export const AUTHENTICATE = `${apiRoot}/api/users/auth_social_user`;

export const REGISTER_USER = `${apiRoot}/api/users/register`;

export const REFRESH_JOBHAX_TOKEN = `${apiRoot}/api/users/refresh_token`;

export const UPDATE_GOOGLE_TOKEN = `${apiRoot}/api/users/update_gmail_token`;

export const LOGIN_USER = `${apiRoot}/api/users/login`;

export const LOGOUT_USER = `${apiRoot}/api/users/logout`;

export const GET_TOTAL_APPLICATION_COUNT = `${apiRoot}/api/metrics/get_total_application_count`;

export const GET_APPLICATION_COUNT_BY_MONTH = `${apiRoot}/api/metrics/get_application_count_by_month`;

export const GET_APPLICATION_COUNT_BY_MONTH_WITH_TOTAL = `${apiRoot}/api/metrics/get_application_count_by_month_with_total`;

export const GET_COUNT_BY_STATUSES = `${apiRoot}/api/metrics/get_count_by_statuses`;

export const GET_COUNT_BY_JOBTITLE_AND_STATUSES = `${apiRoot}/api/metrics/get_count_by_jobtitle_and_statuses`;

export const GET_WORD_COUNT = `${apiRoot}/api/metrics/get_word_count`;

export const GET_TOP_COMPANIES = `/api/metrics/get_top_companies`;

export const GET_TOP_POSITIONS = `/api/metrics/get_top_positions`;

export const GET_STATISTICS = `${apiRoot}/api/metrics/get_statistics`;

export const GET_MONTHLY_APPLICATION_COUNT = `${apiRoot}/api/metrics/get_monthly_application_count`;

export const UPDATE_JOB_STATUS = `${apiRoot}/api/jobapps/update_jobapp`;

export const UPDATE_NOTE = `${apiRoot}/api/jobapps/update_jobapp_note`;

export const ADD_NOTE = `${apiRoot}/api/jobapps/add_jobapp_note`;

export const DELETE_NOTE = `${apiRoot}/api/jobapps/delete_jobapp_note`;

export const GET_NOTES = `${apiRoot}/api/jobapps/get_jobapp_notes`;

export const DELETE_JOB = `${apiRoot}/api/jobapps/delete_jobapp`;

export const GET_POLL = `${apiRoot}/api/poll/`;

export const VOTE_POLL = pollId => `${apiRoot}/api/poll/${pollId}/vote/`;

export const NOTIFICATIONS = `${apiRoot}/api/notifications/`;

export const UPDATE_PROFILE_PHOTO = `${apiRoot}/api/users/update_profile_photo`;

export const GET_PROFILE = `${apiRoot}/api/users/get_profile`;

export const GET_EMPLOYMENT_STATUSES = `${apiRoot}/api/users/get_employment_statuses`;

export const UPDATE_PROFILE = `${apiRoot}/api/users/update_profile`;

export const FEEDBACK = `${apiRoot}/api/users/feedback`;

export const REVIEW_SUBMIT = `${apiRoot}/api/reviews/add_or_update`;

export const GET_SOURCE_TYPES = `${apiRoot}/api/reviews/get_source_types`;

export const GET_EMPLOYMENT_AUTHS = `${apiRoot}/api/users/get_employment_auths`;

export const GET_REVIEWS = `${apiRoot}/api/reviews/get_reviews`;

export const GET_FAQS = `${apiRoot}/api/faqs`;

export const GET_BLOGS = `${apiRoot}/api/blogs`;

export const GET_OR_POST_BLOG = blogId => `${apiRoot}/api/blogs/${blogId}`;

export const GET_AGREEMENTS = `${apiRoot}/api/agreements/`;

export const GET_COMPANIES = `${apiRoot}/api/companies/`;

export const USERS = type => `${apiRoot}/api/users/${type}`;

export const POSITIONS = `${apiRoot}/api/positions/`;

export const METRICS = type => `${apiRoot}/api/metrics/${type}`;
