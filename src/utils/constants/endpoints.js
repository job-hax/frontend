export const apiRoot = "https://jts-be.jobhax.com"; //"https://jts-be.jobhax.com"; //"http://10.0.0.77:8000"; //"http://0.0.0.0:8000";

export const jobPostingApiRoot = "https://ats-be.jobhax.com";

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

export const FILES = jobappId => `${apiRoot}/api/jobapps/${jobappId}/files/`;

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

export const EMPLOYMENT_AUTHORIZATIONS = `${apiRoot}/api/reviews/employmentAuthorizations/`;

//AUTOCOMPLETE REQUEST//
export const AUTOCOMPLETE = type => `${apiRoot}/api/${type}/`;

//POLL REQUESTS//
export const GET_POLL = `${apiRoot}/api/polls/`;

export const VOTE_POLL = pollId => `${apiRoot}/api/polls/${pollId}/vote/`;

//NOTIFICATIONS REQUESTS//
export const NOTIFICATIONS = `${apiRoot}/api/notifications/`;

//TOKENLESS REQUESTS//
export const FAQS = `${apiRoot}/api/faqs/`;

export const AGREEMENTS = `${apiRoot}/api/agreements/`;

export const FEEDBACKS = `${apiRoot}/api/feedbacks/`;

//COLLEGE REQUESTS//

export const COLLEGES = type => `${apiRoot}/api/colleges/${type}/`;

//JOBS REQUESTS//

export const JOBS = parameters =>
  `${jobPostingApiRoot}/api/positions/company${parameters}/`;

export const SUBMIT_JOB_APPLICATION = `${jobPostingApiRoot}/api/positionapps/apply/`;
