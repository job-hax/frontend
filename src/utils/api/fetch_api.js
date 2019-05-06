import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";

export function fetchApi(url, config) {
  return new Promise(resolve => {
    fetch(url, config)
      .then(response => {
        IS_CONSOLE_LOG_OPEN &&
          console.log(
            "Request : ",
            url,
            " Params : ",
            config,
            " Response : ",
            response
          );
        if (response.ok) {
          response.json().then(json => resolve({ ok: true, json }));
        } else {
          resolve({ ok: false, json: response.status });
        }
      })
      .catch(error => resolve({ ok: false, error }));
  });
}
