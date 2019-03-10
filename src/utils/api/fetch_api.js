import {mockJobApps} from './mockResponses';
import {IS_MOCKING} from '../../config/config.js';

export function fetchApi(url, config) {
  return new Promise(resolve => {
    if (IS_MOCKING) {
      resolve(mockJobApps.data);
    }
    fetch(url, config)
      .then(response => {
        if (response.ok) {
          response.json()
            .then(json => resolve({ok: true, json}));
        } else {
          response.json()
            .then(json => resolve({ok: false, json}));
        }
      })
      .catch(error => {
        resolve({ok: false, error})
      });
  });
}
