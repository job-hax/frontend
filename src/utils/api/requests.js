import {
  ADD_JOB_APPS,
  ADD_NOTE,
  AUTHENTICATE,
  DELETE_JOB,
  DELETE_NOTE,
  GET_JOB_APPS,
  GET_NOTES,
  GET_STATISTICS,
  GET_MONTHLY_APPLICATION_COUNT,
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  SYNC_USER_EMAILS,
  UPDATE_JOB_STATUS,
  UPDATE_NOTE,
  GET_POLL,
  VOTE_POLL,
  NOTIFICATIONS,
  UPDATE_PROFILE_PHOTO,
  GET_PROFILE,
  GET_EMPLOYMENT_STATUSES,
  UPDATE_PROFILE,
  FEEDBACK,
  REVIEW_SUBMIT,
  GET_SOURCE_TYPES,
  GET_REVIEWS,
  GET_FAQS,
  GET_BLOGS,
  GET_OR_POST_BLOG,
  GET_EMPLOYMENT_AUTHS,
  GET_COMPANIES,
  GET_AGREEMENTS,
  USERS,
  POSITIONS,
  REFRESH_JOBHAX_TOKEN,
  UPDATE_GOOGLE_TOKEN,
  METRICS,
  GET_SOURCES,
  EDIT_JOBAPP,
  GET_CONTACTS,
  POST_CONTACTS,
  GET_NEW_JOBAPPS
} from "../constants/endpoints.js";

import { jobHaxClientId, jobHaxClientSecret } from "../../config/config.js";

export const authenticateRequest = {
  url: AUTHENTICATE,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret,
      provider: "google-oauth2"
    }
  }
};

export const refreshTokenRequest = {
  url: REFRESH_JOBHAX_TOKEN,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret
    }
  }
};

export const updateGoogleTokenRequest = {
  url: UPDATE_GOOGLE_TOKEN,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getJobAppsRequest = {
  url: GET_JOB_APPS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const addJobAppsRequest = {
  url: ADD_JOB_APPS,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const syncUserEmailsRequest = {
  url: SYNC_USER_EMAILS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const updateJobStatusRequest = {
  url: UPDATE_JOB_STATUS,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getNewJobappsRequest = {
  url: GET_NEW_JOBAPPS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//USER AUTH REQUESTS//

export const loginUserRequest = {
  url: LOGIN_USER,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret
    }
  }
};

export const registerUserRequest = {
  url: REGISTER_USER,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret
    }
  }
};

export const logOutUserRequest = {
  url: LOGOUT_USER,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret
    }
  }
};

//METRICS DATA REQUESTS//

export const getMetrics = {
  url: METRICS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//GLOBAL METRICS DATA REQUESTS//
export const getTrendingRequest = {
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getStatisticsRequest = {
  url: GET_STATISTICS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getMonthlyApplicationCountRequest = {
  url: GET_MONTHLY_APPLICATION_COUNT,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//NOTE REQUESTS//
export const updateNoteRequest = {
  url: UPDATE_NOTE,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const addNoteRequest = {
  url: ADD_NOTE,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const deleteNoteRequest = {
  url: DELETE_NOTE,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getNotesRequest = {
  url: GET_NOTES,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const deleteJobRequest = {
  url: DELETE_JOB,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//POLL REQUESTS//
export const getPollRequest = {
  url: GET_POLL,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const votePollRequest = {
  url: VOTE_POLL,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//NOTIFICATIONS REQUEST//
export const notificationsRequest = {
  url: NOTIFICATIONS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//PROFILE REQUESTS//
export const updateProfilePhotoRequest = {
  url: UPDATE_PROFILE_PHOTO,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
};

export const getProfileRequest = {
  url: GET_PROFILE,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getEmploymentStatusesRequest = {
  url: GET_EMPLOYMENT_STATUSES,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const updateProfileRequest = {
  url: UPDATE_PROFILE,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//FEEDBACK//
export const feedbackRequest = {
  url: FEEDBACK,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//REVIEWS//
export const reviewSubmitRequest = {
  url: REVIEW_SUBMIT,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getSourceTypesRequest = {
  url: GET_SOURCE_TYPES,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getReviewsRequest = {
  url: GET_REVIEWS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getEmploymentAuthsRequest = {
  url: GET_EMPLOYMENT_AUTHS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//FAQS//
export const getFAQsRequest = {
  url: GET_FAQS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//BLOG REQUESTS//
export const getBlogsRequest = {
  url: GET_BLOGS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getBlogRequest = {
  url: GET_OR_POST_BLOG,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const postBlogRequest = {
  url: GET_OR_POST_BLOG,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//AGREEMENTS REQUEST//

export const getAgreementsRequest = {
  url: GET_AGREEMENTS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//COMPANIES REQUESTS//

export const getCompaniesRequest = {
  url: GET_COMPANIES,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//USERS REQUESTS//
export const postUsersRequest = {
  url: USERS,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

export const getUsersRequest = {
  url: USERS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//POSITIONS REQUESTS//
export const getPositionsRequest = {
  url: POSITIONS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//SOURCES REQUESTS//
export const getSourcesRequest = {
  url: GET_SOURCES,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//EDIT JOBAPP REQUEST//
export const editJobAppRequest = {
  url: EDIT_JOBAPP,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};

//CONTACTS REQUESTS//
export const getContactsRequest = {
  url: GET_CONTACTS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};
export const postContactsRequest = {
  url: POST_CONTACTS,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }
};
