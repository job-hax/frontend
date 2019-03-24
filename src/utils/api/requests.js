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
  LOGIN_USER,
  REGISTER_USER,
  SYNC_USER_EMAILS,
  UPDATE_JOB_STATUS,
  UPDATE_NOTE
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

export const loginUserRequest = {
  url: LOGIN_USER,
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
    },
    body: {
      client_id: jobHaxClientId,
      client_secret: jobHaxClientSecret,
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
