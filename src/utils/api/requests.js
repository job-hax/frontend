import {
  AUTHENTICATE,
  GET_JOB_APPS,
  SYNC_USER_EMAILS,
  REGISTER_USER,
} from '../constants/endpoints.js';

import {
  jobHaxClientId,
  jobHaxClientSecret
} from '../../config/config.js';

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
  },
};

export const getJobAppsRequest = {
  url: GET_JOB_APPS,
  config: {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
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
      "Content-Type": "application/json"
    },
  }
};

