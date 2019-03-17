import {mockJobApps} from './mockResponses';

export function fetchApi(url, config) {
  return new Promise(resolve => {
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
