import {
  AUTHENTICATE,
  GET_JOB_APPS,
  ADD_JOB_APPS,
  SYNC_USER_EMAILS,
  REGISTER_USER,
  GET_TOTAL_APPLICATION_COUNT,
  GET_APPLICATION_COUNT_BY_MONTH,
  GET_APPLICATION_COUNT_BY_MONTH_WITH_TOTAL,
  GET_COUNT_BY_JOBTITLE_AND_STATUSES,
  GET_COUNT_BY_STATUSES,
  GET_WORD_COUNT,
  UPDATE_JOB_STATUS,
  UPDATE_NOTE,
  ADD_NOTE,
  DELETE_NOTE,
  GET_NOTES,
  DELETE_JOB
} from "../constants/endpoints.js";

import { jobHaxClientId, jobHaxClientSecret } from '../../config/config.js';

export const authenticateRequest = {
  url: AUTHENTICATE,
  config: {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret,
      provider: 'google-oauth2'
    }
  }
};

export const getJobAppsRequest = {
  url: GET_JOB_APPS,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const addJobAppsRequest = {
  url: ADD_JOB_APPS,
  config: {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const syncUserEmailsRequest = {
  url: SYNC_USER_EMAILS,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const updateJobStatusRequest = {
  url: UPDATE_JOB_STATUS,
  config: {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const registerUserRequest = {
  url: REGISTER_USER,
  config: {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

//METRICS DATA REQUESTS//

export const getTotalAppsCountRequest = {
  url: GET_TOTAL_APPLICATION_COUNT,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const getAppsCountByMonthRequest = {
  url: GET_APPLICATION_COUNT_BY_MONTH,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const getAppsCountByMonthWithTotalRequest = {
  url: GET_APPLICATION_COUNT_BY_MONTH_WITH_TOTAL,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const getCountByStatusesRequest = {
  url: GET_COUNT_BY_STATUSES,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const getCountByJobtitleAndStatusesRequest = {
  url: GET_COUNT_BY_JOBTITLE_AND_STATUSES,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

export const getWordCountRequest = {
  url: GET_WORD_COUNT,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    }
  }
};

//NOTE REQUESTS//
export const updateNote = {
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

export const addNote = {
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

export const deleteNote = {
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

export const getNotes = {
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

export const deleteJob = {
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
