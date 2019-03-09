import {mockJobApps} from './mockResponses';
import {IS_MOCKING} from '../../config/config.js';

export function fetchApi(config) {
  return new Promise(resolve => {
    if (IS_MOCKING) {
      resolve(mockJobApps.data);
    }
    fetch(config.url, {
      method: config.method,
      mode: "cors",
      cache: "no-cache",
      headers: {
        // "Content-Type": "application/json",
        "Authorization": "Bearer 4NmE64ideNk22bXe9DytMvQbGI7BOq",
        "Access-Control-Allow-Origin": "*"
      },
    })
      .then(response => {
        // console.log('1 response', response);
        resolve(response);
      })
      .catch(error => {
        // console.log('error', error);
        resolve(error);
      });
  });
}
