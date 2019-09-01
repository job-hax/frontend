export const apiRoot = "https://backend.jobhax.com"; //"http://10.0.0.75:8000"; //"http://0.0.0.0:8000";

//USER REQUESTS//
export const USERS = type => `${apiRoot}/api/users/${type}/`;

//JOB_APPS REQUESTS//
export const JOB_APPS = `${apiRoot}/api/jobapps/`;

export const GET_SOURCES = `${apiRoot}/api/jobapps/sources/`;

export const GET_STATUSES = `${apiRoot}/api/jobapps/statuses/`;

export const CONTACTS = jobappId =>
  `${apiRoot}/api/jobapps/${jobappId}/contacts/`;

export const GET_NEW_JOBAPPS = timestamp =>
  `${apiRoot}/api/jobapps/?timestamp=${timestamp}`;

export const NOTES = jobappId => `${apiRoot}/api/jobapps/${jobappId}/notes/`;

//METRICS REQUESTS//
export const METRICS = type => `${apiRoot}/api/metrics/${type}`;

//COMPANIES REQUESTS//
export const COMPANIES = `${apiRoot}/api/companies/`;

//ALUMNI REQUESTS//
export const ALUMNI = `${apiRoot}/api/alumni/`;

//EVENTS REQUESTS//
export const EVENTS = `${apiRoot}/api/events/`;

//BLOGS REQUESTS//
export const BLOGS = `${apiRoot}/api/blogs/`;

//REVIEWS REQUESTS//
export const REVIEWS = `${apiRoot}/api/reviews/`;

export const SOURCE_TYPES = `${apiRoot}/api/reviews/sourceTypes/`;

//AUTOCOMPLETE REQUEST//
export const AUTOCOMPLETE = type => `${apiRoot}/api/${type}/`;

//POLL REQUESTS//
export const GET_POLL = `${apiRoot}/api/poll/`;

export const VOTE_POLL = pollId => `${apiRoot}/api/poll/${pollId}/vote/`;

//NOTIFICATIONS REQUESTS//
export const NOTIFICATIONS = `${apiRoot}/api/notifications/`;

//DOCUMENTS PAGES REQUESTS//
export const FAQS = `${apiRoot}/api/faqs/`;

export const AGREEMENTS = `${apiRoot}/api/agreements/`;
