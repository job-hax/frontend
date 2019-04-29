import {
  ADD_JOB_APPS,
  ADD_NOTE,
  AUTHENTICATE,
  DELETE_JOB,
  DELETE_NOTE,
  GET_APPLICATION_COUNT_BY_MONTH,
  GET_APPLICATION_COUNT_BY_MONTH_WITH_TOTAL,
  GET_COUNT_BY_JOBTITLE_AND_STATUSES,
  GET_COUNT_BY_STATUSES,
  GET_JOB_APPS,
  GET_NOTES,
  GET_TOTAL_APPLICATION_COUNT,
  GET_WORD_COUNT,
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
  GET_BLOG,
  GET_EMPLOYMENT_AUTHS
} from "../constants/endpoints.js";

import { jobHaxClientId, jobHaxClientSecret } from "../../config/config.js";

export const authenticateRequest = {
  url: AUTHENTICATE,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret,
      provider: "google-oauth2"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
    }
  }
};

export const loginUserRequest = {
  url: LOGIN_USER,
  config: {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret
    }
  }
};

//METRICS DATA REQUESTS//

export const getTotalAppsCountRequest = {
  url: GET_TOTAL_APPLICATION_COUNT,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  }
};

export const getAppsCountByMonthRequest = {
  url: GET_APPLICATION_COUNT_BY_MONTH,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  }
};

export const getAppsCountByMonthWithTotalRequest = {
  url: GET_APPLICATION_COUNT_BY_MONTH_WITH_TOTAL,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  }
};

export const getCountByStatusesRequest = {
  url: GET_COUNT_BY_STATUSES,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  }
};

export const getCountByJobtitleAndStatusesRequest = {
  url: GET_COUNT_BY_JOBTITLE_AND_STATUSES,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  }
};

export const getWordCountRequest = {
  url: GET_WORD_COUNT,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
    }
  }
};

//BLOG REQUESTS//
export const getblogsRequest = {
  url: GET_BLOGS,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  }
};

export const getblogRequest = {
  url: GET_BLOG,
  config: {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json"
    }
  }
};
