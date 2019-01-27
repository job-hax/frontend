import {mockJobApps} from './mockResponses'

export function fetchApi() {
  return new Promise((resolve, reject) => {
    return resolve(mockJobApps.data);
  })
}